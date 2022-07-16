### Basic AntiSpam Client with Options
```js
/** See all options above */
const AntiSpam = require("@devraelfreeze/discordjs-antispam");
const antiSpam = new AntiSpam(client, {
    wordsFilter: {
        enabled: false,
        typeSanction: 'warn', // warn or mute or ban or kick
    },
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
    emojisFilter: {
        enabled: false,
        maxEmojis: 7,
        typeSanction: 'warn'
    },
    unMuteTime: 10,
    deleteMessagesAfterBanForPastDays: 1,
    verbose: true,
    debug: false,
    removeMessages: true
});
```

