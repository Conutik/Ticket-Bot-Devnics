
const { Collection } = require('discord.js')

module.exports = {
	name: 'ready',
	once: true,
	run: async(bot) => {

		bot.interactions = new Collection()
		let config = require('../config.json')

		const interactionManager = require('../handlers/interaction.js');
		await interactionManager(bot)


		let arrayOfSlash = bot.interactions.get('slash')
		await bot.application.commands.set(arrayOfSlash)

		console.log(`Ready! ${bot.user.tag}`)
		bot.user.setActivity(config.activity, { type: `WATCHING` });
		bot.user.setStatus('dnd')
	}}