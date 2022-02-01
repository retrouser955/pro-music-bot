(async () => {
  const { Intents, Client, MessageEmbed, Permissions } = require("discord.js")
  //hello :) hehe
  const {
    Token,
    Secret,
    HostedOnReplit,
    DashboardTheme,
    Url,
    Description,
    InviteUrl,
    SupportServerUrl,
    BotId,
    logEveryAction
  } = require("./config.json")
  //require config file
  const Discord = require("discord.js")
  //require discord
  const client = new Discord.Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]
  });
  //create client
  const fs = require('fs')
  //require fs
  const { Routes } = require('discord-api-types/v9');
  //require discord-api-types
  const { REST } = require('@discordjs/rest');
  //require @discordjs/rest
  const { SlashCommandBuilder } = require("@discordjs/builders")
  //require @discordjs/rest
  const cmds = [];
  //we will register cmds
  client.commands = new Discord.Collection();
  const commandFiles = fs.readdirSync('./commands').filter(files => files.endsWith('.js'))
  //fs stuff dont worry
  for(const file of commandFiles) {
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command)
    cmds.push(command.data.toJSON());
    console.log(`⏱ | loaded file : ${file}`)
  }
  //loading files
  const rest = new REST({ version: '9' }).setToken(Token || process.env['TOKEN']);
  // create a new REST
  try {
    console.log('Started refreshing application [/] commands.');
    await rest.put(
      Routes.applicationCommands(BotId),
      { body: cmds },
    );
    console.log('Successfully reloaded application [/] commands.');
  } catch (error) {
    console.error(error);
  }
  //slash cmds
  

  await client.login(Token || process.env['TOKEN'])
  //login
  const { Player, QueueRepeatMode } = require("discord-player")
//require discord-player
  const playdl = require("play-dl")
//same with play-dl
  const player = new Player(client)
//create the player client
  process.on("uncaughtException", async (err) => {
    console.log(err)
  })
//anticrash
  const Database = require('easy-json-database')
  const db = new Database("./dashsettings.json", {
    snapshots: {
      enabled: true,
      interval: 24 * 60 * 60 * 1000,
      folder: './backups/'
    }
  });
//db
  const Dashboard = require("discord-easy-dashboard");

  //require discord-easy-dashboard

  client.on('guildCreate', async (guild) => {
    db.set(`${guild.id}-thumbnail`, false)
    db.set(`${guild.id}-dj`, "1234567")
    db.set(`${guild.id}-announce`, true)
  })
  //add stuff ig
  client.on('ready', () => {
    console.log(`${client.user.tag} is ready!`)
    console.log(`Invite your bot at https://discord.com/oauth2/authorize?client_id=${BotId}&permissions=240754424128&scope=bot%20applications.commands`)
  })

  const options = {
    theme: DashboardTheme,
    secret: Secret || process.env['SECRET'],
    description: String(Description),
    noPortIncallbackUrl: HostedOnReplit,
    inviteUrl: InviteUrl,
    serverUrl: SupportServerUrl
  }

  const dashboard = new Dashboard(client, options)
  client.dashboard = dashboard

  client.dashboard.registerCommand('help', 'Shows you the link of the dashboard', '/help');

  client.dashboard.registerCommand('nowplaying', 'what song is playing now', '/nowplaying');
  
  client.dashboard.registerCommand('queue', 'The server queue', '/queue')

  client.dashboard.registerCommand('play', 'Plays a song in a voice channel', '/play [song]');

  client.dashboard.registerCommand('stop', 'Stop the queue.', '/stop')

  client.dashboard.registerCommand('skip', 'Skip the current Song', '/skip')

  client.dashboard.registerCommand('pause', 'Pause the current queue', '/pause')

  client.dashboard.registerCommand('resume', 'Resume the queue', '/resume')

  client.dashboard.registerCommand('loop', 'Loop the current queue', '/loop')

  const announceSetter = (discordClient, guild, value) => db.set(`${guild.id}-announce`, value)

  const announceGetter = (discordClient, guild) => db.get(`${guild.id}-announce`)

  client.dashboard.addBooleanInput(`announce Songs?`, `If you want bot to announce songs or not`, announceSetter, announceGetter)

  const role = (discordClient, guild) => guild.roles.cache.map(role => [role.id, role.name])

  const setRole = (discordClient, guild, value) => db.set(`${guild.id}-dj`, String(value))

  const getRole = (discordClient, guild) => {
    if (!db.has(`${guild.id}-dj`)) {
      return ['1234567', 'No dj role selected']
    }
    const dbRole = db.get(`${guild.id}-dj`)
    if (dbRole === "1234567") {
      return ['1234567', 'No dj role selected']
    }
    const roleID = db.get(`${guild.id}-dj`);
    const roleName = guild.roles.cache.get(roleID).name
    return [roleID, roleName]
  }

  client.dashboard.addSelector('DJ role', `The role that doesn't have permissions but can use DJ commands`, role, setRole, getRole)

  const thumbnailSetter = (discordClient, guild, value) => db.set(`${guild.id}-thumbnail`, value)
  const thumbnailGetter = (discordClient, guild) => db.get(`${guild.id}-thumbnail`)

  client.dashboard.addBooleanInput(`Show song thumbnails?`, `You might want this disabled as some thumbnail might have nsfw content`, thumbnailSetter, thumbnailGetter)

  player.on("trackStart", async (queue, track) => {
    const metaID = queue.metadata.guild
    const announce = db.get(`${metaID}-announce`)
    if (announce === false) return;
    const guildID = db.get(`${metaID}-thumbnail`)
    if (guildID === false) {
      const falseEmbed = new Discord.MessageEmbed()
        .setTitle("New song playing")
        .setURL(`${track.url}`)
        .setColor(`BLUE`)
        .addFields(
          { name: 'Track Title', value: `${track.title}`, inline: true },
          { name: 'Track Author', value: `${track.author}`, inline: true },
          { name: 'Track duration', value: '`' + track.duration + '`', inline: true }
        )
      queue.metadata.channel.send({ embeds: [falseEmbed] })
    } else {
      const trueEmbed = new Discord.MessageEmbed()
        .setTitle("New song playing")
        .setURL(`${track.url}`)
        .addFields(
          { name: 'Track Title', value: `${track.title}`, inline: true },
          { name: 'Track Author', value: `${track.author}`, inline: true },
          { name: 'Track duration', value: '`' + track.duration + '`', inline: true }
        )
        .setColor(`BLUE`)
        .setThumbnail(`${track.thumbnail}`)
      queue.metadata.channel.send({ embeds: [trueEmbed] })
    }
  })
  player.on('error', async (queue, error) => {
    await queue.metadata.channel.send("There was an error while executing an request")
    console.log(error)
  })
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    if(logEveryAction === true) {
      console.log(`${interaction.commandName} was used`)
    }
    if (interaction.commandName === "help") return client.commands.get('help').execute(interaction, Discord, MessageEmbed)
    if (interaction.commandName === "play") return client.commands.get('play').execute(interaction, player, playdl, db)
    if (interaction.commandName === "stop") return client.commands.get('stop').execute(interaction, player, db, Permissions)
    if(interaction.commandName === "skip") return client.commands.get('skip').execute(interaction, player, db, Permissions)
    if(interaction.commandName === "resume") return client.commands.get('resume').execute(interaction, player, db, Permissions)
    if(interaction.commandName === "pause") return client.commands.get('pause').execute(interaction, player, db, Permissions)
    if(interaction.commandName === "loop") return client.commands.get('loop').execute(interaction, player, db, Permissions, QueueRepeatMode)
    if(interaction.commandName === "nowplaying") return client.commands.get('nowplaying').execute(interaction, player, Discord, MessageEmbed)
    if(interaction.commandName === "queue") return client.commands.get('queue').execute(interaction, player, Discord, MessageEmbed)
  })
  return
})()
