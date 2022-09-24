const { SlashCommandBuilder, SelectMenuBuilder, ActionRowBuilder, SelectMenuOptionBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("testmenu")
        .setDescription("Sends a test selection menu."),
    async execute(interaction, client) {
        const menu = new SelectMenuBuilder()
            .setCustomId("test-menu")
            .setMinValues(1)
            .setMaxValues(1)
            .setPlaceholder("Select an option from the list below.")
            .setOptions(new SelectMenuOptionBuilder({
                label: "Option #1",
                value: "Value of Option #1"
            }), new SelectMenuOptionBuilder({
                label: "Option #2",
                value: "Value of Option #2"
            }), new SelectMenuOptionBuilder({
                label: "Option #3",
                value: "Value of Option #3"
            }));

        await interaction.reply({
            components: [new ActionRowBuilder().addComponents(menu)]
        })
    }
}