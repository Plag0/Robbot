// utils/interactionUtils.js

/**
 * Unified reply function for handling interactions.
 * @param {import('discord.js').Interaction} interaction - The interaction to reply to.
 * @param {Object} options - The options for the reply.
 * @returns {Promise<void|Message|APIMessage>}
 */
async function unifiedReply(interaction, options) {
    try {
        if (interaction.replied || interaction.deferred) {
            // Interaction has already been replied to
            return await interaction.followUp(options);
        } else if (interaction.isCommand() || interaction.isContextMenuCommand()) {
            return await interaction.reply(options);
        } else if (interaction.isMessageComponent()) {
            return await interaction.update(options);
        } else {
            // Handle other interaction types or throw an error
            throw new Error('Unsupported interaction type in unifiedReply.');
        }
    } catch (error) {
        console.error('Error in unifiedReply:', error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: 'An error occurred.', ephemeral: true });
        }
    }
}

/**
 * Gets the message associated with an interaction.
 * @param {import('discord.js').Interaction} interaction - The interaction to get the message from.
 * @returns {Promise<Message>} The message associated with the interaction.
 */
async function getInteractionMessage(interaction) {
    return await interaction.fetchReply();
}

module.exports = {
    unifiedReply,
    getInteractionMessage,
};
