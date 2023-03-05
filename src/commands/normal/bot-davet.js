const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js")
module.exports = {
  name: "davet",
  aliases: ["invite"],
  cooldown: 5000,//1 saniye = 1000 ms / cooldown olmasını istemezseniz 0 yazın.
  run: async (client, message, args) => {

    let link_button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Davet Et')
        .setStyle(ButtonStyle.Link)
        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=0&scope=bot%20applications.commands`))



    const embed = new EmbedBuilder()
      .setTitle("EgoBOT | Davet Bağlantısı")
      .setDescription(`[Botu davet etmek için tıkla](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=0&scope=bot%20applications.commands)`)
      .setColor("#0099ff")
      .setTimestamp()
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 1024 }))
    return message.reply({ embeds: [embed], components: [link_button] })

  }
}
