### Declare & Use module
```js
const Discord = require("discord.js");
const client = new Discord.Client({
    intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILDS]
});

const AntiSpam = require("@devraelfreeze/discordjs-antispam");
const antiSpam = new AntiSpam(client, {
    /** Options of AntiSpam Client here */
});

client.on("ready", () => console.log(`Logged in as ${client.user.tag}.`));
client.on("messageCreate", async (message) => {
    /** Add message in cache */
    await antiSpam.addMessagesCache(message); // You must do this if you want to use antispamFilter System
    await antiSpam.messageAntiSpam(message);
});
/** Login the bot */
client.login("VERY SECRET TOKEN HERE :)");
```

### Declare & Use Module with Options
```js
const Discord = require("discord.js");
const client = new Discord.Client({
    intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILDS]
});

const AntiSpam = require("@devraelfreeze/discordjs-antispam");
const antiSpam = new AntiSpam(client, {
    antispamFilter: {
        enabled: true,
        thresholds: {
            warn: 4,
            mute: 6,
            kick: 8,
            ban: 10
        },
        maxDuplicates: {
            warn: 4,
            mute: 6,
            kick: 8,
            ban: 10
        },
        maxInterval: 3000,
        maxDuplicatesInterval: 3000,
    },
    linksFilter: {
        enabled: false,
        globalLinksFilter: false,
        discordInviteLinksFilter: false,
        customLinksFilter: false,
        typeSanction: 'warn'
    },
    unMuteTime: 10,
    deleteMessagesAfterBanForPastDays: 1,
    verbose: true,
    debug: false,
    removeMessages: true
});
client.on("ready", () => console.log(`Logged in as ${client.user.tag}.`));
client.on("messageCreate", async (message) => {
    /** Add message in cache */
    await antiSpam.addMessagesCache(message); // You must do this if you want to use antispamFilter System
    await antiSpam.messageAntiSpam(message);
});
/** Login the bot */
client.login("VERY SECRET TOKEN HERE :)");
```