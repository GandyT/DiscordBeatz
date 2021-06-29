const Config = require("../resource/modules/config.js");
const levelCreation = require("../constantListeners/levelCreation.js");
const levelPlay = require("../constantListeners/levelPlay.js");

module.exports = {
    event: "message",
    async execute(message) {
        const client = this;

        if (message.author.bot) return;
        if (message.channel.type === "dm") return;

        levelCreation.execute(message);
        levelPlay.execute(message);

        if (message.content.startsWith(Config.PREFIX)) {
            var env = {
                message: message,
                args: message.content
                    .toLowerCase()
                    .substr(Config.PREFIX.length)
                    .split(" "),
                client: client
            };

            var command = client.commands.find(env.args[0]);
            if (command) command.execute(env);
        }
    }
}