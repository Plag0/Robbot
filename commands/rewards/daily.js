const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');

module.exports = {
    category: 'rewards',
	cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Collect your daily reward!'),
    async execute(interaction) {
        await interaction.deferReply();

        const target = interaction.user;
        const cur = interaction.client.currencySymbol;
        const amount = 100;

        const embed = new EmbedBuilder()
            .setTitle(`💰 Daily`)
            .setDescription(`Recieved **${cur}${amount}**\nYou now have ${cur}${100}`)
            .setColor(Colors.Green)
            .setTimestamp()
            .setFooter({
                text: `${target.username}`,
                iconURL: `${target.displayAvatarURL()}`
            });

        await interaction.editReply({ embeds: [embed] });
    }
}