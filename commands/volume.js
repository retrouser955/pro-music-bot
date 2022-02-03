const { SlashCommandBuilder } = require("@discordjs/builders")
module.exports = {
    name: "volume",
    description: "The volume command",
    data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Change the player's volume")
    .addNumberOption(option =>
        option
            .setName("amount")
            .setDescription("amount of volume")
            .setRequired(true)
    ),
    async execute(player, interaction, MessageEmbed, Discord) {
        if (!interaction.member.voice.channelId) return await interaction.reply({ content: "You are not in a voice channel!", ephemeral: true });
        if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return await interaction.reply({ content: "You are not in my voice channel!", ephemeral: true });
        const guildQueue = player.getQueue(interaction.guild.id)
        if(!player.getQueue(interaction.guild.id).playing) return interaction.reply({ content: String('there is nothing playing'), ephemeral: true })
        const value = interaction.options.get('amount').value
        if(value < 0) return interaction.reply({ content: String('The value need to be above 0'), ephemeral: true })
        if(value > 100) return interaction.reply({ content: String('The value need to be below 100'), ephemeral: true })
        await interaction.deferReply()
        await guildQueue.setVolume(value)
        const embed = new Discord.MessageEmbed()
        .setTitle('The volume has been changed')
        .setDescription(`Now switching the volume to ${String(value)}`)
        .setColor('RANDOM')
        return interaction.followUp({
            embeds: [embed]
        })
    }
}