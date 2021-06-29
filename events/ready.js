module.exports = {
    event: "ready",
    async execute() {
        const client = this;
        console.log("BOT IS STARTING");
        client.user.setActivity("Vibin'");
    }
}