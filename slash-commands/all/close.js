const { Permissions, MessageEmbed, CommandInteractionOptionResolver, MessageButton, MessageActionRow } = require('discord.js');
const db = require('quick.db')
const hastebin = require('hastebin')

module.exports = {
    config: {
        name: 'close',
        description: 'Close the current ticket.'
    },
    run: async (bot, interaction, args) => {

        await interaction.deferReply()

        let ticketData = await db.get(`${interaction.guild.id}.${interaction.channel.id}`)
        if(!ticketData) return interaction.editReply({ content: "This isn't a ticket!", ephemeral: true });

        const ticketChannel = interaction.channel
        const ticketAuthorObj = await bot.users.fetch(ticketData.authorID)

        ///////
        let confirmButton = new MessageButton().setCustomId('yes').setStyle('DANGER').setLabel('Close')
        let denyButton = new MessageButton().setCustomId('no').setStyle('SECONDARY').setLabel('Cancel')
        const confirmRow = new MessageActionRow().addComponents([ confirmButton, denyButton ]);
        const buttonMessage = await interaction.editReply({ embeds: [ new MessageEmbed().setColor("GREEN").setDescription("Are you sure you want to close this ticket?") ], components: [confirmRow] })

        const btnFilter = i => i.customId === 'yes' || i.customId === 'no'
        const btnCollector = buttonMessage.createMessageComponentCollector({ btnFilter, time: 60000, errors: ['time'] });

        btnCollector.on('collect', async i => {
            if(i.user.id !== interaction.user.id) return i.reply({ embeds: [ new MessageEmbed().setColor("RED").setDescription("Only the interaction user can interact with the interface.") ], ephemeral: true })
            else {
                if(i.customId === 'yes') {let messages = db.get(`${interaction.guild.id}.${interaction.channel.id}.messages`)

                    if(messages) {
                        let size = Object.keys(messages).length;
                        let array = [];
                        for (messageData in messages) {
                            messageData = messages[messageData]
                            if (messageData.edited) {
                                array.push(`[${new Date(messageData.date).toString()}] (EDITED) ${messageData.sender}: ${messageData.content}`)
                            } else {
                                array.push(`[${new Date(messageData.date).toString()}] ${messageData.sender}: ${messageData.content}`)
                            }
                        }

                        let data = await hastebin.createPaste(array.join('\n'), {
                            raw: true,
                            contentType: 'text/plain',
                        }, {})
                        await interaction.editReply({ embeds: [ new MessageEmbed().setColor("BLUE").setDescription("Ticket closed.\nTranscript: " + data) ], components: [] })
                    }

                    if(!messages) await interaction.editReply({ embeds: [ new MessageEmbed().setColor("BLUE").setDescription("Ticket closed.") ], components: [] })

                    ticketChannel.permissionOverwrites.create(ticketAuthorObj, {
                        SEND_MESSAGES: null,
                        VIEW_CHANNEL: null
                    })


                    db.delete(`${interaction.guild.id}.${interaction.channel.id}`)


                    let parentID = db.get('parentCategory')
                    let parent;
                    if(!parentID) {
                        const categoryChannel = await interaction.guild.channels.create('ticket-archive', { type: 'GUILD_CATEGORY', permissionOverwrites: [{ id: interaction.guild.id, deny: [Permissions.FLAGS.VIEW_CHANNEL] }]})

                        db.set('parentCategory', categoryChannel.id);
                        await interaction.channel.setParent(categoryChannel);
                        await interaction.channel.setTopic(interaction.channel.topic + " | CLOSED")
                        parentID = db.get('parentCategory')
                    } else {
                        parent = await bot.channels.fetch(parentID)
                    }

                    perm = false
                    await interaction.channel.setParent(parent).catch(async x => {
                        if(x.code === 50035) {

                            const categoryChannel = await interaction.guild.channels.create('ticket-archive', { type: 'GUILD_CATEGORY', permissionOverwrites: [{ id: interaction.guild.id, deny: [Permissions.FLAGS.VIEW_CHANNEL] }]})

                            db.set('parentCategory', categoryChannel.id);
                            await interaction.channel.setParent(categoryChannel)
                            await interaction.channel.setTopic(interaction.channel.topic + " | CLOSED")
                            perm = true

                        }
                    })

                    if(perm == false) {
                        await interaction.channel.setParent(parent)
                        await interaction.channel.setTopic(interaction.channel.topic + " | CLOSED")
                    }
                    return btnCollector.stop()
                }
                else {
                    buttonMessage.edit({ embeds: [ cryUtil.messages.error({ text: 'Cancelled closing the ticket.', username: interaction.user.username })], components: [] })
                    return btnCollector.stop()
                }
            }
        })

        btnCollector.on('end', async(i, reason)=> {
            if(reason !== 'time') return
            return buttonMessage.edit({ embeds: [ cryUtil.messages.error({ text: 'Uh-oh, times up! Please run the interaction again.', username: interaction.user.username }) ], components: [] })
        })
        ///////

    }}