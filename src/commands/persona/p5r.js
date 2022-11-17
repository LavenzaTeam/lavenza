const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
const api = require("../../configuration/api-endpoints.json");
const emote = require("../../configuration/emote-ids.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("p5r")
        .setDescription("Testing P5R command")
        .addStringOption(option => 
            option.setName("type")
                .setDescription("The type of data you are looking up. ('Persona' only works at the moment)")
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
                .setDescription("The name of the Persona/Shadow/Fusion/Item you are searching for. (Proper punctuation is required.)")
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
                var fetchedData = await fetch(api.p5r.persona);
                var res = await fetchedData.json();

                if (!res[search]) return interaction.reply({
                    content: "There was an error searching for the specified data, please try again.",
                    ephemeral: true,
                    components: [new ActionRowBuilder().addComponents(errorButton)]
                });


                //skills
                const skillList = res[search].skills
                var skillsMessage = "";

                for (const skills in skillList) {
                    let skillType = skillList[skills].type;
                    if (!emote.p5r[skillType]) skillType = "unknown";
                    let skillString = `${emote.p5r[skillType]} **${skillList[skills].name}** \`Lv ${skillList[skills].level}\` \n`;
                    skillsMessage = skillsMessage.concat(skillString);
                }

                //affinities
                let affinitiesMessage = `${emote.p5r.phys}: ${res[search].affinities.phys} | ${emote.p5r.gun}: ${res[search].affinities.gun} | ${emote.p5r.fire}: ${res[search].affinities.fire} | ${emote.p5r.ice}: ${res[search].affinities.ice} | ${emote.p5r.elec}: ${res[search].affinities.elec} | ${emote.p5r.wind}: ${res[search].affinities.wind} | ${emote.p5r.psy}: ${res[search].affinities.psy} | ${emote.p5r.nuke}: ${res[search].affinities.nuke} | ${emote.p5r.bless}: ${res[search].affinities.bless} | ${emote.p5r.curse}: ${res[search].affinities.curse} | ${emote.p5r.almighty}: ${res[search].affinities.almighty}`

                //itemization beta
                if (!res[search].item.name) {
                    var itemizationMessage = `Normal: ${emote.p5r.unknown} ${res[search].item} \nFusion Alarm: ${emote.p5r.unknown} ${res[search].itemAlarm}`;
                } else {
                    var itemType = res[search].item.type;
                    var itemTypeAlarm = res[search].itemAlarm.type;
                    if (!itemType) itemType = "unknown";
                    if (!itemTypeAlarm) itemTypeAlarm = "unknown";
                    var itemizationMessage = `Normal: ${emote.p5r[itemType]} ${res[search].item.name} \nFusion Alarm: ${emote.p5r[itemTypeAlarm]} ${res[search].itemAlarm.name}`;
                }

                var embed = new EmbedBuilder()
                    .setColor("Red")
                    .setTitle(res[search].name)
                    .setThumbnail("https://lavenza.tk/assets/p5r_logo.png")
                    .setDescription(`**Persona Trait** - ${res[search].trait}`)
                    .addFields(
                        { name: "Arcana", value: res[search].arcana, inline: true },
                        { name: "Level", value: res[search].level, inline: true },
                        { name: "Stats", value: `Strength: ${res[search].baseStats.strength} | Magic: ${res[search].baseStats.magic} | Endurance: ${res[search].baseStats.endurance} | Agility: ${res[search].baseStats.agility} | Luck: ${res[search].baseStats.luck}`, inline: true },
                        //{ name: '\u200b', value: '\u200b' },
                        { name: "Affinities", value: affinitiesMessage },
                        //{ name: '\u200b', value: '\u200b' },
                        { name: "Item", value: itemizationMessage, inline: true },
                        { name: '\u200b', value: '\u200b' },
                        { name: "Skills", value: skillsMessage }
                    )
                    .setTimestamp()
                    .setFooter({ text: "Data from the Lavenza API was provided by the SMT Fandom Wiki", iconURL: client.user.displayAvatarURL() });

                    embed.addFields({ name: '\u200b', value: '\u200b' });

                break;
        
            case "skill":
                var fetchedData = await fetch(api.p5r.skill);
                var res = await fetchedData.json();

                if (!res[search]) return interaction.reply({
                    content: "There was an error searching for the specified data, please try again.",
                    ephemeral: true,
                    components: [new ActionRowBuilder().addComponents(errorButton)]
                });

                let skillType = res[search].type;

                var embed = new EmbedBuilder()
                    .setColor("Red")
                    .setTitle(res[search].name)
                    .setThumbnail("https://lavenza.tk/assets/p5r_logo.png")
                    .setDescription(`**Effect** - ${res[search].effect}`)
                    .addFields(
                        { name: "Type", value: emote.p5r[skillType], inline: true },
                        { name: "Cost", value: res[search].cost, inline: true },
                        { name: "Skill Card", value: res[search].card, inline: true }
                    )
                    .setTimestamp()
                    .setFooter({ text: "Data from the Lavenza API was provided by the SMT Fandom Wiki", iconURL: client.user.displayAvatarURL() });

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