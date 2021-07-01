const {PREFIX} = require("../resource/modules/config.json");
const levelCreation = require("../constantListeners/levelCreation.js");
const levelPlay = require("../constantListeners/levelPlay.js");

module.exports = {
    event: "message",
    async execute(message) {
        const client = this;

        if (message.author.bot || !message.guild || !message.guild.me.hasPermission('SEND_MESSAGES')) return;

        levelCreation.execute(message);
        levelPlay.execute(message);

        if (!message.content.startsWith(PREFIX)) return;
        var env = {
            message: message,
            args: message.content
                .toLowerCase()
                .substr(Config.length)
                .split(" "),
            client: client
        };

        var command = client.commands.find(env.args[0]);
        if (command) command.execute(env);
    }
}