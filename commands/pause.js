const { SlashCommandBuilder } = require("@discordjs/builders")
module.exports = {
  name: "pause",
  description: "stop the current music in vc",
  data: new SlashCommandBuilder()
  .setName("pause")
  .setDescription("the pause command"),
  async execute(interaction, player, db, Permissions) {
    if (!interaction.member.voice.channelId) return interaction.reply({ content: "You are not in a voice channel!", ephemeral: true });
      if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return interaction.reply({ content: "You are not in my voice channel!", ephemeral: true });
      if (!player.getQueue(interaction.guild.id).playing) return interaction.reply({ content: "There is nothing playing!", ephemeral: true })
      await interaction.deferReply()
      const djRole = db.get(`${interaction.guildId}-dj`)
      if (djRole === "1234567") {
        if(player.getQueue(interaction.guild.id).connection.paused) return interaction.followUp('<:musicWrong:936118223076724766> the player is already paused!')
        try {
          player.getQueue(interaction.guild.id).setPaused(true)
          return interaction.followUp("<a:musicTrick:934699600525262868> Sucessfully paused the music")
        } catch {
          return interaction.followUp("<:musicWrong:936118223076724766> There was an error while pausing the music!")
        }
      }
      if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        if(player.getQueue(interaction.guild.id).connection.paused) return interaction.followUp('<:musicWrong:936118223076724766> the player is already paused!')
        try {
          player.getQueue(interaction.guild.id).setPaused(true)
          await interaction.followUp("<a:musicTrick:934699600525262868> Sucessfully paused the music")
        } catch {
          return interaction.followUp("<:musicWrong:936118223076724766> There was an error while pausing music!")
        }
      } else if (interaction.member._roles.includes(djRole)) {
        if(player.getQueue(interaction.guild.id).connection.paused) return interaction.followUp('<:musicWrong:936118223076724766> the player is already paused!')
        try {
          player.getQueue(interaction.guild.id).setPaused(true)
          return interaction.followUp("<a:musicTrick:934699600525262868> Sucessfully paused the music")
        } catch {
          return interaction.followUp("<:musicWrong:936118223076724766> There was an error while pausing music!")
        }
      } else {
        interaction.followUp("<:musicWrong:936118223076724766> You do not have the role needed to use this command")
      }
  }
};