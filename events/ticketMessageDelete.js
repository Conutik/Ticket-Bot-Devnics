const quick = require('quick.db');

module.exports = {
    name: 'messageDelete',
    once: false,
    run: async(message, bot) => {

        if(message.author.bot || message.channel.type === '' || message.stickers.size >= 1) return;

        let ticketData = quick.get(`${message.guild.id}.${message.channel.id}`)

        if(ticketData) {
            quick.delete(`${message.guild.id}.${message.channel.id}.messages.${message.id}`)
        }

    }}