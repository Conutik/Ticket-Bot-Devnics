const db = require('quick.db')
const {MessageEmbed} = require("discord.js");

module.exports = {
    config: {
        name: 'name',
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

        let ticket = db.get(`${interaction.guild.id}.${interaction.channel.id}`)
        if(!ticket) return interaction.reply({ content: "This isn't a ticket!", ephemeral: true });

        let newName = args.getString('name')
        newName = newName.replace(" ", "-")

        interaction.channel.setName(newName)

        let embeds = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`<:bot_success:864977356317130783> **${interaction.user.username}**, Renamed this ticket to \`${newName}\``)

        interaction.reply({ embeds: [embeds] })

    }}