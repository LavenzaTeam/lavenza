module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        console.log(`${client.user.tag} is online!`);
        client.user.setPresence({ activities: [{ name: 'Early Dev Build! | https://lavenza.tk/' }], status: 'dnd' });
    }
}