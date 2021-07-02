const fs = require('fs');
const UserJSON = require('../resource/modules/users.json');

module.exports =
{
    event: 'guildMemberAdd', execute(member)
    {
        UserJSON[member.user.id].servers.push(member.guild.id);
        return fs.writeFileSync('./resource/modules/users.json', JSON.stringify(UserJSON, null, 2));
    }
}