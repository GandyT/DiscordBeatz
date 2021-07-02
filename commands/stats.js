const fs = require('fs');
const search = require('discord.js-search');
const UserJSON = require('../resource/modules/users.json');

module.exports = {
    names: ["stats"], description: 'displays a player\'s statistics', usage: `stats ?<user id, mention, tag, or (partial) username or nickname>`,
    async execute(Env) {
        const { message, client, args } = Env;

        let target;
        let mentioned = message.mentions.members.first();
        if (!args[1]) target = message.member;
        else if (mentioned) target = mentioned;
        else
        {
            target = await search.searchMember(message, args.slice(1).join(' '), true);
            if (!fetchedMember) return message.channel.send('sorry, i couldn\'t find that user.');
        }
        if (!UserJSON[target.id]) return message.channel.send('that user has not played a game yet.');

        let userInDB = UserJSON[target.user.id];
        let embed = {title: `${target.displayName}'s stats`,
                    thumbnail: {url: target.user.displayAvatarURL({dynamic: true, size: 4096})},
                    fields: [
            {name: 'total points', value: userInDB.totalPoints},
            {name: 'games won', value: userInDB.gamesWon}
        ]};
        let allSongs = fs.readdirSync('./resource/assets/').filter(song => userInDB[song]?.gamesPlayed > 0);
        allSongs.forEach(song => embed.fields.push({name: song, value: `games played: ${userInDB[song].gamesPlayed}\npoints won: ${userInDB[song].totalPoints}`}));
        return message.channel.send({embed: embed});
    }
}