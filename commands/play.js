const levelPlay = require("../constantListeners/levelPlay.js");
const Config = require("../resource/modules/config.js");
const Fs = require("fs");

module.exports = {
    names: ["play"],
    async execute(Env) {
        const { message, client, args } = Env;

        if (!args[1]) return message.channel.send("Please specify a song name");
        if (!message.channel.name.startsWith("discordbeatz")) return message.channel.send("Please create a channel called \"discordbeatz\" in order to play");

        var songName = args.slice(1).join(" ");

        if (!message.member.voice.channel) return message.channel.send("You must be in a voice channel to play");

        var path = `C:/Users/phone/OneDrive/Desktop/DiscordBeatz/resource/assets/${songName}/${songName}.mp3`;
        var songExists = Fs.existsSync(path);

        if (!songExists) return message.channel.send(`That song does not exist. Type ${Config.PREFIX}songlist to find a list of songs`);

        message.channel.send("Testing Latency...")
            .then(latencyMsg => {
                var latency = Date.now() - latencyMsg.createdTimestamp;
                message.channel.send(`Latency is ${latency}ms`);
                message.member.voice.channel.join()
                    .then(connection => {
                        levelPlay.add(message, songName, latency);
                        connection.play(path)
                            .on("finish", () => {
                                connection.disconnect();
                                levelPlay.forceFinish(message.author.id);
                            });
                    });
            });


    }
}