// menus/PortfolioMenu.js

const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
} = require('discord.js');
const { unifiedReply, getInteractionMessage } = require('../utils/interactionUtils');

class PortfolioMenu {
    constructor(interaction, context, navigate) {
        this.interaction = interaction;
        this.context = context;
        this.navigate = navigate;
    }

    async display() {
        const { userId, targetUser, sortBy, hidden } = this.context;

        const managePositionsButton = new ButtonBuilder()
            .setCustomId(`manage_positions_${userId}`)
            .setLabel('Manage Positions')
            .setStyle(ButtonStyle.Primary);

        const refreshButton = new ButtonBuilder()
            .setCustomId(`refresh_portfolio_${userId}`)
            .setLabel('Refresh')
            .setStyle(ButtonStyle.Secondary);

        const sortByButton = new ButtonBuilder()
            .setCustomId(`sort_portfolio_${userId}`)
            .setLabel('Sort By')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder()
            .addComponents(managePositionsButton, refreshButton, sortByButton);

        await unifiedReply(this.interaction, {
            content: `Portfolio of ${targetUser.username}`,
            components: [row],
            ephemeral: hidden,
        });

        const response = await getInteractionMessage(this.interaction);

        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 3600000,
            filter: (i) => i.user.id === userId,
        });

        collector.on('collect', async (i) => {
            await i.deferUpdate();

            if (i.customId === `manage_positions_${userId}`) {
                // Navigate to PositionsMenu
                this.navigate('positions', i, this.context);
            } else if (i.customId === `refresh_portfolio_${userId}`) {
                // Refresh portfolio data
                await i.editReply({
                    content: `Portfolio of ${targetUser.username} (refreshed)`,
                    components: [row],
                });
            } else if (i.customId === `sort_portfolio_${userId}`) {
                // Update sortBy parameter in context
                this.context.sortBy = this.context.sortBy === 'most_value' ? 'least_value' : 'most_value';
                // Refresh the portfolio display
                await i.editReply({
                    content: `Portfolio of ${targetUser.username} (sorted by ${this.context.sortBy})`,
                    components: [row],
                });
            }
        });

        collector.on('end', () => {
            // Optionally disable buttons when the collector ends
        });
    }
}

module.exports = PortfolioMenu;
