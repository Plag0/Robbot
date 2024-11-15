const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const yahooFinance = require('yahoo-finance2').default;
const { URL } = require('url');

module.exports = {
    category: 'stock-market',
	cooldown: 3,
    data: new SlashCommandBuilder()
        .setName('close')
        .setDescription('Closes a position.')
        .addStringOption(option =>
            option.setName('position_id')
                .setDescription('The ID for the position you want to close.')
                .setRequired(true)
        ),
    async execute(interaction) {
        console.log("empty method");
    }
};
