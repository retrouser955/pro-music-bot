const { SlashCommandBuilder } = require("@discordjs/builders")
module.exports = {
  name: "resume",
  description: "resume the current track",
  data: new SlashCommandBuilder()
  .setName("resume")
  .setDescription("resume the current track"),
  async execute(interaction, player, db, Permissions) {
    if (!interaction.member.voice.channelId) return interaction.reply({ content: "You are not in a voice channel!", ephemeral: true });
      if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return interaction.reply({ content: "You are not in my voice channel!", ephemeral: true });
      if (!player.getQueue(interaction.guild.id).playing) return interaction.reply({ content: "There is nothing playing!", ephemeral: true })
      await interaction.deferReply()
      const djRole = db.get(`${interaction.guildId}-dj`)
      if (djRole === "1234567") {
        if(!player.getQueue(interaction.guild.id).connection.paused) return interaction.followUp('<:musicWrong:936118223076724766> the player is not paused!')
        try {
          await player.getQueue(interaction.guild.id).setPaused(false)
          return interaction.followUp("<a:musicTrick:934699600525262868> Sucessfully resumed the music")
        } catch (e) {
          console.log(e)
          return interaction.followUp("<:musicWrong:936118223076724766> There was an error while resuming music!")
        }
      }
      if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        if(!player.getQueue(interaction.guild.id).connection.paused) return interaction.followUp('<:musicWrong:936118223076724766> the player is not paused!')
        try {
          await player.getQueue(interaction.guild.id).setPaused(false)
          return interaction.followUp("<a:musicTrick:934699600525262868> Sucessfully resumed the music")
        } catch (e) {
          console.log(e)
          return interaction.followUp("<:musicWrong:936118223076724766> There was an error while resuming music!")
        }
      } else if (interaction.member._roles.includes(djRole)) {
        if(!player.getQueue(interaction.guild.id).connection.paused) return interaction.followUp('<:musicWrong:936118223076724766> the player is not paused!')
        try {
          player.getQueue(interaction.guild.id).setPaused(false)
          return interaction.followUp("<a:musicTrick:934699600525262868> Sucessfully resumed the music")
        } catch (e) {
          console.log(e)
          return interaction.followUp("<:musicWrong:936118223076724766> There was an error while resuming music!")
        }
      } else {
        interaction.followUp("<:musicWrong:936118223076724766> You do not have the role needed to use this command")
      }
  }
};