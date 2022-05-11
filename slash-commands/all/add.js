const db = require('quick.db')
const {MessageEmbed} = require("discord.js");

module.exports = {
    config: {
        name: 'add',
        description: 'Add a user to the current ticket.',
        options: [{
            name: 'user',
            type: 'USER',
            description: 'The user to add to this ticket.',
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

        const userToAdd = args.getUser('user');
        interaction.channel.permissionOverwrites.create(userToAdd, {
            SEND_MESSAGES: true,
            VIEW_CHANNEL: true
        })

        let embeds = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`<:bot_success:864977356317130783> **${interaction.user.username}**, Added ${userToAdd} to ${interaction.channel}`)

        interaction.reply({ embeds: [embeds] })

    }}