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


A complex module with quick setup and different options to implement anti-spam and auto-moderation features in your bot.
<br>**_This version of the package will only support discord.js v13_**
<br>
#### ⚠️ This package support multi-guilds !

## 📥 Installation

To install this module type the following command in your console:
```
npm i @devraelfreeze/discordjs-antispam
```

## ⚙️ AntiSpam Client Options

| Options Name | Default Value | Description |
| :--- | :---: | :--- |
| `customGuildOptions` | `false` | Whether to use custom guild options |
| `wordsFilter` | `false` | Whether to use words filter system |
| `maxInterval` | `3000` | Amount of time (ms) in which messages are considered spam. |
| `maxDuplicatesInterval` | `3000` | Amount of time (ms) in which duplicate messages are considered spam. |
| `unMuteTime` | `10` | Time in minutes to wait until unmuting a user. |
| `modLogsEnabled` | `false` | Whether moderation logs are enabled. |
| `modLogsChannel` | `CHANNEL_ID` | ID of the channel in which moderation logs will be sent. |
| `deleteMessagesAfterBanForPastDays` | `1` | When a user is banned, their messages sent in the last x days will be deleted. |
| `verbose` | `false` | Extended logs from module (recommended). |
| `debug` | `false` | Whether to run the module in debug mode. |
| `removeMessages` | `true` | Whether to delete user messages after a sanction. |

| Options Object Name | Default Value | Description |
| :--- | :---: | :--- |
| `linksFilter` | `object` | Whether to use links filter system |
| `linksFilter.globalLinksFilter` | `false` | Whether to filter global links (all links) |
| `linksFilter.discordInviteLinksFilter` | `false` | Whether to filter discord invite links |
| `linksFilter.customLinksFilter` | `false` | Whether to filter custom links per guild |

| Options Object Name | Default Value | Description |
| :--- | :---: | :--- |
| `thresholds` | `object` | Amount of messages sent in a row that will cause a warning / mute / kick / ban. |
| `thresholds.warn` | `4` | Amount of messages sent in a row that will cause a warning. |
| `thresholds.mute` | `5` | Amount of messages sent in a row that will cause a mute. |
| `thresholds.kick` | `6` | Amount of messages sent in a row that will cause a kick. |
| `thresholds.ban` | `8` | Amount of messages sent in a row that will cause a ban. |

| Options Object Name | Default Value | Description |
| :--- | :---: | :--- |
| `maxDuplicates` | `object` | Amount of duplicate messages that trigger a warning / mute / kick / ban. |
| `maxDuplicates.warn` | `4` | Amount of duplicate messages sent in a row that will trigger a warning. |
| `maxDuplicates.mute` | `5` | Amount of duplicate messages sent in a row that will trigger a mute. |
| `maxDuplicates.kick` | `6` | Amount of duplicate messages sent in a row that will trigger a kick. |
| `maxDuplicates.ban` | `8` | Amount of duplicate messages sent in a row that will trigger a ban |

| Options Object Name | Default Value | Description |
| :--- | :---: | :--- |
| `message` | `object` | Messages that will be sent when a sanction is applied. |
| `message.warn` | `'{@user} has been warned for reason: **{reason}**'` | Message that will be sent when someone is warned. |
| `message.mute` | `'@{user} has been muted for reason: **{reason}**'` | Message that will be sent when someone is muted. |
| `message.kick` | `'**{user_tag}** has been kicked for reason: **{reason}**'` | Message that will be sent when someone is kicked. |
| `message.ban` | `'**{user_tag}** has been banned for reason: **{reason}**'` | Message that will be sent when someone is banned. |

| Options Object Name | Default Value | Description |
| :--- | :---: | :--- |
| `errorMessage` | `object` | Whether the bot should send a message when it doesn't have some required permissions |
| `errorMessage.enabled` | `true` | Enable / Disable the errorMessage system |
| `errorMessage.mute` | `'Could not mute @{user} because of improper permissions.'` | Message that will be sent when the bot doesn't have enough permissions to mute the member |
| `errorMessage.kick` | `'Could not kick @{user} because of improper permissions.'` | Message that will be sent when the bot doesn't have enough permissions to kick the member |
| `errorMessage.ban` | `'Could not ban @{user} because of improper permissions.'` | Message that will be sent when the bot doesn't have enough permissions to ban the member |

| Options Object Name | Default Value | Description |
| :--- | :---: | :--- |
| `ignore` | `object` | Configuration of roles / members / channels / permissions to ignore |
| `ignore.members` | `[]` | Array of member IDs (or Function) that are ignored. |
| `ignore.roles` | `[]` | Array of role IDs or role names (or Function) that are ignored. Members with one of these roles will be ignored. |
| `ignore.channels` | `[]` | Array of channel IDs or channel names (or Function) that are ignored. |
| `ignore.permissions` | `[]` | Users with at least one of these permissions will be ignored. |
| `ignore.bots` | `true` | Whether bots should be ignored. |

| Options Object Name | Default Value | Description |
| :--- | :---: | :--- |
| `enable` | `object` | Enable / Disable sanction system |
| `enable.warn` | `true` | Whether to enable warnings. |
| `enable.mute` | `true` | Whether to enable mutes. |
| `enable.kick` | `true` | Whether to enable kicks. |
| `enable.ban` | `true` | Whether to enable bans. |

## ⬇️ Examples

### Example: Basic AntiSpam Client with Options
```js
/** See all options above */
const AntiSpam = require("@devraelfreeze/discordjs-antispam");
const antiSpam = new AntiSpam(client, {
    customGuildOptions: true,
    wordsFilter: true,
    maxInterval: 2000,
    maxDuplicatesInterval: 2000,
    unMuteTime: 10,
    deleteMessagesAfterBanForPastDays: 1,
    verbose: false,
    debug: false,
    removeMessages: true,
    linksFilter: {
        globalLinksFilter: false,
        discordInviteLinksFilter: false,
        customLinksFilter: false
    },
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
    }
});
```
---
### Example: Declare & Use module
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
    await antiSpam.message(message);
});
/** Login the bot */
client.login("VERY SECRET TOKEN HERE :)");
```
---
### Example: Declare & Use module with custom Guild Options
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
    await antiSpam.message(message);
});
/** Login the bot */
client.login("VERY SECRET TOKEN HERE :)");
```
---
### Example: Use Words Filter System (Functions)
```js
/** Declare & Use module with 'messageCreate' event */
client.on("messageCreate", async (message) => {
    const contain_words = await antiSpam.messageWordsFilter(message);
    if (conatin_words) {
        /** Message contain word(s) */
    } else {
        /** Message doesn't contain word(s) */
    }
    
    /** Get array of bad words usages in message
     * return : getBadWords = ['bad word', 'bad word', 'bad word'];
     */
    const getBadWords = await antiSpam.messageBadWordsUsages(message);
    /**
     * Add custom word to the list for a guild. You can also use Array of words
     * @param {string|Array<string>} word(s) - Words to add
     * @param {string} guild_id - ID of the guild
     * @returns {Promise<boolean>} true if added or false if not added
     */
    const addWord = await antiSpam.addWords('bad word', message.guild.id);
    /**
     * Remove custom word from the list for a guild. You can also use Array of words
     * @param {string|Array<string>} word(s) - Words to remove
     * @param {string} guild_id - ID of the guild
     * @returns {Promise<boolean>} true if removed or false if not removed.
     */
    const removeWord = await antiSpam.removeWords('bad word', message.guild.id);
    /**
     * Get words list for a guild.
     * @param {string} guild_id - ID of the guild
     * @returns {Promise<Array<string>>} Array of words
     */
    const wordsList = await antiSpam.listWords(message.guild.id);
});
````
---
### Example: Use Links / Discord Invite Filter System (Functions)
```js
/** Declare & Use module with 'messageCreate' event */
client.on("messageCreate", async (message) => {
    const contain_words = await antiSpam.messageLinksFilter(message);
    if (conatin_words) {
        /** Message contain link(s) */
    } else {
        /** Message doesn't contain link(s) */
    }

    /**
     * Add link / links for a guild
     * @param {string|Array<string>} links - Links to add
     * @param {string} guild_id - ID of the guild
     * @returns {Promise<boolean>} true if added or false if not added
     */
    const addLink = await antiSpam.addLinks('https://discord.gg/123456789', message.guild.id);
    /**
     * Remove link / links for a guild
     * @param {string|Array<string>} links - Links to remove
     * @param {string} guild_id - ID of the guild
     * @returns {Promise<boolean>} true if removed or false if not removed.
     */
    const removeLink = await antiSpam.removeLinks('https://discord.gg/123456789', message.guild.id);
    /**
     * Get links list for a guild.
     * @param {string} guild_id - ID of the guild
     * @returns {Promise<Array<string>>} Array of links
     */
    const linksList = await antiSpam.listLinks(message.guild.id);
});
````

## ⏳ TODO

* ✅ Add support of multi-guilds (Use Collection Cache)
* ✅ Add and Test: `Words Filter System` (Can configure the words list to filter) 
* ✅ Add and Test: `Anti Discord Invites Links System`
* ✅ Add and Test: `Anti Links System` (Can configure links to filter)
* Add and Test: `Mass Mentions System`
* Add and Test: `Emojis excessifs System`
* ✅ Bypass Bots for All Systems *(Can be enabled or Disabled)*
* ✅ Complete ⚙️ AntiSpam Client Options
* ✅ Find a method to clear cache for a guild when the cache is too big.
* Add support of error event with errors messages system
* Create docs for the module


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