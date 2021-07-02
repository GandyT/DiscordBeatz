var playing = {}
const Fs = require('fs');
const Discord = require('discord.js');
const UserJSON = require('../resource/modules/users.json');
var looping = false;

const gameConstants = require('../resource/modules/config.json').gameConstants;

module.exports = {
    async execute(message) {
        let game = playing[message.author.id];
        if (!game) return;

        var deltaTime = new Date().getTime() - game.start;
        var latency = new Date().getTime() - message.createdTimestamp;
        game.lastLatency = latency;

        deltaTime -= latency; // this is the true deltaTime


        var nextBeat = game.songBeats.shift();

        if (nextBeat.key != message.content.toLowerCase()) {
            message.author.send(
                new Discord.MessageEmbed()
                    .setDescription("```MISSED: ❌```")
                    .setTimestamp()
            )/*then(msg => game.msgs.push(msg))*/.catch(() => console.log(''));
            // MISSED
            game.previousMsg?.edit(
                new Discord.MessageEmbed()
                    .setTitle("**❌ MISSED ❌**")
                    .setDescription(game.previousMsg.embeds[0].description)
                    .setColor("#e74c3c")
            )
        } else {
            if (deltaTime - nextBeat.time < -game.botLatency) {
                /* NOTE LOCKED */
                    return message.author.send(
                    new Discord.MessageEmbed()
                        .setDescription("```NOTELOCKED```")
                        .setTimestamp()
                )/*then(msg => game.msgs.push(msg))*/.catch(() => console.log(''));
            }

            var accDiff = Math.abs(deltaTime - nextBeat.time); // how off was the beat the player hit?

            if (accDiff < gameConstants.perfect) {
                game.score += 300;
                // edit previous message based on hit or not
                game.previousMsg?.edit(
                    new Discord.MessageEmbed()
                        .setTitle("**300pts**")
                        .setDescription(game.previousMsg.embeds[0].description)
                        .setColor("#2ecc71")
                )

            } else if (accDiff < gameConstants.bad) {
                game.score += 100;
                game.previousMsg?.edit(
                    new Discord.MessageEmbed()
                        .setTitle("**100pts**")
                        .setDescription(game.previousMsg.embeds[0].description)
                        .setColor("#f1c40f")
                )
            } else {
                message.author.send(
                    new Discord.MessageEmbed()
                        .setDescription("```MISSED: ❌```")
                        .setTimestamp()
                )/*then(msg => game.msgs.push(msg))*/.catch(() => console.log(''));
                // MISSED
                game.previousMsg.edit(
                    new Discord.MessageEmbed()
                        .setTitle("**❌ MISSED ❌**")
                        .setDescription(game.previousMsg.embeds[0].description)
                        .setColor("#e74c3c")
                )
            }
        }
        /* GAME ENDED */
        if (!game.songBeats) this.forceFinish(message.author.id);
        else {
            /* REGULAR GAME LOGIC */
            var beatTime = game.songBeats[0]?.time;
            setTimeout(
                async () => {
                    if (!game) return;
                    // beat already passed. no need to send the message again
                    if (beatTime != game.songBeats[0].time) return;

                    let msg = await message.channel.send(
                        new Discord.MessageEmbed()
                            .setTitle("**KEY**")
                            .setDescription(game.songBeats[0].key)
                    )
                    // game.msgs.push(msg)
                    game.previousMsg = msg;
                },
                game.songBeats[0]?.time - deltaTime - 100 - game.botLatency
            );

        }
    },
    guildValid(guildId) {
        /*
        for (let value of Object.values(playing)) {
            if (value.guild == guildId) return false;
        }*/
        if (Object.values(playing).find(value => value.guild == guildId)) return false;
        return true;
    },
    add(message, name, latency) {
        var songBeats = JSON.parse(Fs.readFileSync(`./resource/assets/${name}/beats.json`));
        playing[message.author.id] = {
            name: name,
            message: message,
            channel: message.channel,
            songBeats: songBeats,
            start: new Date().getTime(),
            score: 0,
            previousMsg: undefined,
            beats: songBeats.length,
            lastLatency: 0,
            guild: message.guild.id,
            botLatency: latency,
            // msgs: []
        }

        message.channel.send(
            new Discord.MessageEmbed()
                .setDescription(`\`\`\`Starting: ${((playing[message.author.id].songBeats[0].time - 100) / 1000).toFixed(2)}s\`\`\``)
        )//.then(msg => playing[message.author.id].msgs.push(msg))

        setTimeout(async () => {
            if (!playing[message.author.id]) return;
            let msg = await message.channel.send(
                new Discord.MessageEmbed()
                    .setTitle("**KEY**")
                    .setDescription(playing[message.author.id].songBeats[0].key)
            )//.then(msg => playing[message.author.id].msgs.push(msg))
            playing[message.author.id].previousMsg = msg;
        }, playing[message.author.id].songBeats[0].time - 100 - playing[message.author.id].botLatency);
        if (!looping) this.gameLoop(); // start the game loop if it doesn't exist yet
    },
    forceFinish(id) {
        if (!playing[id]) return;
        var acc = ((playing[id].score / (playing[id].beats * 300)) * 100).toFixed(2);
        playing[id].message.channel.send(
            new Discord.MessageEmbed()
                .setTitle("**END**")
                .addField("**STATUS**", "```Game Done```")
                .addField("**SCORE**", `\`\`\`${playing[id].score}\`\`\``)
                .addField("**ACCURACY**", `\`\`\`${acc}%\`\`\``)
        );

        // playing[id].msgs.forEach(msg => msg.delete());
            
        let songObj = UserJSON[id][playing[id].name];
        UserJSON[id].gamesPlayed++;
        songObj.gamesPlayed++;
        UserJSON[id].totalPoints += playing[id].score;
        songObj.totalPoints += playing[id].score;

        var lbPath = `./resource/assets/${playing[id].name}/lb.json`;

        var data = [];

        if (Fs.existsSync(lbPath)) data = JSON.parse(Fs.readFileSync(lbPath));

        var userPrev = data.find(lbPos => lbPos.id == id);
        if (userPrev && userPrev.score < playing[id].score) {
            // new highscore
            data = data.filter(lbPos => lbPos.id != id);
            data.push({ id: id, score: playing[id].score, accuracy: acc });
            UserJSON[id].highscoresSet++;
            songObj.highscoresSet++;
        } else if (!userPrev) data.push({ id: id, score: playing[id].score, accuracy: acc });

        Fs.writeFileSync(lbPath, JSON.stringify(data, null, 2));
        Fs.writeFileSync('./resource/modules/users.json', JSON.stringify(UserJSON, null, 2));

        delete playing[id];
    },
    gameLoop() {
        looping = true;
        var playerIds = Object.keys(playing);
        if (!playerIds.length) return looping = false; // no more players, end loop automatically

        for (let id of playerIds) {
            let deltaTime = new Date().getTime() - playing[id].start - playing[id].lastLatency;

            if (!playing[id].songBeats.length) {
                this.forceFinish(id);
                continue;
            }

            if (
                deltaTime > playing[id].songBeats[0].time &&
                deltaTime - playing[id].songBeats[0].time > gameConstants.bad
            ) {
                if (playing[id].previousMsg) {
                    // MISSED
                    playing[id].previousMsg.edit(
                        new Discord.MessageEmbed()
                            .setTitle("**❌ MISSED ❌**")
                            .setDescription(playing[id].previousMsg.embeds[0].description)
                            .setColor("#e74c3c")
                    )
                }

                playing[id].message.author.send(
                    new Discord.MessageEmbed()
                        .setDescription("```NO-HIT: ❌```")
                        .setTimestamp()
                )/*then(msg => playing[id].msgs.push(msg)).*/.catch(() => console.log(''))

                // delete expired beat
                playing[id].songBeats.shift();

                if (!playing[id].songBeats.length) return this.forceFinish(id);

                var beatTime = playing[id].songBeats[0].time;

                /* SEND NEW KEY*/
                setTimeout(
                    async () => {
                        // beat already passed. no need to send the message again
                        if (!playing[id]) return;
                        if (beatTime != playing[id].songBeats[0].time) return;

                        let msg = await playing[id].message.channel.send(
                            new Discord.MessageEmbed()
                                .setTitle("**KEY**")
                                .setDescription(playing[id].songBeats[0].key)
                        )

                        // playing[id].msgs.push(msg);

                        playing[id].previousMsg = msg;
                    },
                    playing[id].songBeats[0].time - deltaTime - 100 - playing[id].botLatency
                );
            }
        }

        setTimeout(() => this.gameLoop(), 150);
    }
}