const { SlashCommandBuilder } = require("@discordjs/builders")
module.exports = {
  name: "queue",
  description: "the server queue",
  data: new SlashCommandBuilder()
  .setName("queue")
  .setDescription('The server queue'),
  async execute(interaction, player, Discord, MessageEmbed) {
    if (!interaction.member.voice.channelId) return interaction.reply({ content: "You are not in a voice channel!", ephemeral: true });
    if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return interaction.reply({ content: "You are not in my voice channel!", ephemeral: true });
    if (!player.getQueue(interaction.guild.id).playing) return interaction.reply({ content: "There is nothing playing!", ephemeral: true })
    await interaction.deferReply()
    const queue = player.getQueue(interaction.guild.id)
    const currentTrack = queue.current;
    const tracks = queue.tracks.slice(0, 10).map((m, i) => {
      return `${i + 1}. **${m.title}** ([link](${m.url}))`;
    });
    const embed = new Discord.MessageEmbed()
      .setColor(`RANDOM`)
      .setTitle(`Queue for ${interaction.guild.name}`)
      .setDescription(
        `Now Playing : ${currentTrack.title}\n
        ${tracks.join("\n")}${
        queue.tracks.length > tracks.length
          ? `\n...${
          queue.tracks.length - tracks.length === 1
            ? `${queue.tracks.length - tracks.length} more track`
            : `${queue.tracks.length - tracks.length} more tracks`
          }`
          : ""
        }`
      )
    return interaction.editReply({ embeds: [embed] });
  }
};
