const { SlashCommandBuilder } = require("@discordjs/builders")
module.exports = {
  name: "play",
  description: "play in the vc",
  data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Play a song.")
		.addStringOption(option =>
			option
				.setName("song")
				.setDescription("song name")
				.setRequired(true)
		),
  async execute(interaction, player, playdl) {
    if (!interaction.member.voice.channelId) return interaction.reply({ content: "You are not in a voice channel!", ephemeral: true });
    if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return interaction.reply({ content: "You are not in my voice channel!", ephemeral: true });
    const songName = interaction.options.get("song").value
    if(String(songName).toLowerCase().startsWith('https://open.spotify.com')) return interaction.reply({ content: "Spotify is not supported at the moment!", ephemeral: true })
      await interaction.deferReply();
      const queue = player.createQueue(interaction.guild, {
        metadata: {
          channel: interaction.channel,
          guild: interaction.guildId
        },
        async onBeforeCreateStream(track, source, _queue) {
	  try {
          if (track.url.includes("youtube.com"))
            return (await playdl.stream(track.url, { discordPlayerCompatibility: true })).stream;
          else if (track.url.includes("spotify.com") || track.url.includes("soundcloud")) {
            return (await playdl.stream(await playdl.search(`${track.author} ${track.title} lyric`, { limit: 1, source: { youtube: "video" } }).then(x => x[0].url), { discordPlayerCompatibility: true })).stream;
          }
        } catch {
          interaction.followUp({ embeds: [{ description: `An error occurred while attempting to play [${track.title}](${track.url}).`, color: 0xb84e44 }] });
          return (await playdl.stream("https://www.youtube.com/watch?v=Wch3gJG2GJ4", { quality: 0, discordPlayerCompatibility: true })).stream;
        }
        }
      })
      try {
        if (!queue.connection) await queue.connect(interaction.member.voice.channel);
      } catch (e) {
        console.log(e)
        queue.destroy();
        return await interaction.followUp({ content: "Could not join your voice channel!", ephemeral: true });
      }
      const track = await player.search(songName, {
        requestedBy: interaction.user
      }).then(x => x.tracks[0]);
      if (!track) return interaction.followUp({ content: `You requested track **${songName}** was not found` });
      queue.play(track);
      return interaction.followUp({ content: `<a:musicLoading:936558267616866326> | Loading track **${track.title}**!` });
  }
};
