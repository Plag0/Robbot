// utils/menuNavigator.js

const PortfolioMenu = require('../menus/PortfolioMenu');
const PositionsMenu = require('../menus/PositionsMenu');

/**
 * Central navigation function to manage menu transitions.
 * @param {string} menuName - The name of the menu to display.
 * @param {import('discord.js').Interaction} interaction - The interaction object.
 * @param {Object} context - Shared context/state object.
 */
async function menuNavigator(menuName, interaction, context) {
    const navigate = (nextMenu, nextInteraction, updatedContext) => {
        menuNavigator(nextMenu, nextInteraction, updatedContext || context);
    };

    if (menuName === 'portfolio') {
        const portfolioMenu = new PortfolioMenu(interaction, context, navigate);
        await portfolioMenu.display();
    } else if (menuName === 'positions') {
        const positionsMenu = new PositionsMenu(interaction, context, navigate);
        await positionsMenu.display();
    }

    // Add more menus as needed...
}

module.exports = menuNavigator;
