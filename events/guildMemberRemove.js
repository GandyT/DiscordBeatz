const fs = require('fs');
const UserJSON = require('../resource/modules/users.json');

module.exports =
{
    event: 'guildMemberRemove',
    execute(member)
    {
        UserJSON[member.user.id].servers.splice(UserJSON[member.user.id].servers.indexOf(member.guild.id), 1);
        return fs.writeFileSync('./resource/modules/users.json', JSON.stringify(UserJSON, null, 2));
    }
}