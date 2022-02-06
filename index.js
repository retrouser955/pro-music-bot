(async () => {
  const { Intents, Client, MessageEmbed, Permissions } = require("discord.js")
  const dbs = require('./website.js')
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
    if(Url === null) return
    console.log(`Your redirect URL is ${Url}/auth/login`)
  })

  const options = {
    theme: DashboardTheme,
    secret: Secret || process.env['SECRET'],
    description: String(Description),
    noPortIncallbackUrl: HostedOnReplit,
    inviteUrl: InviteUrl,
    serverUrl: SupportServerUrl,
    baseUrl: Url
  }

  const dashboard = new Dashboard(client, options)
  client.dashboard = dashboard

  dbs.execute(dashboard, db)

  player.on("trackStart", async (queue, track) => {
    playerEvents.execute(queue, track, db)
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
    if(interaction.commandName === 'volume') return client.commands.get('volume').execute(player, interaction, MessageEmbed, Discord)
    if(interaction.commandName === 'nightcore') return client.commands.get('nightcore').execute(player, interaction, MessageEmbed, db)
    if(interaction.commandName === 'screenshot') return client.commands.get('screenshot').execute(interaction)
  })
  return
})()
