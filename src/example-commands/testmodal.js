const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("testmodal")
        .setDescription("Sends a test modal."),
    async execute(interaction, client) {
        const modal = new ModalBuilder()
            .setCustomId("test-modal")
            .setTitle("Input some text...");

        const textInput = new TextInputBuilder()
            .setCustomId("testInput")
            .setLabel("Type something...")
            .setRequired(true)
            .setStyle(TextInputStyle.Short);

        modal.addComponents(new ActionRowBuilder().addComponents(textInput));

        await interaction.showModal(modal);
    }
}