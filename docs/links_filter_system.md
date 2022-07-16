# Use Links / Discord Invite Filter System (Functions)
```js
/** Declare & Use module with 'messageCreate' event */
client.on("messageCreate", async (message) => {
    const contain_links = await antiSpam.messageLinksFilter(message);
    if (contain_links) {
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
    const addLink = await antiSpam.addLinks(['https://discord.gg/123456789'], message.guild.id);
    /**
     * Remove link / links for a guild
     * @param {string|Array<string>} links - Links to remove
     * @param {string} guild_id - ID of the guild
     * @returns {Promise<boolean>} true if removed or false if not removed.
     */
    const removeLink = await antiSpam.removeLinks(['https://discord.gg/123456789'], message.guild.id);
    /**
     * Get links list for a guild.
     * @param {string} guild_id - ID of the guild
     * @returns {Promise<Array<string>>} Array of links
     */
    const linksList = await antiSpam.listLinks(message.guild.id);
});
```