const Discord = require("discord.js");
const Fs = require("fs");

module.exports = {
    names: ["songlist"],
    async execute(Env) {
        const { message, client, args } = Env;

        Fs.readdir("C:/Users/phone/OneDrive/Desktop/DiscordBeatz/resource/assets", (err, files) => {
            message.channel.send(
                new Discord.MessageEmbed()
                    .setTitle("**SONGS**")
                    .setDescription(files.join("\n"))
            );
        });
    }
}