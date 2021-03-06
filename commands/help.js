const { SlashCommandBuilder } = require("@discordjs/builders")
const { Url } = require('../config.json')
module.exports = {
  name: "help",
  description: "help command",
  data: new SlashCommandBuilder()
  .setName("help")
  .setDescription('need help? use this command'),
  async execute(interaction, Discord, MessageEmbed) {
    const embed = new Discord.MessageEmbed()
      .setTitle(`Hey ${interaction.member.user.username}!`)
      .setDescription(`**[Our Command list is launched here!](${Url}/commands)**`)
      .setColor(`GREEN`)
    return interaction.reply({ embeds: [embed] })
  }
};
