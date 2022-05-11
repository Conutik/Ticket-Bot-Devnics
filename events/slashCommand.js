
module.exports = {
	name: 'interactionCreate',
	once: false,
	run: async (interaction, bot) => {

        if(!interaction.isCommand()) return;
		let args = interaction.options

        if (!bot.slashcommands.has(interaction.commandName)) return;

		try {
            bot.slashcommands.get(interaction.commandName).run(bot, interaction, args);
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'There was an error trying to execute that command!' });
        }
}}