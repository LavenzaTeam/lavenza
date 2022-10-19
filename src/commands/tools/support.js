const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("support")
        .setDescription("Sends a link to our support server, where you can ask for help directly from the developers!"),
    async execute(interaction, client) {
        await interaction.reply({
            content: "Here is a link to join our support server: https://discord.com/invite/YCAsHmy",
            ephemeral: true
        });
    }
}