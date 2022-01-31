const { SlashCommandBuilder } = require("@discordjs/builders")
module.exports = {
  name: "nowplaying",
  description: "what song is playing now",
  data: new SlashCommandBuilder()
  .setName("nowplaying")
  .setDescription("what is playing now"),
  async execute(interaction, player, Discord, MessageEmbed) {
    if (!interaction.member.voice.channelId) return interaction.reply({ content: "You are not in a voice channel!", ephemeral: true });
      if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return interaction.reply({ content: "You are not in my voice channel!", ephemeral: true });
      if (!player.getQueue(interaction.guild.id).playing) return interaction.reply({ content: "There is nothing playing!", ephemeral: true })
      await interaction.deferReply()
      const nowPlaying = player.getQueue(interaction.guild.id).current
      const bar = player.getQueue(interaction.guild.id).createProgressBar();
      const embed = new Discord.MessageEmbed()
      .setTitle("Now playing!")
      .setDescription(`${nowPlaying}\n${bar}`)
      .setColor("BLUE")
      interaction.followUp({ embeds: [embed] })
  }
};