# Example: Declare & Use module with custom Guild Options
```js
const Discord = require("discord.js");
const client = new Discord.Client({
    intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILDS]
});
const AntiSpam = require("@devraelfreeze/discordjs-antispam");
const antiSpam = new AntiSpam(client, {customGuildOptions: true});

client.on("ready", async () => {
    console.log(`Logged in as ${client.user.tag}.`)
    /** Custom guild options in Object */
    const guildId = "123456789012345678";
    const guildOptions = {/** Options of AntiSpam */};
    await antiSpam.setGuildOptions(guildId, guildOptions);
});
client.on("messageCreate", async (message) => {
    await antiSpam.addMessagesCache(message); // You must do this if you want to use antispamFilter System
    await antiSpam.messageAntiSpam(message); // Use antispam filter system
});
/** Login the bot */
client.login("VERY SECRET TOKEN HERE :)");
```