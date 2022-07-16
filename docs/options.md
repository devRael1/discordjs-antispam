# ⚙️ AntiSpam Client Options

Here are all the options of the module. Take the time to read all the options to understand how the module works.

**Don't hesitate to go and see the [examples](declare-and-use-module.md).**

| Options Name | Default Value | Description |
| :--- | :---: | :--- |
| `customGuildOptions` | `false` | Whether to use custom guild options |
| `unMuteTime` | `10` | Time in minutes to wait until unmuting a user. |
| `modLogsEnabled` | `false` | Whether moderation logs are enabled. |
| `modLogsChannel` | `CHANNEL_ID` | ID of the channel in which moderation logs will be sent. |
| `deleteMessagesAfterBanForPastDays` | `1` | When a user is banned, their messages sent in the last x days will be deleted. |
| `verbose` | `false` | Extended logs from module (recommended). |
| `debug` | `false` | Whether to run the module in debug mode. |
| `removeMessages` | `true` | Whether to delete user messages after a sanction. |

| Options Object Name | Default Value | Description |
| :--- | :---: | :--- |
| `wordsFilter` | `object` | Words Filter System |
| `wordsFilter.enabled` | `false` | Whether to use links filter system |
| `wordsFilter.typeSanction` | `warn` | The type of sanction to apply when a member trigger the words filter system |

| Options Object Name | Default Value | Description |
| :--- | :---: | :--- |
| `linksFilter` | `object` | Links Filter System |
| `linksFilter.enabled` | `false` | Whether to use links filter system |
| `linksFilter.globalLinksFilter` | `false` | Whether to filter global links (all links) |
| `linksFilter.discordInviteLinksFilter` | `false` | Whether to filter discord invite links |
| `linksFilter.customLinksFilter` | `false` | Whether to filter custom links per guild |
| `linksFilter.typeSanction` | `warn` | The type of sanction to apply when a member trigger the links filter system |

| Options Object Name | Default Value | Description |
| :--- | :---: | :--- |
| `antispamFilter` | `object` | Anti Spam Filter System |
| `enabled` | `true` | Enable / Disable antispam filter system |
| `thresholds` | `object` | Thresholds Object **(See below for Options Object)** |
| `maxDuplicates` | `object` | MaxDuplicates Object **(See below for Options Object)** |
| `maxInterval` | `3000` | Amount of time (ms) in which messages are considered spam. |
| `maxDuplicatesInterval` | `3000` | Amount of time (ms) in which duplicate messages are considered spam. |

| Options Object Name | Default Value | Description |
| :--- | :---: | :--- |
| `mentionsFilter` | `object` | Mentions Filter System |
| `mentionsFilter.enabled` | `false` | Enable / Disable mass mentions filter system |
| `mentionsFilter.maxMentions` | `5` | Max mentions allowed per message |
| `mentionsFilter.typeSanction` | `warn` | The type of sanction to apply when a member trigger the Mentions Filter System |

| Options Object Name | Default Value | Description |
| :--- | :---: | :--- |
| `emojisFilter` | `object` | Emojis Filter System |
| `emojisFilter.enabled` | `false` | Enable / Disable mass emojis filter system |
| `emojisFilter.maxEmojis` | `7` | Max emojis allowed per message |
| `emojisFilter.typeSanction` | `warn` | The type of sanction to apply when a member trigger the Emojis Filter System |

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
| `message.logs` | `'{@user} '({user_id})' has been **${action}** for **${reason}** !'` | Message logs system (with modLogs Channel & Enabled) |


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