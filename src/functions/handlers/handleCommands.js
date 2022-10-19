const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");

module.exports = (client) => {
    client.handleCommands = async () => {
        const commandFolders = fs.readdirSync(`./src/commands`);
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith(".js"));

            const { commands, commandArray } = client;
            for (const file of commandFiles) {
                const command = require(`../../commands/${folder}/${file}`);
                commands.set(command.data.name, command);
                commandArray.push(command.data.toJSON());
            }
        }

        if (process.env.branch === "live") {
            var clientID = process.env.live_branch_client_id;
            var token = process.env.live_branch_token;
        } else if (process.env.branch === "test") {
            var clientID = process.env.test_branch_client_id;
            var token = process.env.test_branch_token;
        }
        const guildID = process.env.support_server_id;
        const branch = process.env.branch;
        const rest = new REST({ version: '9' }).setToken(token);
        try {
            console.log("Started refreshing application (/) commands");
            console.log(`Branch set: ${branch} selected.`);

            if (branch === "live") {
                console.log("Refreshing Global application (/) commands");
                await rest.put(Routes.applicationCommands(clientID), {
                    body: client.commandArray,
                 });
            }

            if (branch === "test") {
                console.log("Refreshing Guild application (/) commands");
                await rest.put(Routes.applicationGuildCommands(clientID, guildID), {
                    body: client.commandArray,
                });
            }

            console.log("Successfully refreshed application (/) commands.");
        } catch (error) {
            console.error(error);
        }
    }
}