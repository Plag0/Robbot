// commands/stock-market/portfolio.js

const { SlashCommandBuilder } = require('discord.js');
const menuNavigator = require('../../utils/menuNavigator');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('portfolio')
        .setDescription('Displays a user\'s portfolio.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Choose whose portfolio you want to see.')
        )
        .addStringOption(option =>
            option.setName('sort_by')
                .setDescription('Choose how the portfolio should be sorted')
                .addChoices(
                    { name: 'Most Value', value: 'most_value' },
                    { name: 'Least Value', value: 'least_value' },
                    { name: 'Most Profit', value: 'most_profit' },
                    { name: 'Least Profit', value: 'least_profit' },
                    { name: 'Most Units', value: 'most_units' },
                    { name: 'Least Units', value: 'least_units' }
                )
        )
        .addBooleanOption(option =>
            option.setName('hidden')
                .setDescription('Should this message be ephemeral (only viewable by you)?')
        ),
    async execute(interaction) {
        const context = {
            userId: interaction.user.id,
            targetUser: interaction.options.getUser('user') || interaction.user,
            sortBy: interaction.options.getString('sort_by') || 'most_value',
            hidden: interaction.options.getBoolean('hidden') || false,
        };

        await menuNavigator('portfolio', interaction, context);
    },
};
