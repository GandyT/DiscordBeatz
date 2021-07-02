const levelPlay = require("../constantListeners/levelPlay.js");

module.exports = {
    event: "voiceStateUpdate",
    execute(oldState, newState) {
        if (newState.channelID) return;
        // user left a vc
        levelPlay.forceFinish(newState.id);
        var vc = newState.guild.channels.cache.get(oldMember.channelID);
        vc?.leave();
    }
}