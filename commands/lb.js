const { DiscordAPIError } = require('discord.js');
var Fs = require('fs');
const Discord = require("discord.js");

module.exports = {
    names: ["leaderboard", "lb"],
    async execute(Env) {
        const { message, client, args } = Env;

        if (!args[1]) return message.channel.send("please specify a song name.");

        var songName = args.slice(1).join(" ");
        var path = `C:/Users/phone/OneDrive/Desktop/DiscordBeatz/resource/assets/${songName}/lb.json`;

        if (!Fs.existsSync(path)) return message.channel.send("No leaderboards for that song. be the first!");

        var data = JSON.parse(Fs.readFileSync(path));

        var scoreStr = "";
        data.sort((a, b) => b.score - a.score);
        data.slice(0, Math.min(10, data.length))
            .forEach((score, i) => {
                scoreStr += `${i + 1}) <@${score.id}> - ${score.score}\n`;
            });
        message.channel.send(
            new Discord.MessageEmbed()
                .setTitle(`**TOP 10 FOR ${songName}**`)
                .setDescription(scoreStr)
        );
    }
}