const { MessageEmbed, MessageActionRow, MessageSelectMenu} = require('discord.js');
const config = require("../../config.json");

module.exports = {
    config: {
        name: 'sendembed',
        description: 'send embed',
    },
    run: async (bot, interaction, args) => {

        if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, content: "You don't have permission"})

        interaction.reply({ ephemeral: true, content: "Generating Embed"})

        delete require.cache[require.resolve('../../config.json')]
        let config = require('../../config.json')

        let array = [];

        for(a = 0; a < config.ticketCategories.length; a++) {
            let s = config.ticketCategories[a]
            array.push({
                label: s.name,
                description: "Opens a ticket for " + s.name,
                value: s.name.toLowerCase()
            })
        }

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('ticketSelect')
                    .setPlaceholder('Nothing selected')
                    .addOptions(array)
            );

        let embed = new MessageEmbed()

        config = config.embed;

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
            return interaction.channel.send({ embeds: [embed], components: [row] })
        } else if(config.author) {
            embed.setAuthor({ name: config.author });
            return interaction.channel.send({ embeds: [embed], components: [row] })
        } else if(config.authorImage) {
            embed.setAuthor({ name: " ", url: config.authorImage });
            return interaction.channel.send({ embeds: [embed], components: [row] })
        } else {
            return interaction.channel.send({ embeds: [embed], components: [row] })
        }



    }
}


