var Fs = require('fs');
const Discord = require("discord.js");
const {PREFIX} = require('../resource/modules/config.json');
const UserJSON = require('../resource/modules/users.json');

module.exports = {
    names: ["leaderboard", "lb"], description: `displays a leaderboard of users from the server, which can sort by different metrics. type ${PREFIX} to learn more`,
    usage: 'lb ?<song name (type [pref]songs for a complete list of available songs)> ?<metric: see extra info>\nexample: [pref]lb undead accuracy',
    notes: 'available metrics as of now are:\nacc (accuracy), gp (games played).\ndefaults to points, so if you type anything for the second parameter, it will sort by points',
    async execute(Env) {
        const { message, client, args } = Env;

        let allSongs = Fs.readdirSync('./resource/assets/');
        let song = args.find(arg => allSongs.includes(arg));

        let embedTitle = '';
        let embedDesc = '';

        let allowedUserKeys = Object.keys(UserJSON).filter(k => UserJSON[k].servers.includes(message.guild.id));

        if (!song)
        {
            embedTitle = `**TOP 10** by `;
            if (!allowedUserKeys) return message.channel.send('no one in this server has played a game. Be the first!');
            switch(args.join(' '))
            {
                case 'gp', 'games played':
                    embedTitle += `games played`;
                    allowedUserKeys
                        .sort((a, b) => UserJSON[b].gamesPlayed - UserJSON[a].gamesPlayed)
                        .slice(0, Math.min(10, allowedUserKeys.length))
                        .forEach((user, i) => embedDesc += `${i + 1}. <@${user}> - ${UserJSON[user].gamesPlayed}\n`);
                    break;
                case 'ppg', 'points/game', 'points per game':
                    embedTitle += `average points per game`;
                    allowedUserKeys
                        .sort((a, b) => UserJSON[b].gamesPlayed - UserJSON[a].gamesPlayed)
                        .slice(0, Math.min(10, allowedUserKeys.length))
                        .forEach((user, i) => 
                                    embedDesc += `${i + 1}. <@${user}> - ${(UserJSON[user].gamesPlayed/UserJSON[user].totalPoints).toFixed(2)}\n`);
                    break;
                case 'tp', 'total points':
                    allowedUserKeys
                        .sort((a, b) => UserJSON[b].totalPoints - UserJSON[a].totalPoints)
                        .slice(0, Math.min(10, allowedUserKeys.length))
                        .forEach((k, i) => embedDesc += `${i + 1}) <@${k}> - ${UserJSON[k].totalPoints}\n`)
                    break;
                case 'hss', 'highscoresSet':
                    embedTitle += `total highscores set`;
                    allowedUserKeys
                        .sort((a, b) => UserJSON[b].highscoresSet - UserJSON[a].highscoresSet)
                        .slice(0, Math.min(10, allowedUserKeys.length))
                        .forEach((user, i) => embedDesc += `${i + 1}. <@${user}> - ${UserJSON[user].highscoresSet}\n`);
                    break;
                default:
                    if (!['score', 'pts', 'points'].includes(args[1]))
                    message.channel.send('such a metric does not exist. defaulting to points...');
                    embedTitle += `total points`;
                    allowedUserKeys
                        .sort((a, b) => UserJSON[b]?.totalPoints - UserJSON[a].totalPoints)
                        .slice(0, Math.min(10, allowedUserKeys.length))
                        .forEach((user, i) => embedDesc += `${i + 1}) <@${user}> - ${UserJSON[user].totalPoints}\n`);
                    break;
            }
        } else
        {
            var path = `./resource/assets/${song}/lb.json`;
            var data = JSON.parse(Fs.readFileSync(path)).filter(x => allowedUserKeys.includes(x.id));
            if (!data) return message.channel.send('No one (in this server) has played that song yet. Be the first!');
            embedTitle = `**TOP 10 FOR ${song}** by `;
            switch(args.splice(args.indexOf(song), 1).join(' '))
            {
                case 'accuracy', 'acc':
                    embedTitle += `accuracy`;
                    data.sort((a, b) => b.accuracy - a.accuracy)
                        .slice(0, Math.min(10, data.length))
                        .forEach((score, i) => embedDesc += `${i + 1}) <@${score.id}> - ${score.accuracy}\n`);
                    break;
                case 'tp', 'total points':
                    embedTitle += `total points`;
                    allowedUserKeys
                        .filter(key => UserJSON[key][song].totalPoints !== 0)
                        .sort((a, b) => UserJSON[b][song].totalPoints - UserJSON[a][song].totalPoints)
                        .slice(0, Math.min(10, allowedUserKeys.length))
                        .forEach((key, i) => embedDesc += `${i + 1}) <@${key}> - ${UserJSON[key][song].totalPoints}\n`);
                    break;
                case 'gp', 'games played':
                    embedTitle += `games played`;
                    allowedUserKeys
                        .sort((a, b) => UserJSON[b][song].gamesPlayed - UserJSON[a][song].gamesPlayed)
                        .slice(0, Math.min(10, allowedUserKeys.length))
                        .forEach((k, i) => embedDesc += `${i + 1}) <@${k}> - ${UserJSON[k][song].gamesPlayed}\n`);
                    break;
                case 'ppg', 'points per game':
                    embedTitle += `avg. points per game`;
                    allowedUserKeys
                        .sort((a, b) => (UserJSON[b][song].totalPoints/UserJSON[b][song].gamesPlayed) - (UserJSON[a][song].totalPoints/UserJSON[a][song].gamesPlayed))
                        .slice(0, Math.min(10, allowedUserKeys.length))
                        .forEach((k, i) => embedDesc += `${i + 1}) <@${k}> - ${(UserJSON[k][song].totalPoints/UserJSON[k][song].gamesPlayed).toFixed(2)}\n`);
                    break;
                default:
                    args.splice(args.indexOf(song), 1);
                    if (args[0] && !['score', 'pts', 'points'].includes(args[1]))
                    message.channel.send('such a metric does not exist or is not available. defaulting to points...');
                    embedTitle += `score`;
                    data.filter(x => x.score != 0)
                        .sort((a, b) => b.score - a.score)
                        .slice(0, Math.min(10, data.length))
                        .forEach((score, i) => embedDesc += `${i + 1}) <@${score.id}> - ${score.score}\n`);
            }
        }

        embedDesc = embedDesc || 'no users were found for that criteria :/';

        return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle(embedTitle)
                .setDescription(embedDesc)
        );
    }
}