<p align="center"><a href="https://nodei.co/npm/@devraelfreeze/discordjs-antispam/"><img src="https://nodei.co/npm/@devraelfreeze/discordjs-antispam.png" alt=""></a></p>

<div align="center">
<a href="https://github.com/devRael1/discordjs-antispam/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/devRael1/discordjs-antispam"></a>
<a href="https://github.com/devRael1/discordjs-antispam/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/devRael1/discordjs-antispam"></a>
<a href="https://github.com/devRael1/discordjs-antispam/blob/master/MIT-LICENCE"><img alt="GitHub license" src="https://img.shields.io/github/license/devRael1/discordjs-antispam?color=red"></a>
<img alt="npm" src="https://img.shields.io/npm/dw/@devraelfreeze/discordjs-antispam?color=purple">
<br>
<img alt="npm (tag)" src="https://img.shields.io/npm/v/@devraelfreeze/discordjs-antispam/latest?color=yellow&label=%40devraelfreeze%2Fdiscordjs-antispam">
</div>

# ❓ discordjs-antispam


A simple module with quick setup and different options to implement anti-spam features in your bot.
<br>**_This version of the package will only support discord.js v13_**
<br>
### ⚠️ This package support multi-guilds !

## 📥 Installation

To install this module type the following command in your console:
```
npm i @devraelfreeze/discordjs-antispam
```

## ⬇️ Examples

### Example of a basic bot handling spam messages using this module.

```js
const Discord = require("discord.js");
const client = new Discord.Client({
    intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES],
});

const AntiSpam = require("@devraelfreeze/discordjs-antispam");
const antiSpam = new AntiSpam(client , {
    customGuildOptions: false, // Use custom Guild Options or not
    warnThreshold: 4, // Amount of messages sent in a row that will cause a warning.
    muteThreshold: 6, // Amount of messages sent in a row that will cause a mute
    kickThreshold: 8, // Amount of messages sent in a row that will cause a kick.
    banThreshold: 10, // Amount of messages sent in a row that will cause a ban.
    maxInterval: 2000, // Amount of time (in milliseconds) in which messages are considered spam.
    warnMessage: "{@user}, Please stop spamming.", // Message that will be sent in chat upon warning a user.
    kickMessage: "**{user_tag}** has been kicked for spamming.", // Message that will be sent in chat upon kicking a user.
    muteMessage: "**{user_tag}** has been muted for spamming.", // Message that will be sent in chat upon muting a user.
    banMessage: "**{user_tag}** has been banned for spamming.", // Message that will be sent in chat upon banning a user.
    maxDuplicatesWarning: 6, // Amount of duplicate messages that trigger a warning.
    maxDuplicatesMute: 8, // Ammount of duplicate message that trigger a mute.
    maxDuplicatesKick: 10, // Amount of duplicate messages that trigger a kick.
    maxDuplicatesBan: 12, // Amount of duplicate messages that trigger a ban.
    ignoredPermissions: ["ADMINISTRATOR"], // Bypass users with any of these permissions.
    ignoreBots: true, // Ignore bot messages.
    verbose: true, // Extended Logs from module.
    ignoredMembers: [], // Array of User IDs that get ignored.
    unMuteTime:  10, // Amount of time (in minutes) a user will be muted for.
    removeMessages: true, // If the bot should remove all the spam messages when taking action on a user!
    modLogsEnabled: false, // If to enable modlogs
    modLogsChannelName: "CHANNEL_ID", // channel ID to send the logs
    // And many more options...
});

/** Listeners */
client.on("ready", () => console.log(`Logged in as ${client.user.tag}.`));
client.on("messageCreate", async (message) => {
    /** Check spam */
    await antiSpam.message(message);
    /** Check words Filter */
    const containt_badWord = await antiSpam.message_wordfilter(message);
    /** Get array of bad words containing in the message */
    const badWordsArray = await antiSpam.message_badWordsUsages(message);
});
/** Login the bot */
client.login("VERY SECRET TOKEN HERE :)");
```

### Example of Multi-Guilds
```js
const Discord = require("discord.js");
const client = new Discord.Client({
  intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES],
});
const AntiSpam = require("@devraelfreeze/discordjs-antispam");
const antiSpam = new AntiSpam(client, {customGuildOptions: true});

/** Listeners */
client.on("ready", () => console.log(`Logged in as ${client.user.tag}.`));
client.on("messageCreate", async (message) => {
    /** Custom guild options in Object */
    const guildOptions = {
        warnThreshold: 4, // Amount of messages sent in a row that will cause a warning.
        muteThreshold: 6, // Amount of messages sent in a row that will cause a mute
        kickThreshold: 8, // Amount of messages sent in a row that will cause a kick.
        banThreshold: 10, // Amount of messages sent in a row that will cause a ban.
        maxInterval: 2000, // Amount of time (in milliseconds) in which messages are considered spam.
        warnMessage: "{@user}, Please stop spamming.", // Message that will be sent in chat upon warning a user.
        kickMessage: "**{user_tag}** has been kicked for spamming.", // Message that will be sent in chat upon kicking a user.
        muteMessage: "**{user_tag}** has been muted for spamming.", // Message that will be sent in chat upon muting a user.
        banMessage: "**{user_tag}** has been banned for spamming.", // Message that will be sent in chat upon banning a user.
        maxDuplicatesWarning: 6, // Amount of duplicate messages that trigger a warning.
        maxDuplicatesMute: 8, // Ammount of duplicate message that trigger a mute.
        maxDuplicatesKick: 10, // Amount of duplicate messages that trigger a kick.
        maxDuplicatesBan: 12, // Amount of duplicate messages that trigger a ban.
        ignoredPermissions: ["ADMINISTRATOR"], // Bypass users with any of these permissions.
        ignoreBots: true, // Ignore bot messages.
        verbose: true, // Extended Logs from module.
        ignoredMembers: [], // Array of User IDs that get ignored.
        unMuteTime:  10, // Amount of time (in minutes) a user will be muted for.
        removeMessages: true, // If the bot should remove all the spam messages when taking action on a user!
        modLogsEnabled: false, // If to enable modlogs
        modLogsChannelName: "CHANNEL_ID", // channel ID to send the logs
        // And many more options...
    };
    /** Check spam */
    await antiSpam.message(message, guildOptions);
    /** Check words Filter */
    const containt_badWord = await antiSpam.message_wordfilter(message, guildOptions);
    /** Get array of bad words containing in the message */
    const badWordsArray = await antiSpam.message_badWordsUsages(message);
    
});
/** Login the bot */
client.login("VERY SECRET TOKEN HERE :)");
```

## ⚙️ AntiSpam Client Options
// TODO


## ⏳ TODO

* ✅ Add and Test: `Words Filter System` (Can configure the words list to filter) 
* Add and Test: `Discord Anti Links System`
* Add and Test: `Anti Links System` (Can configure the links to be checked)
* Add and Test: `Mass Mentions System`
* Add and Test: `Emojis excessifs System`
* ✅ Bypass Bots for All Systems *(Can be enabled or Disabled)*
* Finish the Example for README.md
* Find a method to clear cache for a guild when the cache is too big.
* Create docs for the module

## 📷 Screenshots
// TODO

## 🐛 Bug Reports

If you have any bugs or trouble setting the module up, feel free to open an issue on [Github Repository](https://github.com/devRael1/discordjs-antispam)
<br>
### If you want more support, you can contact me on Discord: `Freeze#0123`

## 🗃️ Old Versions

If you want to use old version, you can use command
```
npm i @devraelfreeze/discordjs-antispam@<version>
```

## 📝 License

Copyright © 2022 [devRael1](https://github.com/devRael1)
<br>This project is MIT licensed.
<br>This is not an official Discord product. It is not affiliated with or endorsed by Discord Inc.