// menus/PositionsMenu.js

const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
} = require('discord.js');
const { unifiedReply, getInteractionMessage } = require('../utils/interactionUtils');

class PositionsMenu {
    constructor(interaction, context, navigate) {
        this.interaction = interaction;
        this.context = context;
        this.navigate = navigate;
    }

    async display() {
        const { userId, targetUser, ticker, sortBy, hidden } = this.context;

        const backButton = new ButtonBuilder()
            .setCustomId(`back_to_portfolio_${userId}`)
            .setLabel('Back to Portfolio')
            .setStyle(ButtonStyle.Secondary);

        const openButton = new ButtonBuilder()
            .setCustomId(`open_position_${userId}`)
            .setLabel('Open Position')
            .setStyle(ButtonStyle.Success);

        const closeButton = new ButtonBuilder()
            .setCustomId(`close_position_${userId}`)
            .setLabel('Close Position')
            .setStyle(ButtonStyle.Danger);

        const editButton = new ButtonBuilder()
            .setCustomId(`edit_position_${userId}`)
            .setLabel('Edit TP/SL')
            .setStyle(ButtonStyle.Secondary);

        const refreshButton = new ButtonBuilder()
            .setCustomId(`refresh_positions_${userId}`)
            .setLabel('Refresh')
            .setStyle(ButtonStyle.Secondary);

        const sortByButton = new ButtonBuilder()
            .setCustomId(`sort_positions_${userId}`)
            .setLabel('Sort By')
            .setStyle(ButtonStyle.Secondary);

        const row1 = new ActionRowBuilder()
            .addComponents(openButton, closeButton, editButton);

        const row2 = new ActionRowBuilder()
            .addComponents(backButton, refreshButton, sortByButton);

        // Determine how to respond based on interaction type
        if (this.interaction.isCommand()) {
            await unifiedReply(this.interaction, {
                content: `Positions for ${targetUser.username}`,
                components: [row1, row2],
                ephemeral: hidden,
            });
        } else {
            await this.interaction.editReply({
                content: `Positions for ${targetUser.username}`,
                components: [row1, row2],
            });
        }

        const response = await getInteractionMessage(this.interaction);

        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 3600000,
            filter: (i) => i.user.id === userId,
        });

        collector.on('collect', async (i) => {
            await i.deferUpdate();

            if (i.customId === `back_to_portfolio_${userId}`) {
                // Navigate back to PortfolioMenu
                this.navigate('portfolio', i, this.context);
            } else if (i.customId === `refresh_positions_${userId}`) {
                // Refresh positions data
                await i.editReply({
                    content: `Positions for ${targetUser.username} (refreshed)`,
                    components: [row1, row2],
                });
            } else if (i.customId === `sort_positions_${userId}`) {
                // Update sortBy parameter in context
                this.context.sortBy = this.context.sortBy === 'most_value' ? 'least_value' : 'most_value';
                // Refresh the positions display
                await i.editReply({
                    content: `Positions for ${targetUser.username} (sorted by ${this.context.sortBy})`,
                    components: [row1, row2],
                });
            } else if (i.customId === `open_position_${userId}`) {
                // Handle opening a position
                await i.followUp({ content: 'Opening a new position...', ephemeral: true });
            } else if (i.customId === `close_position_${userId}`) {
                // Handle closing a position
                await i.followUp({ content: 'Closing a position...', ephemeral: true });
            } else if (i.customId === `edit_position_${userId}`) {
                // Handle editing a position
                await i.followUp({ content: 'Editing position...', ephemeral: true });
            }
        });

        collector.on('end', () => {
            // Optionally disable buttons when the collector ends
        });
    }
}

module.exports = PositionsMenu;
