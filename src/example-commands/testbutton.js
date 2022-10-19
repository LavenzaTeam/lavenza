const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("testbutton")
        .setDescription("Sends a button that can be clicked, when the button is clicked, some code will run."),
    async execute(interaction, client) {
        const button = new ButtonBuilder()
            .setCustomId("test-button")
            .setLabel("Test")
            .setStyle(ButtonStyle.Primary);

        interaction.reply({
            components: [new ActionRowBuilder().addComponents(button)]
        });
    }
}