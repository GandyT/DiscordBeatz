const {PREFIX} = require('../resource/modules/config.json');
let helpEmbed = {title: '**HELP**', fields: [], footer: {text: 'have fun!'}}

function aliases(names)
{
    let returnStr = `aliases: `
    switch (names.length)
    {
        case 1:
            returnStr += 'none';
            break;
        case 2:
            returnStr += names.pop();
            break;
        case 3:
            returnStr += names.slice(1).join(' and ');
            break;
        default:
            returnStr == `${names.slice(1, -1).join(', ')} and ${names.pop()}`;
    }
    return returnStr;
}

module.exports = {
    names: ["help"], description: 'displays all available commands and info about them',
    async execute(Env) {
        const { message, client, args } = Env;
        if (!args[1]) {
            client.commands.filter(cmd => !cmd.hide)
            .forEach(cmd => helpEmbed.fields.push({
                name: `${PREFIX}${cmd.names[0]}`,
                value: cmd.description 
            }))
            helpEmbed.fields.push({name: 'how to play:', value: '1) you must be in a vc\n2) The bot will prompt you to type either z or x in chat.'},
                {name: 'how does it work?', value: 'the maps are timed to the rhythm of the song\nthe faster you type the letter, the more points you will recieve.'});
        } else {
            let cmd = client.commands.filter(c => !c.hide).find(command => command.names.includes(args[1]));
            if (!cmd) return message.channel.send('no command with that name exists.');
            helpEmbed.title = `${PREFIX}${cmd.names[0]}`;
            helpEmbed.description = aliases(cmd.names);
            if (cmd.description) helpEmbed.fields.push({name: 'what does it do?', value: cmd.description});
            if (cmd.usage) helpEmbed.fields.push({name: 'usage', value: `${PREFIX}${cmd.usage.replace(/\[pref\]/g, PREFIX)}`});
            if (cmd.notes) helpEmbed.fields.push({name: 'extra info', value: cmd.notes});
        }
        return message.channel.send({embed: helpEmbed})
    }
}

/* saving the original just in case
new Discord.MessageEmbed()
    .setTitle("**HELP**")
    .setDescription(`You will be asked to type a letter in chat. The letter can be either z or x, the bot will tell you. Type b.play <songname> to play a song. you must be in a vc. type b.lb <songname> to get leaderboards for it. type b.songlist to get a list of all the currently available songs you can play. the maps are timed to the rhythm of the song. have fun!`)

    {name: 'to play a song:', value: '1. You must be in a vc.\n2. Type b.play <songname> to play a song.'},
    {name: 'game controls:', value: 'You will be asked to type a letter in chat. The letter can be either z or x, the bot will tell you.'},
    {name: 'to view leaderboards for a song:', value: 'type b.lb <songname> '},
    {name: 'to view a list of all available songs to play:', value: 'type b.songlist'},
    {name: 'how does it work?', value: 'the maps are timed to the rhythm of the song'}
*/