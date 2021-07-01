var songs = {};
const Fs = require('fs');

module.exports = {
    execute(message) {
        if (songs[message.author.id]) {
            var key = message.content.slice(0, 1);

            // original: if (key != "z" && key != "x") key = "z";
            // the regex is case insensitive
            if (!key.match(/(z|x)/i)) key = 'z';

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
        var savePath = `./resource/assets/${songs[id].name}/beats.json`;
        // the null, 2 makes it format it nicely :^) https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
        Fs.writeFileSync(savePath, JSON.stringify(songs[id].beats, null, 2));
        delete songs[id];
    }
}