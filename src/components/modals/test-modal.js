module.exports = {
    data: {
        name: "test-modal"
    },
    async execute(interaction, client) {
        await interaction.reply({
            content: `You said: ${interaction.fields.getTextInputValue("testInput")}`
        });
    }
}