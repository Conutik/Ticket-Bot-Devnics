const tickets = require('../ticketCreation.js')
const {createTicket} = require("../ticketCreation");
module.exports = {
    name: 'interactionCreate',
    once: false,
    run: async (interaction, bot) => {

        if (!interaction.isSelectMenu()) return;
        if(interaction.customId !== "ticketSelect") return;
        delete require.cache[require.resolve('../config.json')]
        let config = require('../config.json')
        let map = config.ticketCategories.filter(x => x.name.toLowerCase() === interaction.values[0])
        createTicket(bot, interaction, map, config)
    }}