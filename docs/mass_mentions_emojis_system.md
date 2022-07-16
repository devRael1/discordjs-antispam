# Use Mass Mentions & Mass Emojis Filter System (Functions)
```js
/** Declare & Use module with 'messageCreate' event */
client.on("messageCreate", async (message) => {
    const mass_mentions = await antiSpam.messageMentionsFilter(message);
    if (mass_mentions) {
        /** Message contain too much mentions */
    } else {
        /** Message isn't mass mentions */
    }
    const mass_emojis = await antiSpam.messageEmojisFilter(message);
    if (mass_emojis) {
        /** Message contain too much emojis */
    } else {
        /** Message isn't mass emojis */
    }
});
```