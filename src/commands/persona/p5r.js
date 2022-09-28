const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("p5r")
        .setDescription("Testing P5R command"),
    async execute(interaction, client) {
        const errorButton = new ButtonBuilder()
            .setCustomId("error-button")
            .setLabel("Report an Error")
            .setStyle(ButtonStyle.Danger);

        interaction.reply({
            content: "This is a test message above a test button",
            components: [new ActionRowBuilder().addComponents(errorButton)]
        });
    }
}