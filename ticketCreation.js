const {MessageEmbed} = require("discord.js");
const db = require('quick.db')

const createEmbed = async function(config) {
    let embed = new MessageEmbed();

    if(config.color) embed.setColor(config.color);
    if(config.image) embed.setImage(config.image);
    if(config.footer) embed.setFooter({ text: config.footer });
    if(config.title) embed.setTitle(config.title);
    if(config.showTimestamp) embed.setTimestamp();
    if(config.thumbnail) embed.setThumbnail(config.thumbnail);
    if(config.fields) {
        config.fields.forEach(x => {
            embed.addField(x.title, x.text)
        })
    }
    if(config.authorImage && config.author) {
        embed.setAuthor({ name: config.author, url: config.authorImage });
    } else if(config.author) {
        embed.setAuthor({ name: config.author });
    } else if(config.authorImage) {
        embed.setAuthor({ name: " ", url: config.authorImage });
    }
    return embed;
}

const createTicket = async function(bot, interaction, categoryData, config) {
    if (interaction.user.bot) return;
    await interaction.reply({ content: 'Creating your ticket...', ephemeral: true })

    // create ticket channel
    const createdChannel = await interaction.guild.channels.create(`ticket-${interaction.user.username}`, { type: 'GUILD_TEXT', parent: interaction.guild.channels.cache.get(categoryData[0].categoryID) })
    await createdChannel.permissionOverwrites.create(interaction.member, {
        SEND_MESSAGES: true,
        VIEW_CHANNEL: true
    })
    await createdChannel.permissionOverwrites.create(interaction.guild.roles.everyone, {
        SEND_MESSAGES: false,
        VIEW_CHANNEL: false
    })

    if(config.ticketRoles) {
        config.ticketRoles.forEach(roleID => {
            createdChannel.permissionOverwrites.create(roleID, {
                SEND_MESSAGES: true,
                VIEW_CHANNEL: true
            })
        })
    }

    // ticket embed

    const secondTimestamp = Math.round(interaction.createdTimestamp / 1000)

    let embed = await createEmbed(config.ticketEmbed)

    let messg;

    if(config.ticketMention) {
        messg = await createdChannel.send({ embeds: [embed], content: "@everyone" })
    } else {
        messg = await createdChannel.send({ embeds: [embed] })
    }

    createdChannel.setTopic(`Ticket about: ${categoryData[0].name}`)

    let object = {
        authorID: interaction.user.id,
        timestamp: interaction.createdTimestamp
    }

    db.set(`${interaction.guild.id}.${createdChannel.id}`, object)

    let embeds = new MessageEmbed()
        .setColor("GREEN")
        .setDescription(`<:bot_success:864977356317130783> **${interaction.user.username}**, Your ticket has been created! ${createdChannel}`)

    interaction.editReply({ embeds: [ embeds ], content: null })

    let dataObj = [];

    let questionEmbed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle("Interactive Questions")
        .setDescription("The questions will appear shortly");
    let ms = await createdChannel.send({ embeds: [questionEmbed], ephemeral: true  })

    const questions = config.questions

    for (const x of questions) {
            questionEmbed.setDescription(x)
            ms.edit({ embeds: [questionEmbed] })
            let data = await sendCollector(createdChannel, interaction)
            dataObj.push({ data: data.content, question: x });
            embed.addField(x, data.content)
            data.delete()
    }

    ms.delete()

    messg.edit({ embeds: [embed] })

    db.set(createdChannel.id, dataObj)

    if(config.postTo) {
        let newEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("New Commission")
            .addField("Channel:", `<#${createdChannel.id}>`)

        dataObj.forEach(d => {
            newEmbed.addField(d.question, d.data)
        })
        let channel = interaction.guild.channels.cache.get(config.postTo)
        channel.send({ embeds: [newEmbed] })
    }


}

const sendCollector = async function(createdChannel, interaction) {
    return new Promise(async (resolve, reject) => {
        let filter = m => m.author.id === interaction.user.id;
        let collector = await createdChannel.createMessageCollector({ filter, time: 60000, max: 1 });

        collector.on('collect', m => {
            resolve(m)
        });

        collector.on('end', m => {
            if(m.size <=0) {
                createdChannel.delete();
                interaction.user.send("Your ticket at " + interaction.guild.name + " due to: ```Failure to reply to questions in time (1 minute)```")                                        }
        })
    })
}

module.exports = {
    createEmbed,
    createTicket
}