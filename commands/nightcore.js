const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
module.exports = {
    name: "nightcore",
    description: "the nightcore effect",
    data: new SlashCommandBuilder()
    .setName('nightcore')
    .setDescription('Toggle the nightcore effect')
    .addBooleanOption(option => 
        option
            .setName('enable')
            .setDescription('enable or disable the nightcore filter')
            .setRequired(true)
    ),
    async execute(player, interaction, MessageEmbed, db) {
        const queue = player.getQueue(interaction.guild.id)
        if(interaction.member.voice.channel == null) return interaction.reply({ content: String("You are not in a voice channel"), ephemeral: true })
        if(interaction.member.voice.channel === null && interaction.guild.me.voice.channel !== null) return interaction.reply({ content: String("You are not in my voice channel"), ephemeral: true })
        if(!queue || !queue.playing) return interaction.reply({ content: String("There is nothing playing!"), ephemeral: true })
        const onOff = interaction.options.get("enable").value
        const djRole = db.get(`${interaction.guild.id}-dj`)
        await interaction.deferReply()
        if(djRole === "1234567") {
            if(onOff) {
                await queue.setFilters({
                    nightcore: true
                })
                const embed = new MessageEmbed()
                .setDescription('Enabled nightcore effect')
                .setColor(`GREEN`)
                return interaction.followUp({
                    embeds: [embed]
                })
            }
            if(!onOff) {
                await queue.setFilters({
                    nightcore: false
                })
                const embed = new MessageEmbed()
                .setDescription('Disabled nightcore effect')
                .setColor(`RED`)
                return interaction.followUp({
                    embeds: [embed]
                })
            }
        } else if(interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
            if(onOff) {
                await queue.setFilters({
                    nightcore: true
                })
                const embed = new MessageEmbed()
                .setDescription('Enabled nightcore effect')
                .setColor(`GREEN`)
                return interaction.followUp({
                    embeds: [embed]
                })
            }
            if(!onOff) {
                await queue.setFilters({
                    nightcore: false
                })
                const embed = new MessageEmbed()
                .setDescription('Disabled nightcore effect')
                .setColor(`RED`)
                return interaction.followUp({
                    embeds: [embed]
                })
            }
        } else if(interaction.member._roles.includes(djRole)) {
            if(onOff) {
                await queue.setFilters({
                    nightcore: true
                })
                const embed = new MessageEmbed()
                .setDescription('Enabled nightcore effect')
                .setColor(`GREEN`)
                return interaction.followUp({
                    embeds: [embed]
                })
            }
            if(!onOff) {
                await queue.setFilters({
                    nightcore: false
                })
                const embed = new MessageEmbed()
                .setDescription('Disabled nightcore effect')
                .setColor(`RED`)
                return interaction.followUp({
                    embeds: [embed]
                })
            }
        } else {
            interaction.followUp('You do not have the role needed to use this command')
        }
    }
}
