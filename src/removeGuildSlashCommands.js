require('dotenv').config();

const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

if (process.env.branch === "live") {
    var token = process.env.live_branch_token;
    var clientId = process.env.live_branch_client_id;
} else if (process.env.branch === "test") {
    var token = process.env.test_branch_token;
    var clientId = process.env.test_branch_client_id;
}
const guildId = process.env.support_server_id;
    
const rest = new REST({ version: '9' }).setToken(token);
rest.get(Routes.applicationGuildCommands(clientId, guildId))
    .then(data => {
        const promises = [];
        for (const command of data) {
            const deleteUrl = `${Routes.applicationGuildCommands(clientId, guildId)}/${command.id}`;
            promises.push(rest.delete(deleteUrl));
        }
        return Promise.all(promises);
    });

console.log(`Guild Slash Commands for guildId: '${guildId}' have been removed for client: '${clientId}'`);