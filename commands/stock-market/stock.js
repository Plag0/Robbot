const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const yahooFinance = require('yahoo-finance2').default;
const { URL } = require('url');

module.exports = {
    category: 'stock-market',
	cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('stock')
        .setDescription('Displays info about a stock.')
        .addStringOption(option =>
            option.setName('symbol')
                .setDescription('Enter the stock ticker')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('time_frame')
                .setDescription('The time frame for historical data')
                .addChoices(
                    { name: '1D', value: '1d' },
                    { name: '7D', value: '7d' },
                    { name: '1M', value: '30d' },
                    { name: '3M', value: '90d' },
                    { name: '6M', value: '180d' },
                    { name: '1Y', value: '365d' },
                    { name: '3Y', value: '1095d' },
                    { name: '5Y', value: '1825d' },
                    { name: '10Y', value: '3650d' },
                    { name: 'ALL', value: '0d' }
                )
        )
        .addBooleanOption(option =>
            option.setName('hidden')
                .setDescription('Should this message be ephemeral (only viewable by you)?')
        ),
    async execute(interaction) {
        const symbol = interaction.options.getString('symbol').toUpperCase();

        await interaction.deferReply();

        try {
            const modules = ['price', 'assetProfile'];
            const quoteSummary = await yahooFinance.quoteSummary(symbol, { modules });
            const websiteUrl = quoteSummary.assetProfile?.website;

            let logoUrl = null;
            if (websiteUrl) {
                try {
                    const domain = new URL(websiteUrl).hostname;
                    logoUrl = `https://logo.clearbit.com/${domain}`;
                } catch (error) {
                    console.error('Error parsing website URL:', error);
                }
            }

            const priceData = quoteSummary?.price;
            if (priceData) {
                const price = priceData.regularMarketPrice;
                const changePercent = priceData.regularMarketChangePercent;
                const changeSign = changePercent >= 0 ? '+' : '';
                const color = changePercent >= 0 ? Colors.Green : Colors.Red;

                const embed = new EmbedBuilder()
                    .setTitle(`${priceData.longName || priceData.shortName} (${priceData.symbol})`)
                    .addFields(
                        { name: 'Price', value: `$${price.toFixed(2)}`, inline: true },
                        { name: 'Change', value: `${changeSign}${(changePercent).toFixed(2)}%`, inline: true }
                    )
                    .setColor(color)
                    .setTimestamp();

                if (logoUrl) {
                    embed.setThumbnail(logoUrl);
                }

                await interaction.editReply({ embeds: [embed] });
            } else {
                await interaction.editReply(`Could not retrieve data for symbol: ${symbol}`);
            }

        } catch (error) {
            console.error('Error fetching stock data:', error);
            await interaction.editReply(`An error occurred while fetching data for symbol: ${symbol}`);
        }
    },
};
