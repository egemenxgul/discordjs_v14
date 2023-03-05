const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.Reaction, Partials.GuildScheduledEvent, Partials.User, Partials.ThreadMember] });
const config = require("./src/config.js");
const { readdirSync } = require("fs")
const moment = require("moment");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

const token = process.env['token']

client.commands = new Collection()
client.slashcommands = new Collection()
client.commandaliases = new Collection()

const rest = new REST({ version: '10' }).setToken(token);

const log = x => { console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] ${x}`) };

//command-handler
const commands = []
readdirSync('./src/commands/normal').forEach(async file => {
  const command = await require(`./src/commands/normal/${file}`);
  if (command) {
    client.commands.set(command.name, command)
    commands.push(command.name, command);
    if (command.aliases && Array.isArray(command.aliases)) {
      command.aliases.forEach(alias => {
        client.commandaliases.set(alias, command.name)
      })
    }
  }
})

//slash-command-handler
const slashcommands = [];
readdirSync('./src/commands/slash').forEach(async file => {
  const command = await require(`./src/commands/slash/${file}`);
  slashcommands.push(command.data.toJSON());
  client.slashcommands.set(command.data.name, command);
})

client.on("ready", async () => {
  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: slashcommands },
    );
  } catch (error) {
    console.error(error);
  }
  log(`${client.user.username} Aktif Edildi!`);
})

//event-handler
readdirSync('./src/events').forEach(async file => {
  const event = await require(`./src/events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
})

//nodejs-events
process.on("unhandledRejection", e => {
  console.log(e)
})
process.on("uncaughtException", e => {
  console.log(e)
})
process.on("uncaughtExceptionMonitor", e => {
  console.log(e)
})
//

const express = require("express");
const app = express();

app.listen(process.env.PORT);
app.get("/", (req, res) => {
  return res.sendStatus(200)
})

////////////////////KOMUTLAR////////////////////
////////////////////KOMUTLAR////////////////////
////////////////////KOMUTLAR////////////////////
//çekiliş
const { GiveawaysManager } = require('@burakys/giveaways');
const { resolveColor } = require("discord.js");
const manager = new GiveawaysManager(client, {
  storage: './databases/giveaways.json',
  default: {
    botsCanWin: false,
    embedColor: resolveColor("Blurple"),
    embedColorEnd: resolveColor("Blurple"),
    reaction: '🎉'
  }
});
client.giveawaysManager = manager;
//çekiliş


//mesaj log
const qdb = require('croxydb')
client.on('messageDelete', async message => {
  if (!message?.author) return;
  const dcs = require('discord.js')
  if (message?.author?.bot) return;
  let id = qdb.get(`log_${message.guild.id}`)
  let log = qdb.get(`log_${message.guild.id}`)
  if (!log) return;
  const channel = client.channels.cache.get(log);
  if (!channel) return;
  let silinen = new dcs.EmbedBuilder()
    .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
    .setTitle("Mesaj silindi!")
    .addFields({ name: `Silinen mesaj :`, value: `${message.content}` }, { name: `Kanal :`, value: `${message.channel.name}` })
    .setTimestamp()
    .setColor("White")

  channel.send({ embeds: [silinen] }).catch(err => { })
});

client.on('messageUpdate', async (oldMessage, newMessage) => {
  if (!message?.author) return;
  const dcs = require('discord.js')
  if (oldMessage.content == newMessage.content) return;
  let log = qdb.get(`log_${oldMessage.guild.id}`)
  if (!log) return;
  const channel = oldMessage.guild.channels.cache.get(log);
  if (!channel) return;
  if (newMessage.author.bot) return;
  let güncel = new dcs.EmbedBuilder()
    .setTitle(`Mesaj güncellendi!`)
    .setAuthor({ name: `${oldMessage.author.tag}`, iconURL: oldMessage.author.avatarURL() })
    .addFields({ name: "Eski mesaj : ", value: `${oldMessage.content}` }, { name: "Yeni mesaj : ", value: `${newMessage.content}` }, { name: "Kanal : ", value: `${oldMessage.channel.name}` })
    .setTimestamp()
    .setColor("White")

  channel.send({ embeds: [güncel] }).catch(err => { })
});
//mesaj log


//bot dm log
// Bot Dm Log \\
client.on("messageCreate", async (message) => {
  let csl = "1079476727811678289";
  const csdc = require("discord.js");

  if (message.author.id === client.user.id) return;
  if (!message.guild) {
    client.channels.cache.get(csl).send({
      embeds: [
        new csdc.EmbedBuilder()
          .setAuthor({ name: "Yeni DM!" })
          .setFooter({ text: "DM-LOG SİSTEMİ!" })
          .setDescription(
            `Gönderen kişi: <@${message.author.id}> - ${message.author.id}`
          )
          .setTimestamp()
          .setThumbnail(client.user.displayAvatarURL())
          .addFields({ name: "Mesajı;", value: message.content }),
      ],
    });
  }
});

// Bot Dm Log \\
//bot dm log



// Otorol \\
client.on("guildMemberAdd", async (member) => {
  const csdc = require("discord.js");
  let csd = db.get(`otorol.${member.guild.id}`);
  if (!csd) return;

  let rol = csd.rol;
  let kanal = csd.log;
  if (!rol) return;
  const channel = member.guild.channels.cache.get(kanal);
  let role = member.guild.roles.cache.get(rol);
  if (!role) return;

  const vetrox = new csdc.EmbedBuilder()
    .setTitle(member.user.tag)
    .setDescription(
      `${member.user}, Sunucuya <@&${rol}> rolü ile katıldı! Senin ile birlikte **${member.guild.memberCount}** kişiyiz.`
    )
    .setColor(csdc.Colors.Blue)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }));

  await member.roles.add(rol).catch((err) => {
    if (!channel) return;
    return channel.send(
      `Yeterli yetkim bulunamadığı için rol veremiyorum. <@!${member.guild.ownerId}>`
    );
  });

  if (!channel) return;
  return channel.send({ embeds: [vetrox] }).catch((err) => { });
});
// Otorol \\


// Giriş-çıkış \\
client.on("guildMemberAdd", async (member) => {
  const csdc = require("discord.js");
  let csd = db.get(`giriscikis.${member.guild.id}`);
  if (!csd) return;

  let kanal = csd.gclog;
  const channel = member.guild.channels.cache.get(kanal);

  const vetrox = new csdc.EmbedBuilder()
    .setTitle(member.user.tag)
    .setDescription(
      `${member.user}, Sunucuya katıldı! Senin ile birlikte **${member.guild.memberCount}** kişiyiz.`
    )
    .setColor(csdc.Colors.Blue)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }));

  if (!channel) return;
  return channel.send({ embeds: [vetrox] }).catch((err) => { });
});

client.on("guildMemberRemove", async (member) => {
  const csdc = require("discord.js");
  let csd = db.get(`giriscikis.${member.guild.id}`);
  if (!csd) return;

  let kanal = csd.gclog;
  const channel = member.guild.channels.cache.get(kanal);

  const vetrox = new csdc.EmbedBuilder()
    .setTitle(member.user.tag)
    .setDescription(
      `${member.user}, Sunucudan ayrıldı! Artık **${member.guild.memberCount}** kişiyiz 🥲.`
    )
    .setColor(csdc.Colors.Blue)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }));

  if (!channel) return;
  return channel.send({ embeds: [vetrox] }).catch((err) => { });
});
// Giriş-çıkış \\


// DESTEK SİSTEMİ \\
const db = require("croxydb");
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId === "ticket") {
    const Discord = require("discord.js");
    let mod = db.fetch(`ticketmod_${interaction.guild.id}`);
    db.add(`sayi_${interaction.guild.id}`, 1);
    let sayi = db.fetch(`sayi_${interaction.guild.id}`) || "1";
    const row = new Discord.ActionRowBuilder().addComponents(
      new Discord.ButtonBuilder()
        .setEmoji("🔒")
        .setStyle(Discord.ButtonStyle.Success)
        .setCustomId("kapat")
    );
    interaction.guild.channels
      .create({
        name: `ticket-${sayi}`,
        type: Discord.ChannelType.GuildText,

        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [Discord.PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: interaction.user.id,
            allow: [Discord.PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: mod,
            allow: [Discord.PermissionsBitField.Flags.ViewChannel],
          },
        ],
      })

      .then((c) => {
        const i1 = new Discord.EmbedBuilder()
          .setTitle(client.user.username + " - Destek Sistemi!")
          .setDescription(
            `${interaction.user} Destek talebi başarıyla oluşturuldu.`
          )
          .setColor("Random");
        c.send({ embeds: [i1], components: [row] });
        interaction.reply({
          content: `Biletiniz başarıyla açıldı. <#${c.id}>`,
          ephemeral: true,
        });
      });
  }
});
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId === "kapat") {
    let channel = interaction.channel;
    channel.delete();
  }
});
// DESTEK SİSTEMİ \\



//reklam engel
const { PermissionsBitField } = require("discord.js")
client.on("messageCreate", (message) => {
  const db = require("croxydb")
  let reklamlar = db.fetch(`reklamengel_${message.guild.id}`)
  if (!reklamlar) return;

  if (reklamlar) {

    const linkler = [

      ".com.tr",
      ".net",
      ".org",
      ".tk",
      ".cf",
      ".gf",
      "https://",
      ".gq",
      "http://",
      ".com",
      ".gg",
      ".porn",
      ".edu"

    ]

    if (linkler.some(alo => message.content.toLowerCase().includes(alo))) {
      if (message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return;
      message.delete()
      message.channel.send(`<@${message.author.id}>, dostum. Bu sunucuda reklam engelleme sistemi aktif!`)
    }
  }
})
//reklam engel


//küfür engel
client.on("messageCreate", (message) => {
  const db = require("croxydb")
  let kufur = db.fetch(`kufurengel_${message.guild.id}`)
  if (!kufur) return;

  if (kufur) {
    const kufurler = [

      "amk",
      "piç",
      "yarrak",
      "oç",
      "göt",
      "amq",
      "yavşak",
      "amcık",
      "amcı",
      "orospu",
      "awk",
      "sikim",
      "sikeyim",
      "ananı",
      "aq",
      "mk"

    ]

    if (kufurler.some(alo => message.content.toLowerCase().includes(alo))) {
      if (message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return;
      message.delete()
      message.channel.send(`<@${message.author.id}>, dostum! Bu sunucuda küfür engelleme sistemi aktif! `)
    }
  }
})
//küfür engel



client.login(token)