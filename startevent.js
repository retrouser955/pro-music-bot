module.exports = {
    name: "event",
    description: "events of bot",
    async execute(queue, track, db) {
        const metaID = queue.metadata.guild
        const announce = db.get(`${metaID}-announce`)
        if (announce === false) return;
        const guildID = db.get(`${metaID}-thumbnail`)
        if (guildID === false) {
            const falseEmbed = new Discord.MessageEmbed()
            .setTitle("New song playing")
            .setURL(`${track.url}`)
            .setColor(`BLUE`)
            .addFields(
                { name: 'Track Title', value: `${track.title}`, inline: true },
                { name: 'Track Author', value: `${track.author}`, inline: true },
                { name: 'Track duration', value: '`' + track.duration + '`', inline: true }
            )
        queue.metadata.channel.send({ embeds: [falseEmbed] })
        } else {
            const trueEmbed = new Discord.MessageEmbed()
            .setTitle("New song playing")
            .setURL(`${track.url}`)
            .addFields(
                { name: 'Track Title', value: `${track.title}`, inline: true },
                { name: 'Track Author', value: `${track.author}`, inline: true },
                { name: 'Track duration', value: '`' + track.duration + '`', inline: true }
            )
            .setColor(`BLUE`)
            .setThumbnail(`${track.thumbnail}`)
        queue.metadata.channel.send({ embeds: [trueEmbed] })
    }
    }
}