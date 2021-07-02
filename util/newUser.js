const fs = require('fs');
const UserJSON = require('../resource/modules/users.json');

module.exports = (member) => {
    let allSongs = fs.readdirSync('./resource/assets/')
    if (!UserJSON[member.user.id])
    {
        UserJSON[member.user.id] =
        {
            // so that leaderboards will only display score when they are in the server
            servers: [member.guild.id],
            totalPoints: 0,
            gamesPlayed: 0,
            highscoresSet: 0,
            playingSince: new Date().getTime()
        }
        allSongs.forEach(folder =>
                UserJSON[member.user.id][folder] = {totalPoints: 0, gamesPlayed: 0, highscoresSet: 0})
        return fs.writeFileSync('./resource/modules/users.json', JSON.stringify(UserJSON, null, 2));
    }
    let servers = UserJSON[member.user.id].servers;
    if (!servers.includes(member.guild.id)) servers.push(member.guild.id);
    let missingSongs = allSongs.filter(s => !UserJSON[member.user.id][s]);
    missingSongs?.forEach(song => UserJSON[member.user.id][song] = {totalPoints: 0, gamesPlayed: 0, highscoresSet: 0})
    return fs.writeFileSync('./resource/modules/users.json', JSON.stringify(UserJSON, null, 2));
}