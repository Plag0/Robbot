// commands/open.js

const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const { openPosition } = require('../../functions/stockMarket');
const { findOrCreateUser } = require('../../functions/userService');

module.exports = {
    category: 'stock-market',
	cooldown: 3,
    data: new SlashCommandBuilder()
    .setName('open')
    .setDescription('Open a new trading position.')
    .addStringOption(option =>
      option.setName('position')
        .setDescription('Position type')
        .setRequired(true)
        .addChoices(
          { name: 'Long', value: 'long' },
          { name: 'Short', value: 'short' },
        ))
    .addStringOption(option =>
      option.setName('asset_type')
        .setDescription('Type of asset')
        .setRequired(true)
        .addChoices(
          { name: 'Stock', value: 'stock' },
          { name: 'ETF', value: 'etf' },
          { name: 'Crypto', value: 'crypto' },
          { name: 'Commodities', value: 'commodity' },
          { name: 'Forex', value: 'forex' }
        ))
    .addStringOption(option =>
      option.setName('ticker')
        .setDescription('Ticker symbol of the asset')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('amount_type')
        .setDescription('Amount type')
        .setRequired(true)
        .addChoices(
          { name: 'Dollar Amount', value: 'dollar' },
          { name: 'Shares', value: 'shares' },
        ))
    .addNumberOption(option =>
      option.setName('amount_value')
        .setDescription('Amount value')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('order_type')
        .setDescription('How your order should be executed.')
        .setRequired(true)
        .addChoices(
          { name: 'Market', value: 'market' },
          { name: 'Limit', value: 'limit' },
          { name: 'Stop', value: 'stop' },
        ))
    .addNumberOption(option =>
      option.setName('limit_price')
        .setDescription('Limit price (required for limit and stop orders)')
        .setRequired(false)),

async execute(interaction) {
    // Defer reply if processing might take time
    await interaction.deferReply();

    try {
        // Extract options
        const positionType = interaction.options.getString('position');
        const assetType = interaction.options.getString('asset_type');
        const ticker = interaction.options.getString('ticker').toUpperCase();
        const amountType = interaction.options.getString('amount_type');
        const amountValue = interaction.options.getNumber('amount_value');
        const orderType = interaction.options.getString('order_type');
        const limitPrice = interaction.options.getNumber('limit_price');

        // Validate limitPrice for limit and stop orders
        if ((orderType === 'limit' || orderType === 'stop') && !limitPrice) {
        return interaction.editReply('You must provide a limit price for limit and stop orders.');
        }

        // Get user information
        const userId = interaction.user.id;
        const user = await findOrCreateUser(userId, interaction.user.username);

        // Call the modular function to open a position
        const result = await openPosition({
        userId: user.user_id,
        positionType,
        assetType,
        ticker,
        amountType,
        amountValue,
        orderType,
        limitPrice,
        });

        // Send success message
        const embed = new EmbedBuilder()
        .setTitle('Position Opened')
        .setDescription(result.message)
        .setColor(Colors.Green);

        return interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error('Error opening position:', error);
        return interaction.editReply('An error occurred while opening your position.');
    }
    },
};
