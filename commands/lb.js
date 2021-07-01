var Fs = require('fs');
const Discord = require("discord.js");

module.exports = {
    names: ["leaderboard", "lb"],
    async execute(Env) {
        const { message, client, args } = Env;

        if (!args[1]) return message.channel.send("please specify a song name.");

        var songName = args.slice(1).join(" ").toLowerCase();
        var path = `./resource/assets/${songName}/lb.json`;
        let existingSongs = Fs.readdirSync('./resource/assets');

        if (!existingSongs.includes(songName)) return message.channel.send('that song isn\t available to play.')
        if (!Fs.existsSync(path)) return message.channel.send("No one has played that song yet. Be the first!");

        var data = JSON.parse(Fs.readFileSync(path));

        var scoreStr = "";
        data.sort((a, b) => b.score - a.score)
            .slice(0, Math.min(10, data.length))
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