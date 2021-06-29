const Discord = require("discord.js");

module.exports = {
    names: ["help"],
    async execute(Env) {
        const { message, client, args } = Env;

        message.channel.send(
            new Discord.MessageEmbed()
                .setTitle("**HELP**")
                .setDescription(`You will be asked to type a letter in chat. The letter can be either z or x, the bot will tell you. Type b.play <songname> to play a song. you must be in a vc. type b.lb <songname> to get leaderboards for it. type b.songlist to get a list of all the currently available songs you can play. the maps are timed to the rhythm of the song. have fun!`)
        )
    }
}