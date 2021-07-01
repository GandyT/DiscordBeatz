const levelPlay = require("../constantListeners/levelPlay.js");
const { PREFIX } = require("../resource/modules/config.json");
const Fs = require("fs");

module.exports = {
    names: ["play"],
    async execute(Env) {
        const { message, client, args } = Env;

        if (!args[1]) return message.channel.send("Please specify a song name");
        if (!message.channel.name.startsWith("discordbeatz")) return message.channel.send("Please create a channel called \"discordbeatz\" in order to play");

        var songName = args.slice(1).join(" ").toLowerCase();

        let memberVc = message.member.voice?.channel;
        if (!memberVc) return message.channel.send("You must be in a voice channel to play");
        if (!message.guild.me.permissionsIn(memberVc).toArray().includes('SPEAK')) return message.channel.send('i don\'t have the permission to speak in that voice channel.')

        var path = `./resource/assets/${songName}/${songName}.mp3`;
        var songExists = Fs.existsSync(path);

        if (!songExists) return message.channel.send(`That song does not exist. Type ${PREFIX}songlist to find a list of songs`);

        let latencyMsg = await message.channel.send("Testing Latency...")
        var latency = Date.now() - latencyMsg.createdTimestamp;
        latencyMsg.edit(`Latency is ${latency}ms`);
        let connection = await message.member.voice.channel.join();
        levelPlay.add(message, songName, latency);
        connection.play(path).on("finish", () => {
            connection.disconnect();
            levelPlay.forceFinish(message.author.id);
        });
    }
}