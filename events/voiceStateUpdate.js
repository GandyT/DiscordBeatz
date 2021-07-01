const levelPlay = require("../constantListeners/levelPlay.js");

module.exports = {
    event: "voiceStateUpdate",
    async execute(oldMember, newMember) {
        if (!newMember.voice?.channelID) {
            // user left a vc

            levelPlay.forceFinish(newMember.id);
            var vc = newMember.guild.channels.cache.find(c => c.id == oldMember.channelID);
            // optional chaining to prevent errors in case the user left because the channel was deleted
            vc?.leave();
        }
    }
}