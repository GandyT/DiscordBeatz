const Discord = require("discord.js");
const Fs = require("fs");

function songLength(name)
{
    let songBeats = JSON.parse(Fs.readFileSync(`./resource/assets/${name}/beats.json`));
    return `${name} - ${Math.floor((songBeats[0].time - songBeats.pop().time)/1000)} seconds`
}

module.exports = {
    names: ["songlist", 'songs'],
    async execute(Env) {
        const { message } = Env;

        let dirs = Fs.readdirSync("./resource/assets");
        let songList = [];
        dirs.forEach(dir => songList.push(`${songLength(dir)}`));
        message.channel.send(
            new Discord.MessageEmbed()
                .setTitle("**SONGS**")
                .setDescription(songList.join('\n'))
        );
    }
}