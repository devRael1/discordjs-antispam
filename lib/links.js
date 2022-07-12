const { Collection, Message } = require('discord.js');
const discordInviteRegex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/gm;
const globalLinkRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gm;

/** Links Filter System Class */
class LinksFilterSystem {
    constructor() {
        /**
         * Collection of custom links per guild
         * @private
         * @type {Collection<string, Array>}
         */
        this.links = new Collection();
    }

    /**
     *
     * @param {string} guild_id The ID of the guild
     * @returns {Promise<Array<string>>}
     */
    async getLinksCache (guild_id) {
        if (!this.links.has(guild_id)) {
            this.links.set(guild_id, []);
        }
        return this.links.get(guild_id);
    }

    /**
     *
     * @param {string} str - String to check
     * @returns {Promise<string>}
     */
    async sanitize (str) {
        str = str.toLowerCase();
        str = str.replace(/\s/gm, '');
        return str;
    }

    /**
     * If message contain discord invite link, return true
     * @param {Message} message
     * @returns {Promise<boolean>}
     */
    async hasDiscordInviteLink (message) {
        const str = await this.sanitize(message.cleanContent);
        return discordInviteRegex.test(str);
    }

    /**
     * If message contain a link, return true
     * @param {Message} message
     * @returns {Promise<boolean>}
     */
    async hasGlobalLink (message) {
        const str = await this.sanitize(message.cleanContent);
        return globalLinkRegex.test(str);
    }

    /**
     *
     * @param {string} str - String to check
     * @param {string} guild_id - ID of the guild
     * @returns {Promise<boolean>}
     */
    async hasCustomLinks (str, guild_id) {
        if (!str) return false;

        let i = 0;
        let isFound = false;

        str = await this.sanitize(str);

        const links = await this.getLinksCache(guild_id);
        let strs = str.match(globalLinkRegex) || [];
        while (!isFound && i <= links.length - 1) {
            if (strs.includes(links[i])) isFound = true;
            i++;
        }
        return isFound;
    }

    /**
     * Add link / links to the links collection for a guild
     * @param {string|Array<string>} links - Links to add
     * @param {string} guild_id - ID of the guild
     * @returns {Promise<boolean>}
     */
    async addLinks (links, guild_id) {
        let guild_links = await this.getLinksCache(guild_id);

        const add = (link) => {
            if (!link.test(globalLinkRegex)) return false;
            if (guild_links.indexOf(link) === -1) {
                guild_links.push(link);
                return true;
            } else return false;
        }

        if (typeof links === 'string') {
            const added = add(links);
            if (!added) return false;
        } else if (links.constructor === Array) {
            guild_links = [...guild_links, ...links];
        }
        await this.links.set(guild_id, guild_links);
        return true;
    }

    /**
     * Remove link / links from the links collection for a guild
     * @param {string|Array<string>} links - Links to remove
     * @param {string} guild_id - ID of the guild
     * @returns {Promise<boolean>}
     */
    async removeLinks (links, guild_id) {
        let guild_links = await this.getLinksCache(guild_id);

        const remove = (word) => {
            const index = guild_links.indexOf(word);
            if (index !== -1) {
                guild_links.splice(index, 1);
                return true;
            } else return false;
        }

        if (typeof links === 'string') {
            const removed = remove(links);
            if (!removed) return false;
        } else if (links.constructor === Array) {
            links.forEach((link) => {
                remove(link);
            });
        }
        await this.links.set(guild_id, guild_links);
        return true;
    }

    /**
     * List all links for a guild
     * @param {string} guild_id
     * @returns {Promise<Array<string>>}
     */
    async listLinks(guild_id) {
        return this.getLinksCache(guild_id);
    }
}

module.exports = LinksFilterSystem;