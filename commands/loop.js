const { SlashCommandBuilder } = require("@discordjs/builders")
module.exports = {
  name: "loop",
  description: "loop the song!",
  data: new SlashCommandBuilder()
  .setName("loop")
  .setDescription("loop the current queue"),
  async execute(interaction, player, db, Permissions, QueueRepeatMode) {
    if (!interaction.member.voice.channelId) return interaction.reply({ content: "You are not in a voice channel!", ephemeral: true });
    if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return interaction.reply({ content: "You are not in my voice channel!", ephemeral: true });
    if (!player.getQueue(interaction.guild.id).playing) return interaction.reply({ content: "There is nothing playing!", ephemeral: true })
    await interaction.deferReply()
    const djRole = db.get(`${interaction.guildId}-dj`)
    if (player.getQueue(interaction.guild.id).repeatMode === 0) {
      if (djRole === "1234567") {
        try {
          player.getQueue(interaction.guild.id).setRepeatMode(QueueRepeatMode.QUEUE)
          return interaction.followUp("<a:musicTrick:934699600525262868> Now looping the queue")
        } catch {
          return interaction.followUp("<:musicWrong:936118223076724766> There was an error while looping the queue!")
        }
      }
      if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        try {
          player.getQueue(interaction.guild.id).setRepeatMode(QueueRepeatMode.QUEUE)
          return interaction.followUp("<a:musicTrick:934699600525262868> Now looping the queue")
        } catch {
          return interaction.followUp("<:musicWrong:936118223076724766> There was an error while looping the queue!")
        }
      } else if (interaction.member._roles.includes(djRole)) {
        try {
          player.getQueue(interaction.guild.id).setRepeatMode(QueueRepeatMode.QUEUE)
          return interaction.followUp("<a:musicTrick:934699600525262868> Now looping the queue")
        } catch {
          return interaction.followUp("<:musicWrong:936118223076724766> There was an error while looping the queue!")
        }
      } else {
        interaction.followUp("<:musicWrong:936118223076724766> You do not have the role needed to use this command")
      }
    }
    if (player.getQueue(interaction.guild.id).repeatMode === 2) {
      if (djRole === "1234567") {
        try {
          player.getQueue(interaction.guild.id).setRepeatMode(QueueRepeatMode.OFF)
          return interaction.followUp("<a:musicTrick:934699600525262868> turned off the loop!")
        } catch {
          return interaction.followUp("<:musicWrong:936118223076724766> There was an error while turning off loop!")
        }
      }
      if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        try {
          player.getQueue(interaction.guild.id).setRepeatMode(QueueRepeatMode.OFF)
          return interaction.followUp("<a:musicTrick:934699600525262868> turned off the loop!")
        } catch {
          return interaction.followUp("<:musicWrong:936118223076724766> There was an error while turning off loop!")
        }
      } else if (interaction.member._roles.includes(djRole)) {
        try {
          player.getQueue(interaction.guild.id).setRepeatMode(QueueRepeatMode.OFF)
          return interaction.followUp("<a:musicTrick:934699600525262868> turned off the loop!")
        } catch {
          return interaction.followUp("<:musicWrong:936118223076724766> There was an error while turning off loop!")
        }
      } else {
        interaction.followUp("<:musicWrong:936118223076724766> You do not have the role needed to use this command")
      }
    }
  }
};