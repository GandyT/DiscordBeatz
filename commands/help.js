let helpEmbed = {title: '**HELP**', fields: [
    {name: 'to play a song:', value: '1. You must be in a vc.\n2. Type b.play <songname> to play a song.'},
    {name: 'game controls:', value: 'You will be asked to type a letter in chat. The letter can be either z or x, the bot will tell you.'},
    // i'd like to add the different leaderboard options but your system was made only for points so i'll make a users.json sometime
    // {name: 'to view leaderboards for a song:', value: 'type b.lb <songname> <metric to sort by:\ncan be acc (accuracy), pts (total points), gp (games played), gw (games won), or w/l (win/loss ratio);\nthis defaults to score>'},
    {name: 'to view leaderboards for a song:', value: 'type b.lb <songname> '},
    {name: 'to view a list of all available songs to play:', value: 'type b.songlist'},
    {name: 'how does it work?', value: 'the maps are timed to the rhythm of the song'}],
    footer: {text: 'have fun!'}}

module.exports = {
    names: ["help"],
    async execute(Env) {
        const { message } = Env;
        message.channel.send({embed: helpEmbed})
    }
}

//saving the original just in case
 // new Discord.MessageEmbed()
 //     .setTitle("**HELP**")
 //     .setDescription(`You will be asked to type a letter in chat. The letter can be either z or x, the bot will tell you. Type b.play <songname> to play a song. you must be in a vc. type b.lb <songname> to get leaderboards for it. type b.songlist to get a list of all the currently available songs you can play. the maps are timed to the rhythm of the song. have fun!`)