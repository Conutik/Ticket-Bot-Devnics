const db = require('quick.db')
const {MessageEmbed} = require("discord.js");

module.exports = {
    config: {
        name: 'reset',
        description: 'Change ticket name',
        options: [{
            name: 'name',
            type: 'STRING',
            description: 'The new ticket name',
            required: true
        }],
    },
    run: async (bot, interaction, args) => {
        delete require.cache[require.resolve('../../config.json')]
        let config = require('../../config.json')
        let hasRoles = false;
        for(i = 0; i < config.ticketRoles.length; i++) {
            if(interaction.member.roles.cache.has(config.ticketRoles[i])) {
                hasRoles = true;
                break;
            }
        }

        if(!hasRoles) return interaction.reply({ content: "No Permissions!", ephemeral: true });

        interaction.guild.channels.cache.forEach(channel => {
            if(channel.name.includes('ticket')) channel.delete()
        })
        interaction.reply("Success!")

    }}