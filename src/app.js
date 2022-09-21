import { Client, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";

config();

const client = new Client({ intents: [GatewayIntentBits.Guilds]});

client.on("ready", () => {
    console.log(`${client.user.tag} is online!`);
});

client.login(process.env.token)