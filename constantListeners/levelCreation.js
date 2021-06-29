var songs = {};
const Fs = require('fs');

module.exports = {
    execute(message) {
        if (songs[message.author.id]) {
            var key = message.content.slice(0, 1);

            // if key isn't an actual key of the game, just put some random one
            if (key != "z" && key != "x") key = "z";

            // date now minus date when the message was initialized
            var latency = new Date().getTime() - message.createdTimestamp;

            /* SUBTRACT BY LATENCY TO HAVE THE EXACT TIME THE USER SENT THE MESSAGE */
            songs[message.author.id].beats.push({
                time: new Date().getTime() - songs[message.author.id].start - latency,
                key: key
            });
        }
    },
    add(id, name) {
        songs[id] = {
            name: name,
            start: new Date().getTime(),
            beats: []
        }
    },
    finish(id) {
        var savePath = `C:/Users/phone/OneDrive/Desktop/DiscordBeatz/resource/assets/${songs[id].name}/beats.json`;
        Fs.writeFileSync(savePath, JSON.stringify(songs[id].beats));
        delete songs[id];
    }
}