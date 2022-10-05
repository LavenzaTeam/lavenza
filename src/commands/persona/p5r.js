const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
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
        var search = interaction.options.getString("data").toLowerCase().replace(/ /g, "_");

        switch (type) {
            case "persona":
                const fetchedData = await fetch(api.p5r.persona);
                const res = await fetchedData.json();

                if (!res[search]) return interaction.reply({
                    content: "There was an error searching for the specified data, please try again.",
                    ephemeral: true,
                    components: [new ActionRowBuilder().addComponents(errorButton)]
                });


                //skills
                const skillList = res[search].skills
                var skillsMessage = "";

                if (Object.keys(skillList).length > 24) {
                    var skillMessageIII = "";
                    var skillsMessageII = "";
                    let num = 0;
                    for (const skills in skillList) {
                        let skillString = `**${skillList[skills].name} (${skillList[skills].cost})** - ${skillList[skills].effect} - Level: ${skillList[skills].level} \n`;
                        num++
                        if (num > 24) {
                            skillMessageIII = skillMessageIII.concat(skillString);
                        } else if (num >12) {
                            skillsMessageII = skillsMessageII.concat(skillString);
                        } else {
                            skillsMessage = skillsMessage.concat(skillString);
                        }
                    }

                } else if (Object.keys(skillList).length > 12) {
                    var skillsMessageII = "";
                    let num = 0;
                    for (const skills in skillList) {
                        let skillString = `**${skillList[skills].name} (${skillList[skills].cost})** - ${skillList[skills].effect} - Level: ${skillList[skills].level} \n`;
                        num++
                        if (num > 12) {
                            skillsMessageII = skillsMessageII.concat(skillString);
                        } else {
                            skillsMessage = skillsMessage.concat(skillString);
                        }
                    }
                } else {
                    for (const skills in skillList) {
                        let skillString = `**${skillList[skills].name} (${skillList[skills].cost})** - ${skillList[skills].effect} - Level: ${skillList[skills].level} \n`;
                        skillsMessage = skillsMessage.concat(skillString);
                    }
                }

                //affinities
                let affinitiesMessage = `Physical: ${res[search].affinities.phys} | Gun: ${res[search].affinities.gun} | Fire: ${res[search].affinities.fire} | Ice: ${res[search].affinities.ice} | Elec: ${res[search].affinities.elec} | Wind: ${res[search].affinities.wind} | Psy: ${res[search].affinities.psy} | Nuke: ${res[search].affinities.nuke} | Bless: ${res[search].affinities.bless} | Curse: ${res[search].affinities.curse}`

                var embed = new EmbedBuilder()
                    .setColor("Red")
                    .setTitle(res[search].name)
                    .setThumbnail("https://lavenza.tk/assets/P5R_Logo.png")
                    .setDescription(`**Persona Trait** - ${res[search].trait}`)
                    .addFields(
                        { name: "Arcana", value: res[search].arcana, inline: true },
                        { name: "Level", value: res[search].level, inline: true },
                        { name: "Stats", value: `Strength: ${res[search].baseStats.strength} | Magic: ${res[search].baseStats.magic} | Endurance: ${res[search].baseStats.endurance} | Agility: ${res[search].baseStats.agility} | Luck: ${res[search].baseStats.luck}`, inline: true },
                        //{ name: '\u200b', value: '\u200b' },
                        { name: "Affinities", value: affinitiesMessage },
                        //{ name: '\u200b', value: '\u200b' },
                        { name: "Item", value: res[search].item, inline: true },
                        { name: "Alarm Item", value: res[search].itemAlarm, inline: true },
                        { name: '\u200b', value: '\u200b' },
                        { name: "Skills", value: skillsMessage }
                    )
                    .setTimestamp()
                    .setFooter({ text: "Data from the Lavenza API was provided by the SMT Fandom Wiki", iconURL: client.user.displayAvatarURL() });

                    if (skillsMessageII) embed.addFields( { name: '\u200b', value: skillsMessageII });
                    if (skillMessageIII) embed.addFields( { name: '\u200b', value: skillMessageIII });
                    embed.addFields({ name: '\u200b', value: '\u200b' });

                break;
        
            default:
                break;
        }


        interaction.reply({
            components: [new ActionRowBuilder().addComponents(errorButton)],
            embeds: [embed]
        });
    }
}