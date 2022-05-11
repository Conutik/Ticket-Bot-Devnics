const quick = require('quick.db');

module.exports = {
    name: 'messageCreate',
    once: false,
    run: async(message, bot) => {

        if(message.author.bot || message.channel.type === '' || message.stickers.size >= 1) return;

        let ticketData = quick.get(`${message.guild.id}.${message.channel.id}`)

        if(ticketData) {

            let obj = {
                date: message.createdTimestamp,
                content: message.content,
                edited: false,
                sender: message.author.username
            }

            quick.set(`${message.guild.id}.${message.channel.id}.messages.${message.id}`, obj)
        }

    }}