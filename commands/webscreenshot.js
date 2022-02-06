//not music releated but eh
const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, Permissions } = require('discord.js')
var validUrl = require('valid-url');
module.exports = {
    name: "screenshot",
    description: "screenshots a webpage",
    data: new SlashCommandBuilder()
    .setName('screenshot')
    .setDescription('screenshot a webpage')
    .addStringOption(option =>
        option
            .setName('url')
            .setDescription('The url of the page you want to screenshot')
            .setRequired(true)
    ),
    async execute(interaction, db) {
        const url = interaction.options.get("url").value
        await interaction.deferReply()
        const boolean = db.get(`${interaction.guildId}-screenshot`)
        if(boolean === true) {
            if(!String(url).startsWith('https://')) {
                const embed = new MessageEmbed()
                .setDescription('Error! Web URL have to start with https://')
                .setColor('RED')
                return interaction.followUp({
                    embeds: [embed]
                })
            }
            if(!validUrl.isUri(url)) {
                const embed = new MessageEmbed()
                .setDescription('Error! Please enter a real URL')
                .setColor('RED')
                return interaction.followUp({
                    embeds: [embed]
                })
            }
            const embed = new MessageEmbed()
            .setTitle('A web screenshot')
            .setDescription(`A screenshot of ${url}`)
            .setImage(`https://api.popcat.xyz/screenshot?url=${url}`)
            .setColor('GREEN')
            return interaction.followUp({
                embeds: [embed]
            })
            }
        }
        if(boolean === false) {
            if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return interaction.reply({ content: "You need `MANAGE_SERVER` permission to use this command", ephemeral: true })
        }
        if(!String(url).startsWith('https://')) {
                const embed = new MessageEmbed()
                .setDescription('Error! Web URL have to start with https://')
                .setColor('RED')
                return interaction.followUp({
                    embeds: [embed]
                })
            }
            if(!validUrl.isUri(url)) {
                const embed = new MessageEmbed()
                .setDescription('Error! Please enter a real URL')
                .setColor('RED')
                return interaction.followUp({
                    embeds: [embed]
                })
            }
            const embed = new MessageEmbed()
            .setTitle('A web screenshot')
            .setDescription(`A screenshot of ${url}`)
            .setImage(`https://api.popcat.xyz/screenshot?url=${url}`)
            .setColor('GREEN')
            return interaction.followUp({
                embeds: [embed]
            })
        }
}
