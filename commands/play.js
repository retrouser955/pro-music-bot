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
      await interaction.deferReply();
      const queue = player.createQueue(interaction.guild, {
        metadata: {
          channel: interaction.channel,
          guild: interaction.guildId
        },
        async onBeforeCreateStream(track, source, _queue) {
          if (source === "youtube") {
            return (await playdl.stream(track.url, { discordPlayerCompatibility : true })).stream;
          }
	  if (source === "spotify") {
            await interaction.channel.send(`Streaming from spotify is not supported. The bot maintainer (Retro#2448) will fix it ASAP\n Replying to ${interaction.author}'s request`)
	    return (await playdl.stream("https://www.youtube.com/watch?v=jhFDyDgMVUI", { discordPlayerCompatibility : true } )).stream;
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
      const songName = interaction.options.get("song").value
      const track = await player.search(songName, {
        requestedBy: interaction.user
      }).then(x => x.tracks[0]);
      if (!track) return interaction.followUp({ content: `You requested track **${songName}** was not found` });
      queue.play(track);
      return interaction.followUp({ content: `<a:musicLoading:936558267616866326> | Loading track **${track.title}**!` });
  }
};
