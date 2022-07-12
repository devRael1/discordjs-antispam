const {
    Collection
} = require('discord.js');
const wordsFilter = require('leo-profanity');

/** Words Filter System Class */
class WordsFilterSystem {
    constructor() {
        /**
         * Collection of words per guild
         * @private
         * @type {Collection<string, Array>}
         */
        this._words = new Collection();
    }

    /**
     *
     * @param {string} guild_id The ID of the guild
     * @returns {Promise<Array<string>>}
     */
    async getWordsCache (guild_id) {
        if (!this._words.has(guild_id)) {
            /** Load all Defaults Words */
            wordsFilter.loadDictionary();
            let words = [...wordsFilter.getDictionary('fr')];
            wordsFilter.add(words);
            let guild_words = wordsFilter.list();
            this._words.set(guild_id, guild_words);
        }
        return this._words.get(guild_id);
    }

    /**
     *
     * @param {string} str - String to check
     * @returns {Promise<string>}
     */
    async sanitize (str) {
        str = str.toLowerCase();
        str = str.replace(/[.,]/g, ' ');
        return str;
    }

    /**
     * Add a word for a guild in the this._words collection
     * @param {string|Array<string>} words - Words to add
     * @param {string} guild_id - ID of the guild
     * @returns {Promise<boolean>}
     */
    async addWords (words, guild_id) {
        let guild_words = await this.getWordsCache(guild_id);

        const add = (word) => {
            if (guild_words.indexOf(word) === -1) {
                guild_words.push(word);
                return true;
            } else return false;
        }

        if (typeof words === 'string') {
            const added = add(words);
            if (!added) return false;
        } else if (words.constructor === Array) {
            guild_words = [...guild_words, ...words];
        }
        await this._words.set(guild_id, guild_words);
        return true;
    }

    /**
     * Remove a word for a guild in the this._words collection
     * @param {string|Array<string>} words - Words to remove
     * @param {string} guild_id - ID of the guild
     * @returns {Promise<boolean>}
     */
    async removeWords (words, guild_id) {
        const guild_words = await this.getWordsCache(guild_id);

        const remove = (word) => {
            if (guild_words.indexOf(word) !== -1) {
                guild_words.splice(guild_words.indexOf(word), 1);
                return true;
            } else return false;
        }

        if (typeof words === 'string') {
            const removed = remove(words);
            if (!removed) return false;
        } else if (words.constructor === Array) {
            words.forEach((word) => {
                remove(word);
            });
        }
        await this._words.set(guild_id, guild_words);
        return true;
    }

    /**
     * Return all words configured for a guild
     * @param {string} guild_id - ID of the guild
     * @returns {Promise<Array<string>>}
     */
    async listWords (guild_id) {
        return this.getWordsCache(guild_id);
    }

    /**
     *
     * @param {string} str - String to check
     * @param {string} guild_id - ID of the guild
     * @returns {Promise<boolean>}
     */
    async checkWord (str, guild_id) {
        if (!str) return false;

        let i = 0;
        let isFound = false;

        str = await this.sanitize(str);
        // convert into array and remove white space
        // add default returned value for some cases (e.g. "." will returns null)
        const words = await this.getWordsCache(guild_id);
        let strs = str.match(/[^ ]+/g) || [];
        while (!isFound && i <= words.length - 1) {
            if (strs.includes(words[i])) isFound = true;
            i++;
        }
        return isFound;
    }

    /**
     *
     * @param {string} str - String to check
     * @param {string} guild_id - ID of the guild
     * @returns {Promise<Array.string>}
     */
    async checkBadWordsUsages (str, guild_id) {
        const getReplacementWord = (key, n) => {
            let i;
            let replacementWord = '';

            for (i = 0; i < n; i++) {
                replacementWord += key;
            }
            return replacementWord;
        }

        const proceed = async (str, replaceKey, nbLetters) => {
            let words = await this.getWordsCache(guild_id);
            if (words.length === 0) return [];
            if (!str) return '';
            if (typeof replaceKey === 'undefined') replaceKey = '*';
            if (typeof nbLetters === 'undefined') nbLetters = 0;

            let originalString = str;
            let result = str;

            let sanitizedStr = await this.sanitize(originalString);
            // split by whitespace (keep delimiter)
            // (cause comma and dot already replaced by whitespace)
            let sanitizedArr = sanitizedStr.split(/(\s)/);
            // split by whitespace, comma and dot (keep delimiter)
            let resultArr = result.split(/(\s|,|\.)/);

            // loop through given string
            let badWords = [];
            sanitizedArr.forEach(function (item, index) {
                if (words.includes(item)) {
                    let replacementWord = item.slice(0, nbLetters) + getReplacementWord(replaceKey, item.length - nbLetters);
                    badWords.push(resultArr[index]);
                    resultArr[index] = replacementWord;
                }
            });

            // combine it
            result = resultArr.join('');
            return [result, badWords];
        }
        const t = await proceed(str, '*');
        return t[1];
    }
}

module.exports = WordsFilterSystem;