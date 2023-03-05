const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("destek")
    .setDescription("Destek sunucusunu gösterir."),
    // komutu geliştirmek istersen guide: https://discordjs.guide/slash-commands/advanced-creation.html
    run: async (client, interaction) => {
      interaction.reply(`discord.gg/egemen`)
    }
 };
