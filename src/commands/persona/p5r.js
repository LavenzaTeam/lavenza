const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const fetch = require("node-fetch");
const api = require("../../configuration/api-endpoints.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("p5r")
        .setDescription("Testing P5R command")
        .addStringOption(option => 
            option.setName("type")
                .setDescription("The type of data you are looking up.")
                .setRequired(true)
                .addChoices(
                    { name: "Persona", value: "persona" },
                    { name: "Shadow", value: "shadow" },
                    { name: "Fusion", value: "fusion" },
                    { name: "Item", value: "item" }
                ))
        .addStringOption(option => 
            option.setName("data")
                .setDescription("The name of the Persona/Shadow/Fusion/Item you are searching for.")
                .setRequired(true)),
    async execute(interaction, client) {
        const errorButton = new ButtonBuilder()
            .setCustomId("error-button")
            .setLabel("Report an Error")
            .setStyle(ButtonStyle.Danger);

        const type = interaction.options.getString("type");
        const data = interaction.options.getString("data");
        const fetchedData = await fetch(api.p5r.persona);
        const res = await fetchedData.json();

        switch (type) {
            case "persona":

                if (!res[data]) return interaction.reply({
                    content: "There was an error searching for the specified data, please try again.",
                    ephemeral: true,
                    components: [new ActionRowBuilder().addComponents(errorButton)]
                });

                var messageToSend = res[data].name;

                break;
        
            default:
                break;
        }


        interaction.reply({
            content: messageToSend,
            components: [new ActionRowBuilder().addComponents(errorButton)]
        });
    }
}