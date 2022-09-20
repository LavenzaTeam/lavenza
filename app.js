const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds]});
require("dotenv").config();

client.on("ready", () => {
    console.log(`${client.user.tag} is online!`);
    let server = client.guilds.cache.get("640749553313906713");
    let channel = server.channels.cache.get("669263124570046503");
    channel.send("Testing Google App Engine Cloud Hosting.")
})

client.login(process.env.token)