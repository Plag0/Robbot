// services/tradingService.js

const sequelize = require('../db');
const { User, Asset, Position, MarketTransaction } = require('../models');
const { Op } = require('sequelize');
const yahooFinance = require('yahoo-finance2').default;

/**
 * Opens a new trading position for a user.
 * @param {Object} params - Parameters for opening the position.
 * @returns {Object} - Result of the operation.
 */
async function openPosition(params) {
  const {
    userId,
    positionType,
    assetType,
    ticker,
    amountType,
    amountValue,
    orderType,
    limitPrice,
  } = params;

  const t = await sequelize.transaction();

  try {
    const user = await User.findByPk(userId, { transaction: t });
    if (!user) throw new Error('User not found.');

    const quote = await yahooFinance.quote(await getYahooFinanceSymbol(assetType, ticker));
    if (!quote) throw new Error('Asset not found.');

    const tickerVerified = quote.symbol

    // Fetch or create asset
    let asset = await Asset.findOne({ where: { symbol: tickerVerified, asset_type: assetType }, transaction: t });
    if (!asset) {
      const asset_name = quote.longName || quote.shortName;
      asset = await Asset.create({
        symbol: tickerVerified,
        name: asset_name,
        asset_type: assetType,
      }, { transaction: t });
    }

    // Determine price per share
    let pricePerShare;

    // For market orders, fetch current market price
    if (orderType === 'market') {
      pricePerShare = quote.regularMarketPrice;
    } else {
      // For limit and stop orders, use limitPrice
      pricePerShare = limitPrice;
    }

    // Calculate quantity based on amountType
    let quantity;
    if (amountType === 'dollar') {
      quantity = amountValue / pricePerShare;
    } else {
      quantity = amountValue;
    }

    if (quantity <= 0) throw new Error('Quantity must be greater than zero.');

    // Check user balance for long positions
    const totalCost = pricePerShare * quantity;
    if (positionType === 'long' && user.balance < totalCost) {
      throw new Error('Insufficient balance.');
    }

    // Deduct balance for long positions
    if (positionType === 'long') {
      user.balance -= totalCost;
      await user.save({ transaction: t });
    }

    // Create new position
    const position = await Position.create({
      user_id: user.user_id,
      asset_id: asset.asset_id,
      quantity,
      price_per_share: pricePerShare,
      position_type: positionType,
      status: 'open',
    }, { transaction: t });

    // Create market transaction
    await MarketTransaction.create({
      position_id: position.position_id,
      user_id: user.user_id,
      asset_id: asset.asset_id,
      quantity,
      price_per_share: pricePerShare,
      position_type: positionType,
      transaction_type: 'open',
    }, { transaction: t });

    // Commit transaction
    await t.commit();

    return { success: true, message: `Opened ${positionType} position on ${asset.symbol} (${quantity.toFixed(4)} shares at $${pricePerShare.toFixed(2)} per share).` };
  } catch (error) {
    await t.rollback();
    console.error('Error in openPosition:', error);
    throw error;
  }
}

async function getYahooFinanceSymbol(assetType, ticker) {
    let symbol = '';

    if (ticker.trim() === "") {
        throw new Error(`Ticker cannot be blank!`);
    }

    switch (assetType.toLowerCase()) {
        case 'stock':
        case 'etf':
            symbol = ticker.toUpperCase();
            break;
        
        case 'crypto':
            symbol = `${ticker.toUpperCase()}-USD`
            break;
        
        case 'commodity':
            // Quality of life feature so if you put GOLD as the ticker it will still find GC.
            if (ticker.length > 2) {
                const commoditySymbols = {
                    'GOLD': 'GC',
                    'SILVER': 'SI',
                    'COPPER': 'HG',
                    'OIL': 'CL',
                    'CRUDE': 'BZ',
                    'GAS': 'NG',
                    'PLATINUM': 'PL',
                    'PALLADIUM': 'PA',
                    'CORN': 'ZC',
                    'WHEAT': 'KE',
                    'OAT': 'ZO',
                    'CATTLE': 'LE',
                    'SOYBEAN': 'ZS',
                    'WISDOMTREE': 'GF',
                    'HOGS': 'HE',
                    'COCOA': 'CC',
                    'COFFEE': 'KC',
                    'COTTON': 'CT'
                }

                for (const key in commoditySymbols) {
                    if (ticker.toUpperCase().includes(key)) {
                        ticker = commoditySymbols[key];
                        break;
                    }
                }
            }
            symbol = `${ticker.toUpperCase()}=F`
            break;

        case 'forex':
            symbol = `${ticker.toUpperCase()}=X`;
            break;

        default:
            throw new Error(`Unsupported asset type: ${assetType}`);
    }

    return symbol;
}

module.exports = {
  openPosition,
};
