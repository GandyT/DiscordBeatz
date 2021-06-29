const levelPlay = require("../constantListeners/levelPlay.js");

module.exports = {
    event: "voiceStateUpdate",
    async execute(oldMember, newMember) {
        if (newMember.channelID == null) {
            // user left a vc

            levelPlay.forceFinish(newMember.id);
            var vc = newMember.guild.channels.cache.find(c => c.id == oldMember.channelID);
            vc.leave();
        }
    }
}