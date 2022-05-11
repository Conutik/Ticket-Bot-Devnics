const { Client, Intents } = require('discord.js');
const fs = require('fs');

const bot = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS]
})

config = require('./config.json')
	
//////////////////////////////////////////////
//              EVENT MANAGEMENT            //
//////////////////////////////////////////////


const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	console.log('Event' + ` | ` + event.name + ` has loaded.`)
	if (event.once) {
		bot.once(event.name, (...args) => event.run(...args, bot));
	} else {
		bot.on(event.name, (...args) => event.run(...args, bot));
	}
}


bot.login(config.botToken)