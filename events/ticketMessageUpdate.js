const quick = require("quick.db");
module.exports = {
    name: 'messageUpdate',
    once: false,
    run: async(oldMessage, newMessage, bot) => {

        if(newMessage.author.bot || newMessage.channel.type === '' || newMessage.stickers.size >= 1) return;

        let ticketData = quick.get(`${newMessage.guild.id}.${newMessage.channel.id}`)

        if(ticketData) {
            quick.set(`${newMessage.guild.id}.${newMessage.channel.id}.messages.${newMessage.id}.edited`, true)
            quick.set(`${newMessage.guild.id}.${newMessage.channel.id}.messages.${newMessage.id}.content`, newMessage.content)
        }

    }}