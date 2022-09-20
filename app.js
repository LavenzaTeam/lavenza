const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds]});
require("dotenv").config();

client.on("ready", () => {
    console.log(`${client.user.tag} is online!`);
});

client.login(process.env.token)