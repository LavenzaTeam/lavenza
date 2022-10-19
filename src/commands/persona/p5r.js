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
                    { name: "Item", value: "item" },
                    { name: "Skill", value: "skill"}
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
                let affinitiesMessage = `<:p5_physical:1029974208962371654>: ${res[search].affinities.phys} | <:p5_gun:1029974261995163658>: ${res[search].affinities.gun} | <:p5_fire:1029974318072991784>: ${res[search].affinities.fire} | <:p5_ice:1029974354802511922>: ${res[search].affinities.ice} | <:p5_elec:1029974416047747082>: ${res[search].affinities.elec} | <:p5_wind:1029974468002598952>: ${res[search].affinities.wind} | <:p5_psy:1029974500441325568>: ${res[search].affinities.psy} | <:p5_nuke:1029974543089008722>: ${res[search].affinities.nuke} | <:p5_bless:1029974583459201074>: ${res[search].affinities.bless} | <:p5_curse:1029974610537619556>: ${res[search].affinities.curse} | <:p5_almighty:1029974659313180702>: ${res[search].affinities.almighty}`

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
                var embed = new EmbedBuilder()
                .setColor("Red")
                .setThumbnail("https://lavenza.tk/assets/P5R_Logo.png")
                .setTitle("We're terribly sorry.")
                .setDescription("At the moment, the value specified for 'type' is either invalid, or isn't complete at the moment. Please check back again at a future date.")
                .setTimestamp()
                .setFooter({ text: "Data from the Lavenza API was provided by the SMT Fandom Wiki", iconURL: client.user.displayAvatarURL() });
                
                break;
        }


        interaction.reply({
            components: [new ActionRowBuilder().addComponents(errorButton)],
            embeds: [embed]
        });
    }
}