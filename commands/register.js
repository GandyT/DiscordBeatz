const levelCreation = require("../constantListeners/levelCreation.js");
const Discord = require('discord.js');
// you might want to hide this
var officialMappers = require('../resource/modules/secret.json').officialMappers;

module.exports = {
    names: ["register"],
    async execute(Env) {
        const { message, client, args } = Env;

        if (!args[1]) return message.channel.send("Please specify a song name");
        if (!officialMappers.includes(message.author.id)) return message.channel.send("You do not have permission to map songs");

        var songName = args.slice(1).join(" ").toLowerCase();

        message.channel.send(
            new Discord.MessageEmbed()
                .setDescription(`\`\`\`Starting Mapping for ${songName}\nReminder: Space Out Notes\`\`\``)
        );

        let connection = await message.member.voice.channel.join();
        var path = `./resource/assets/${songName}/${songName}.mp3`;
        levelCreation.add(message.author.id, songName);
        connection.play(path)
            .on("finish", () => {
                connection.disconnect();
                message.channel.send(`${songName} successfully mapped`);
                levelCreation.finish(message.author.id);
            });
    }
}