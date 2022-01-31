const { SlashCommandBuilder } = require("@discordjs/builders")
module.exports = {
  name: "stop",
  description: "stop the current music in vc",
  data: new SlashCommandBuilder()
  .setName("stop")
  .setDescription("stop playing in your vc"),
  async execute(interaction, player, db, Permissions) {
    if (!interaction.member.voice.channelId) return interaction.reply({ content: "You are not in a voice channel!", ephemeral: true });
      if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return interaction.reply({ content: "You are not in my voice channel!", ephemeral: true });
      if (!player.getQueue(interaction.guild.id).playing) return interaction.reply({ content: "There is nothing playing!", ephemeral: true })
      await interaction.deferReply()
      const djRole = db.get(`${interaction.guildId}-dj`)
      if (djRole === "1234567") {
        try {
          player.getQueue(interaction.guild.id).destroy()
          return interaction.followUp("<a:musicTrick:934699600525262868> Sucessfully stopped the music")
        } catch {
          return interaction.followUp("<:musicWrong:936118223076724766> There was an error while stopping music!")
        }
      }
      if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        try {
          player.getQueue(interaction.guild.id).destroy()
          await interaction.followUp("<a:musicTrick:934699600525262868> Sucessfully stopped the music")
        } catch {
          return interaction.followUp("<:musicWrong:936118223076724766> There was an error while stopping music!")
        }
      } else if (interaction.member._roles.includes(djRole)) {
        try {
          player.getQueue(interaction.guild.id).destroy()
          return interaction.followUp("<a:musicTrick:934699600525262868> Sucessfully stopped the music")
        } catch {
          return interaction.followUp("<:musicWrong:936118223076724766> There was an error while stopping music!")
        }
      } else {
        interaction.followUp("<:musicWrong:936118223076724766> You do not have the role needed to use this command")
      }
  }
};