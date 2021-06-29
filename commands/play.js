const Discord = require("discord.js");
const levelPlay = require("../constantListeners/levelPlay.js");

module.exports = {
    names: ["play"],
    async execute(Env) {
        const { message, client, args } = Env;

        if (!args[1]) return message.channel.send("Please specify a song name");

        var songName = args.slice(1).join(" ");

        if (!message.member.voice.channel) return message.channel.send("You must be in a voice channel to play");

        message.member.voice.channel.join()
            .then(connection => {

                var path = `C:/Users/phone/OneDrive/Desktop/DiscordBeatz/resource/assets/${songName}/${songName}.mp3`;
                levelPlay.add(message, songName);
                connection.play(path)
                    .on("finish", () => {
                        connection.disconnect();
                        levelPlay.forceFinish(message.author.id);
                    });
            });
    }
}