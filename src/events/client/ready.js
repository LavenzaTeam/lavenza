const fetch = require("node-fetch");

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        console.log(`${client.user.tag} is online!`);
        client.user.setPresence({ activities: [{ name: 'Early Dev Build! | https://lavenza.tk/' }], status: 'dnd' });

        var timer = 3, interval = timer * 60 * 1000;
        setInterval(function() {
	        fetch("https://betteruptime.com/api/v1/heartbeat/zZn9WwmEaNDRvtRsaEWJTDB9")
            console.log(`${client.user.username}: Heartbeat sent.`);
        }, interval);
    }
}