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
### ⚠️ This package support multi-guilds !

## 📥 Installation

To install this module type the following command in your console:
```
npm i @devraelfreeze/discordjs-antispam
```

## ⚙️ AntiSpam Client Options
// TODO


## ⬇️ Examples

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
client.on("ready", () => console.log(`Logged in as ${client.user.tag}.`));
client.on("messageCreate", async (message) => {
    /** Custom guild options in Object */
    const guildOptions = {/** Options of AntiSpam */};
    await antiSpam.message(message, guildOptions);
});
/** Login the bot */
client.login("VERY SECRET TOKEN HERE :)");
```
---
### Example: Use Words Filter System (Functions)
```js
/** Declare & Use module with messageCreate event 
 [See above for many examples] */

````
---
### Example: Use Links / Discord Invite Filter System (Functions)
```js
/** Declare & Use module with messageCreate event 
 [See above for many examples] */

````

## ⏳ TODO

* ✅ Add and Test: `Words Filter System` (Can configure the words list to filter) 
* Add and Test: `Discord Anti Links System`
* Add and Test: `Anti Links System` (Can configure links to filter)
* Add and Test: `Mass Mentions System`
* Add and Test: `Emojis excessifs System`
* ✅ Bypass Bots for All Systems *(Can be enabled or Disabled)*
* Finish the Example for README.md
* Take screenshots of the module and add them to the README.md
* Complete ⚙️ AntiSpam Client Options
* ✅ Find a method to clear cache for a guild when the cache is too big.
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