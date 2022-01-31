const { SlashCommandBuilder } = require("@discordjs/builders")
module.exports = {
  name: "skip",
  description: "skip the current song",
  data: new SlashCommandBuilder()
  .setName("skip")
  .setDescription("skip the current song!"),
  async execute(interaction, player, db, Permissions) {
    if (!interaction.member.voice.channelId) return interaction.reply({ content: "You are not in a voice channel!", ephemeral: true });
      if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return interaction.reply({ content: "You are not in my voice channel!", ephemeral: true });
      if (!player.getQueue(interaction.guild.id).playing) return interaction.reply({ content: "There is nothing playing!", ephemeral: true })
      await interaction.deferReply()
      const djRole = db.get(`${interaction.guildId}-dj`)
      if (djRole === "1234567") {
        try {
          player.getQueue(interaction.guild.id).skip()
          return interaction.followUp("<a:musicTrick:934699600525262868> Sucessfully skipped current song!")
        } catch {
          return interaction.followUp("<:musicWrong:936118223076724766> There was an error while skipping music!")
        }
      }
      if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        try {
          player.getQueue(interaction.guild.id).skip()
          await interaction.followUp("<a:musicTrick:934699600525262868> Sucessfully skipped the music")
        } catch {
          return interaction.followUp("<:musicWrong:936118223076724766> There was an error while skipping music!")
        }
      } else if (interaction.member._roles.includes(djRole)) {
        try {
          player.getQueue(interaction.guild.id).skip()
          return interaction.followUp("<a:musicTrick:934699600525262868> Sucessfully skipped the music")
        } catch {
          return interaction.followUp("<:musicWrong:936118223076724766> There was an error while skipping music!")
        }
      } else {
        interaction.followUp("<:musicWrong:936118223076724766> You do not have the role needed to use this command")
      }
  }
};