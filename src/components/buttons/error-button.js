const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js")

module.exports = {
    data: {
        name: "error-button"
    },
    async execute(interaction, client) {
        const errorModal = new ModalBuilder()
            .setCustomId("error-modal")
            .setTitle("Report an Error");

        const commandInput = new TextInputBuilder()
            .setCustomId("commandInput")
            .setLabel("Which command were you trying to use?")
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
            .setMaxLength(10);

        const dataInput = new TextInputBuilder()
            .setCustomId("dataInput")
            .setLabel("What Persona/Shadow/Fusion did you search?")
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
            .setMaxLength(30);

        const bugInput = new TextInputBuilder()
            .setCustomId("bugInput")
            .setLabel("Describe in detail the issue.")
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(4000);

        errorModal.addComponents(new ActionRowBuilder().addComponents(commandInput));
        errorModal.addComponents(new ActionRowBuilder().addComponents(dataInput));
        errorModal.addComponents(new ActionRowBuilder().addComponents(bugInput));

        await interaction.showModal(errorModal);
    }
}