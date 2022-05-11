const { readdirSync } = require('fs');
const { Collection } = require('discord.js');

module.exports = async(bot) => {
    bot.slashcommands = new Collection()
    let commandArray = []
    const load = dirs => {
        const commands = readdirSync(`./slash-commands/${dirs}/`).filter(d => d.endsWith(`.js`));
        for(let file of commands) {
            let pull = require(`../slash-commands/${dirs}/${file}`);

            let slashCommand = {
                name: pull.config.name,
                description: pull.config.description,
            }
            if(pull.config.options) slashCommand.options = pull.config.options

            bot.slashcommands.set(pull.config.name, pull);
            commandArray.push(slashCommand)
            console.log('Slash-Command' + ` | ` + pull.config.name + ` has loaded.`)
        }
    };
    ['all'].forEach(x => load(x));
    bot.interactions.set('slash', commandArray)
}