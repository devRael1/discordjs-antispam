# Use Words Filter System (Functions)
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
```