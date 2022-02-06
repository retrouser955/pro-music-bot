module.exports = {
    name: "dashboardSettings",
    description: 'settings for the dashboard',
    async execute(dashboard, db) {
        dashboard.registerCommand('help', 'Shows you the link of the dashboard', '/help');

        dashboard.registerCommand('nowplaying', 'what song is playing now', '/nowplaying');
  
        dashboard.registerCommand('queue', 'The server queue', '/queue')

        dashboard.registerCommand('play', 'Plays a song in a voice channel', '/play [song]');

        dashboard.registerCommand('stop', 'Stop the queue.', '/stop')

        dashboard.registerCommand('skip', 'Skip the current Song', '/skip')

        dashboard.registerCommand('pause', 'Pause the current queue', '/pause')

        dashboard.registerCommand('resume', 'Resume the queue', '/resume')

        dashboard.registerCommand('loop', 'Loop the current queue', '/loop')

        const announceSetter = (discordClient, guild, value) => db.set(`${guild.id}-announce`, value)

        const announceGetter = (discordClient, guild) => db.get(`${guild.id}-announce`)

        dashboard.addBooleanInput(`announce Songs?`, `If you want bot to announce songs or not`, announceSetter, announceGetter)

        const role = (discordClient, guild) => guild.roles.cache.map(role => [role.id, role.name])

        const setRole = (discordClient, guild, value) => db.set(`${guild.id}-dj`, String(value))

        const getRole = (discordClient, guild) => {
            if (!db.has(`${guild.id}-dj`)) {
            return ['1234567', 'No dj role selected']
            }
            const dbRole = db.get(`${guild.id}-dj`)
            if (dbRole === "1234567") {
                return ['1234567', 'No dj role selected']
            }
            const roleID = db.get(`${guild.id}-dj`);
            const roleName = guild.roles.cache.get(roleID).name
            return [roleID, roleName]
        }

        dashboard.addSelector('DJ role', `The role that doesn't have permissions but can use DJ commands`, role, setRole, getRole)

        const thumbnailSetter = (discordClient, guild, value) => db.set(`${guild.id}-thumbnail`, value)
        const thumbnailGetter = (discordClient, guild) => db.get(`${guild.id}-thumbnail`)

        dashboard.addBooleanInput(`Show song thumbnails?`, `You might want this disabled as some thumbnail might have nsfw content`, thumbnailSetter, thumbnailGetter)
        const screenshotSetter = (discordClient, guild, value) => db.set(`${guild.id}-screenshot`, value)
        const screenshotGetter = (discordClient, guild, value) => db.get(`${guild.id}-screenshot`) || false
        dashboard.addBooleanInput(
            `ScreenShot`,
            `If you want memeber to use the /screenshot commands or not`,
            screenshotSetter,
            screenshotGetter
        )
    }
}