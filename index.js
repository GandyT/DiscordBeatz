const Fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();

Fs.readdir("commands", (err, files) => {
    if (err) throw new Error("Cannot Read commands");
    client.commands = [];
    client.commands.find = name => {
        name = name.toLowerCase();
        for (const cmd of client.commands)
            if (cmd.names.includes(name))
                return cmd;
        return null;
    }

    files.forEach(file => {
        client.commands.push(require(`./commands/${file}`));
    })
});

Fs.readdir("events", (err, files) => {
    if (err) throw new Error("Cannot Read events");
    files.forEach(file => {
        const eventData = require(`./events/${file}`);
        client.on(eventData.event, eventData.execute.bind(client));
    })
});

client.login(require('./resource/modules/secret.json').token);