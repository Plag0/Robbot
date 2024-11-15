// services/userService.js

const { User } = require('../models');

/**
 * Retrieves a user from the database or creates a new one if not found.
 * @param {string} discordId - The Discord ID of the user.
 * @returns {Promise<User>} - The user record from the database.
 */
async function findOrCreateUser(discordId, username) {
    try {
        const [user, created] = await User.findOrCreate({
            where: { discord_id: discordId }
        });

        if (created) {
            console.log(`New user created: ${username} (${discordId})`);
        }

        return user;
    } catch (error) {
        console.error('Error in findOrCreateUser:', error);
        throw error;
    }
}

module.exports = {
    findOrCreateUser,
};
