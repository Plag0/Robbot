// commands/stock-market/positions.js

const { SlashCommandBuilder } = require('discord.js');
const menuNavigator = require('../../utils/menuNavigator');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('positions')
        .setDescription('Displays a user\'s positions.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Choose whose positions you want to see.')
        )
        .addStringOption(option =>
            option.setName('ticker')
                .setDescription('Choose the security you want to see positions for.')
        )
        .addStringOption(option =>
            option.setName('sort_by')
                .setDescription('Choose how the positions should be sorted')
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
            ticker: interaction.options.getString('ticker') || 'VOO',
            sortBy: interaction.options.getString('sort_by') || 'most_value',
            hidden: interaction.options.getBoolean('hidden') || false,
        };

        await menuNavigator('positions', interaction, context);
    },
};
