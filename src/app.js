require("dotenv").config();
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

if (process.env.branch === "live") {
    var token = process.env.live_branch_token;
} else if (process.env.branch === "test") {
    var token = process.env.test_branch_token;
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.commandArray = [];
client.color = 0x0800ff;

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
    const functionFiles = fs.readdirSync(`./src/functions/${folder}`).filter(file => file.endsWith(".js"));

    for (const file of functionFiles) require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.handleCommands();
client.handleComponents();
client.login(token);