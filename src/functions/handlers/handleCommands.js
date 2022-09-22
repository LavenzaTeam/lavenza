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

        const clientID = "639988194229878810";
        const guildID = "640749553313906713";
        const rest = new REST({ version: '9' }).setToken(process.env.token);
        try {
            console.log("Started refreshing application (/) commands");

            //global commands
            //await rest.put(Routes.applicationCommands(clientID), {
            //    body: commandArray,
            //});

            //guild only commands
            await rest.put(Routes.applicationGuildCommands(clientID, guildID), {
                body: client.commandArray,
            });

            console.log("Successfully refreshed application (/) commands.");
        } catch (error) {
            console.error(error);
        }
    }
}