const Fs = require('fs');
const search = require('discord.js-search');
const Discord = require('discord.js');

module.exports = {
    names: ["stats"],
    description: 'displays a player\'s statistics',
    usage: `stats ?<user id, mention, tag, or (partial) username or nickname>`,
    async execute(Env) {
        const { message, client, args } = Env;

        let target;
        let mentioned = message.mentions.members.first();

        /* FINDING USER */
        if (!args[1]) {
            target = message.member;
        } else if (mentioned) {
            target = mentioned;
        } else {
            target = await search.searchMember(message, args.slice(1).join(' '), true);
            if (!fetchedMember) return message.channel.send('sorry, i couldn\'t find that user.');
        }

        const UserJSON = JSON.parse(Fs.readFileSync("./resource/modules/users.json"))

        if (!UserJSON[target.id]) return message.channel.send('that user has not played a game yet.');

        let userData = UserJSON[target.user.id];

        let statsEmbed = new Discord.MessageEmbed()
            .setTitle(`${target.displayName}'s stats`)
            .setThumbnail(target.user.displayAvatarURL({ dynamic: true, size: 4096 }))
            .addField("total points", userData.totalPoints)
            .addField("games won", userData.gamesPlayed);

        var songStatsString = "";
        let songList = Fs.readdirSync('./resource/assets/')
            .filter(song => userData[song]?.gamesPlayed > 0);

        songList.forEach(song => {
            songStatsString += "```" + `${song} - plays: ${userData[song].gamesPlayed}, points: ${userData[song].totalPoints}` + "```\n";
        });

        statsEmbed.setDescription(songStatsString);

        return message.channel.send(statsEmbed);
    }
}