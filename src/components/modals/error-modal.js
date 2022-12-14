const { WebhookClient, EmbedBuilder } = require("discord.js")
const banlist = require("../../configuration/error-banlist.json");

module.exports = {
    data: {
        name: "error-modal"
    },
    async execute(interaction, client) {
        let reportingUser = interaction.user.id;
        if (banlist[reportingUser] === true) return interaction.reply({
            content: "Apologies, but you have been banned from using the report feature. \nPlease contact the developer if you would like to know why.",
            ephemeral: true
        });

        const commandInput = interaction.fields.getTextInputValue("commandInput");
        const dataInput = interaction.fields.getTextInputValue("dataInput");
        const bugInput = interaction.fields.getTextInputValue("bugInput");

        const webhook = new WebhookClient({ id: process.env.error_webhook_id, token: process.env.error_webhook_token})

        const errorEmbed = new EmbedBuilder()
            .setTitle("Error Report")
            .setColor(client.color)
            .setTimestamp()
            .setFooter({ text: "Lavenza Error Report", iconURL: "https://lavenza.tk/assets/logo.png" })
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setURL("https://lavenza.tk/")
            .setThumbnail("https://lavenza.tk/assets/logo.png")
            .addFields(
                { name: "Reporting User", value: reportingUser },
                { name: "\u200B", value: "\u200B" },
                { name: "Command Used", value: commandInput, inline: true },
                { name: "Data Searched", value: dataInput, inline: true },
                { name: "\u200B", value: "\u200B" },
                { name: "Detailed Description", value: bugInput }
            );

        webhook.send({
            username: "Lavenza Error Report",
            avatarURL: "https://lavenza.tk/assets/logo.png",
            embeds: [errorEmbed]
        });

        interaction.reply({
            content: "Error Reported, thank you!",
            ephemeral: true
        });
    }
}