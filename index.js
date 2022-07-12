const { EventEmitter } = require('events');
const { Client,
    Message,
    GuildMember,
    Snowflake,
    Role,
    Collection,
    MessageEmbed,
    TextChannel,
    PermissionString
} = require('discord.js');
const WordsFilterSystem = require('./lib/words');
const LinksFilterSystem = require('./lib/links');
const SanctionsManager = require('./lib/sanctions');
const LogsManager = require('./lib/logs');

/**
 * @callback IgnoreMemberFunction
 * @param {GuildMember} member The member to check
 * @returns {Promise<boolean>} Whether the member should be ignored
 */

/**
 * @callback IgnoreRoleFunction
 * @param {Collection<Snowflake, Role>} role The role to check
 * @returns {Promise<boolean>} Whether the user should be ignored
 */

/**
 * @callback IgnoreChannelFunction
 * @param {TextChannel} channel The channel to check
 * @returns {Promise<boolean>} Whether the channel should be ignored
 */

/**
 * Emitted when a member gets warned.
 * @event AntiSpamClient#warnAdd
 * @property {GuildMember} member The member that was warned.
 */

/**
 * Emitted when a member gets kicked.
 * @event AntiSpamClient#kickAdd
 * @property {GuildMember} member The member that was kicked.
 */

/**
 * Emitted when a member gets muted.
 * @event AntiSpamClient#muteAdd
 * @property {GuildMember} member The member that was muted.
 */
/**
 * Emitted when a member gets banned.
 * @event AntiSpamClient#banAdd
 * @property {GuildMember} member The member that was banned.
 */

/**
 * Client Instance for AntiSpamn Client
 * @typedef {Client}
 */

/**
 * Object of Links Filter System
 * @typedef LinksFilterObject
 * @property {boolean} globalLinksFilter Whether to filter global links (all links)
 * @property {boolean} discordInviteLinksFilter Whether to filter discord invite links
 * @property {boolean} customLinksFilter Whether to filter custom links per guild
 */

/**
 * Object of Thresholds System
 * @typedef ThresholdsObject
 * @property {number} [warn=4] Amount of messages sent in a row that will cause a warning.
 * @property {number} [mute=5] Amount of messages sent in a row that will cause a mute.
 * @property {number} [kick=6] Amount of messages sent in a row that will cause a kick.
 * @property {number} [ban=8] Amount of messages sent in a row that will cause a ban.
 */

/**
 * Object of MaxDuplicates System
 * @typedef MaxDuplicatesObject
 * @property {number} [warn=4] Amount of duplicate messages that trigger a warning.
 * @property {number} [mute=5] Amount of duplicate messages that trigger a mute.
 * @property {number} [kick=6] Amount of duplicate messages that trigger a kick.
 * @property {number} [ban=8} Amount of duplicate messages that trigger a ban.
 */

/**
 * Object of Message System
 * @typedef MessageObject
 * @property {string|MessageEmbed} [warn='{@user} has been warned for reason: **{reason}**'] Message that will be sent in the channel when someone is warned.
 * @property {string|MessageEmbed} [mute='@{user} has been muted for reason: **{reason}**'] Message that will be sent in the channel when someone is muted.
 * @property {string|MessageEmbed} [kick='**{user_tag}** has been kicked for reason: **{reason}**'] Message that will be sent in the channel when someone is kicked.
 * @property {string|MessageEmbed} [ban='**{user_tag}** has been banned for reason: **{reason}**'] Message that will be sent in the channel when someone is banned.
 */

/**
 * Object of Error Message
 * @typedef ErrorMessageObject
 * @property {boolean} [enabled=true] Whether the bot should send a message in the channel when it doesn't have some required permissions, like it can't kick members.
 * @property {string} [mute='Could not mute **{user_tag}** because of improper permissions.'] Message that will be sent in the channel when the bot doesn't have enough permissions to mute the member (to timeout member).
 * @property {string} [kick='Could not kick **{user_tag}** because of improper permissions.'] Message that will be sent in the channel when the bot doesn't have enough permissions to kick the member.
 * @property {string} [ban='Could not ban **{user_tag}** because of improper permissions.'] Message that will be sent in the channel when the bot doesn't have enough permissions to ban the member.
 */

/**
 * Object of Ignore System
 * @typedef IgnoreSystemObject
 * @property {Snowflake|string[]|IgnoreMemberFunction} [members=[]] Array of member IDs that are ignored.
 * @property {Snowflake|string[]|IgnoreRoleFunction} [roles=[]] Array of role IDs or role names that are ignored. Members with one of these roles will be ignored.
 * @property {Snowflake|string[]|IgnoreChannelFunction} [channels=[]] Array of channel IDs or channel names that are ignored.
 * @property {PermissionString[]} [permissions=[]] Users with at least one of these permissions will be ignored.
 * @property {boolean} [bots=true] Whether bots should be ignored.
 */

/**
 * Object of Enabled System
 * @typedef EnabledSystemObject
 * @property {boolean} [warn=true] Whether to enable warnings.
 * @property {boolean} [mute=true] Whether to enable mutes.
 * @property {boolean} [kick=true] Whether to enable kicks.
 * @property {boolean} [ban=true] Whether to enable bans.
 */

/**
 * Options for the AntiSpam client
 * @typedef AntiSpamClientOptions
 *
 * @property {boolean} [customGuildOptions=false] Whether to use custom guild options
 * @property {boolean} [wordsFilter=false] Whether to use words filter system
 * @property {LinksFilterObject} [linksFilter] Whether to use links filter system
 * @property {ThresholdsObject} [thresholds] Amount of messages sent in a row that will cause a warning / mute / kick / ban.
 *
 * @property {number} [maxInterval=3000] Amount of time (ms) in which messages are considered spam.
 * @property {number} [maxDuplicatesInterval=3000] Amount of time (ms) in which duplicate messages are considered spam.
 *
 * @property {MaxDuplicatesObject} [maxDuplicates] Amount of duplicate messages that trigger a warning / mute / kick / ban.
 *
 * @property {number} [unMuteTime=10] Time in minutes to wait until unmuting a user.
 * @property {string|Snowflake} [modLogsChannel='mod-logs'] ID of the channel in which moderation logs will be sent.
 * @property {boolean} [modLogsEnabled=false] Whether moderation logs are enabled.
 *
 * @property {MessageObject} [message] Message that will be sent in the channel when someone is warned.
 * @property {ErrorMessageObject} [errorMessage] Whether the bot should send a message in the channel when it doesn't have some required permissions, like it can't kick members.
 *
 * @property {IgnoreSystemObject} [ignore] Whether to ignore certain members or channels or permissions or roles or bots.
 *
 * @property {EnabledSystemObject} [enable] Enable / Disable warns / mutes / kicks / bans.
 *
 * @property {number} [deleteMessagesAfterBanForPastDays=1] When a user is banned, their messages sent in the last x days will be deleted.
 * @property {boolean} [verbose=false] Extended logs from module (recommended).
 * @property {boolean} [debug=false] Whether to run the module in debug mode.
 * @property {boolean} [removeMessages=true] Whether to delete user messages after a sanction.
 *
 */

/**
 * Cached message.
 * @typedef CachedMessage
 *
 * @property {Snowflake} messageID The ID of the message.
 * @property {Snowflake} guildID The ID of the guild where the message was sent.
 * @property {Snowflake} authorID The ID of the author of the message.
 * @property {Snowflake} channelID The ID of the channel of the message.
 * @property {string} content The content of the message.
 * @property {number} sentTimestamp The timestamp the message was sent.
 */

/**
 * Cache data for the AntiSpamClient
 * Cache is unique per guild.
 * Use Guild ID as key.
 * @typedef AntiSpamCache
 * @key {Snowflake} guildID The ID of the guild.
 * @property {Snowflake[]} warnedUsers Array of warned users.
 * @property {Snowflake[]} kickedUsers Array of kicked users.
 * @property {Snowflake[]} mutedUsers Array of muted users.
 * @property {Snowflake[]} bannedUsers Array of banned users.
 * @property {CachedMessage[]} messages Array of cached messages, used to detect spam.
 */

// noinspection JSCheckFunctionSignatures
/** Main Class AntiSpam */
class AntiSpamClient extends EventEmitter {
    /**
     * @param {Client} client Discord Client Instance
     * @param {AntiSpamClientOptions} options The options for this AntiSpam client instance
     */
    constructor (client, options) {
        super();

        /**
         * The Client Instance
         * @type {Client}
         */
        this.client = client;

        /**
         * Default value of the options
         * @type {AntiSpamClientOptions}
         * @private
         */
        this._defaultOptions = {
            /** Use customGuildOptions instead of AntiSpam Client Instance Options defaults value */
            customGuildOptions: options.customGuildOptions || false,
            wordsFilter: options.wordsFilter || false,
            linksFilter: {
                globalLinksFilter: options.linksFilter?.globalLinksFilter !== undefined ? options.linksFilter.globalLinksFilter : false,
                customLinksFilter: options.linksFilter?.customLinksFilter !== undefined ? options.linksFilter.customLinksFilter : false,
                discordInviteLinksFilter: options.linksFilter?.discordInviteLinksFilter ? options.linksFilter.discordInviteLinksFilter : false,
            },
            thresholds: {
                warn: options.thresholds?.warn || 4,
                mute: options.thresholds?.mute || 5,
                kick: options.thresholds?.kick || 6,
                ban: options.thresholds?.ban || 8,
            },
            maxInterval: options.maxInterval || 3000,
            maxDuplicatesInterval: options.maxDuplicatesInterval || 3000,
            maxDuplicates: {
                warn: options.maxDuplicates?.warn || 4,
                mute: options.maxDuplicates?.mute || 5,
                kick: options.maxDuplicates?.kick || 6,
                ban: options.maxDuplicates?.ban || 8,
            },
            unMuteTime: options.unMuteTime * 60_000 || 600000,
            modLogsChannel: options.modLogsChannel || 'CHANNEL_ID',
            modLogsEnabled: options.modLogsEnabled || false,
            message: {
                warn: options.message?.warn !== undefined ? options.message?.warn instanceof MessageEmbed ? options.message.warn.toJSON() : options.message.warn : '{@user} has been warned for reason: **{reason}**',
                kick: options.message?.kick !== undefined ? options.message?.kick instanceof MessageEmbed ? options.message.kick.toJSON() : options.message.kick : '**{user_tag}** has been kicked for reason: **{reason}**',
                mute: options.message?.mute !== undefined ? options.message?.mute instanceof MessageEmbed ? options.message.mute.toJSON() : options.message.mute : '@{user} has been muted for reason: **{reason}**',
                ban: options.message?.ban !== undefined ? options.message?.ban instanceof MessageEmbed ? options.message.ban.toJSON() : options.message.ban : '**{user_tag}** has been banned for reason: **{reason}**',
            },
            errorMessage: {
                enabled: options.errorMessage?.enabled !== undefined ? options.errorMessage.enabled : true,
                mute: options.errorMessage?.mute || 'Could not mute **{user_tag}** because of improper permissions.',
                kick: options.errorMessage?.kick || 'Could not kick **{user_tag}** because of improper permissions.',
                ban: options.errorMessage?.ban || 'Could not ban **{user_tag}** because of improper permissions.',
            },
            ignore: {
                members: options.ignore?.members || [],
                channels: options.ignore?.channels || [],
                permissions: options.ignore?.permissions || [],
                roles: options.ignore?.roles || [],
                bots: options.ignore?.bots !== undefined ? options.ignore.bots : true,
            },
            enable: {
                warn: options.enable?.warn !== undefined ? options.enable.warn : true,
                mute: options.enable?.mute !== undefined ? options.enable.mute : true,
                kick: options.enable?.kick !== undefined ? options.enable.kick : true,
                ban: options.enable?.ban !== undefined ? options.enable.ban : true,
            },
            deleteMessagesAfterBanForPastDays: options.deleteMessagesAfterBanForPastDays || 1,
            verbose: options.verbose || false,
            debug: options.debug || false,
            removeMessages: options.removeMessages !== undefined ? options.removeMessages : true,
        };

        /**
         * The options for this AntiSpam client instance
         * @type {AntiSpamClientOptions}
         */
        this.options = options.customGuildOptions ? undefined : this._defaultOptions;

        /**
         * Logs Manager
         * @type {LogsManager}
         */
        this.logs = new LogsManager(this);

        /**
         * The cache for this AntiSpam client instance
         * @type {Collection<Snowflake, AntiSpamCache>}
         * // Structure:
         * guild_ID: {
            messages: [],
            warnedUsers: [],
            kickedUsers: [],
            bannedUsers: []
            }
         */
        this.cache = new Collection();

        /**
         * Guilds Cache for this AntiSpam client instance
         * @type {Collection<Snowflake, AntiSpamClientOptions>}
         */
        this.guildOptions = new Collection();

        /**
         * Words Filter System
         * @type {WordsFilterSystem}
         */
        this.anti_words = new WordsFilterSystem();

        /**
         * Links Filer System
         * @type {LinksFilterSystem}
         */
        this.anti_links = new LinksFilterSystem();

        /**
         * Sanctions Manager
         * @type {SanctionsManager}
         */
        this.sanctions = new SanctionsManager(this);
    }

    /**
     * Get cache for a guild
     * @param {string} guildID Guild ID
     * @returns {AntiSpamCache}
     */
    async getCache (guildID) {
        if (!this.cache.has(guildID)) {
            this.cache.set(guildID, {
                messages: [],
                warnedUsers: [],
                kickedUsers: [],
                bannedUsers: []
            });
        }
        return this.cache.get(guildID);
    }

    /**
     * Get guild Options for a guild
     * @param {string} guildID Guild ID
     * @returns {AntiSpamClientOptions}
     */
    async getGuildOptions (guildID) {
        return this.guildOptions.get(guildID);
    }

    /**
     *
     * @param {string} guildID Guild ID
     * @param {AntiSpamClientOptions} options The options for the guild
     * @returns {AntiSpamClientOptions}
     */
    async setGuildOptions (guildID, options) {
        this.guildOptions.set(guildID, options);
        return this.guildOptions.get(guildID);
    }

    /**
     * Delete spam messages
     * @ignore
     * @param {CachedMessage[]} messages The messages to delete
     * @param {AntiSpamClientOptions} options options of the guild or AntiSpam Instance
     * @returns {Promise<void>}
     */
    async clearSpamMessages (messages, options) {
        try {
            let _messages = [];
            let _channel;
            await Promise.all(messages.map(async (message) => {
                const channel = await this.client.channels.cache.get(message.channelID)
                if (channel) {
                    const msg = await channel.messages.cache.get(message.messageID);
                    if (msg && msg.deletable) _messages.push(msg);
                    _channel = channel;
                }
            }));
            await _channel.bulkDelete(_messages).catch(err => {
                if (err && options.debug === true) return this.logs.logsError('Discord AntiSpam (clearSpamMessages#failed): The message(s) couldn\'t be deleted', options);
            });
        } catch (e) {
            if (options.debug) {
                await this.logs.logsError('Discord AntiSpam (clearSpamMessages#failed): The message(s) couldn\'t be deleted!', options);
            }
        }
    }

    /**
     * Check All Ignores functions / parameters before run the message functions
     * If false : can't run / If true : can run
     * @param {Message} message Message Instance
     * @param {AntiSpamClientOptions} options Options
     * @returns {Promise<boolean>}
     */
    async canRun (message, options) {
        if (!message.guild || message.author.id === this.client.user.id
            || (message.guild.ownerId === message.author.id && !options.debug)
            || (options.ignore.bots && message.author.bot)) return false;

        const isMemberIgnored = typeof options.ignore.members === 'function' ? await options.ignore.members(message.member) : options.ignore.members.includes(message.author.id)
        if (isMemberIgnored) return false;

        const isChannelIgnored = typeof options.ignore.channels === 'function' ? await options.ignore.channels(message.channel) : options.ignore.channels.includes(message.channel.id)
        if (isChannelIgnored) return false;

        const member = message.member || await message.guild.members.cache.get(message.author.id);

        const memberHasIgnoredRoles = typeof options.ignore.roles === 'function' ? await options.ignore.roles(member.roles.cache) : options.ignore.roles.some((r) => member.roles.cache.has(r))
        if (memberHasIgnoredRoles) return false;

        return !options.ignore.permissions.some((permission) => member.permissions.has(permission));
    }

    /**
     * Checks a message.
     * @param {Message} message The message to check.
     * @returns {Promise<boolean>} Whether the message has triggered a threshold.
     * @example
     * client.on('message', (msg) => {
     * 	antiSpam.message(msg);
     * });
     */
    async message (message) {
        // Guild Options is priority
        const options = await this.getGuildOptions(message.guild.id) || this.options;
        if (!options) return this.logs.logsError('Discord AntiSpam (message#failed): No options found!', options);

        const can = await this.canRun(message, options);
        if (!can) return false;

        const currentMessage = {
            messageID: message.id,
            guildID: message.guild.id,
            authorID: message.author.id,
            channelID: message.channel.id,
            content: message.content,
            sentTimestamp: message.createdTimestamp
        }
        const cache = await this.getCache(message.guild.id);
        cache.messages.push(currentMessage);

        const cachedMessages = cache.messages.filter((m) => m.authorID === message.author.id && m.guildID === message.guild.id);
        const duplicateMatches = cachedMessages.filter((m) => m.content === message.content && (m.sentTimestamp > (currentMessage.sentTimestamp - options.maxDuplicatesInterval)));


        /**
         * Duplicate messages sent before the threshold is triggered
         * @type {CachedMessage[]}
         */
        const spamOtherDuplicates = []
        if (duplicateMatches.length > 0) {
            let rowBroken = false
            cachedMessages.sort((a, b) => b.sentTimestamp - a.sentTimestamp).forEach(element => {
                if (rowBroken) return;
                if (element.content !== duplicateMatches[0].content) rowBroken = true;
                else spamOtherDuplicates.push(element);
            })
        }

        const spamMatches = cachedMessages.filter((m) => m.sentTimestamp > (Date.now() - options.maxInterval));
        let sanctioned = false;

        /** BAN SANCTION */
        const userCanBeBanned = options.enable.ban && !cache.bannedUsers.includes(message.author.id) && !sanctioned;
        if (userCanBeBanned && (spamMatches.length >= options.thresholds.ban)) {
            this.emit('spamThresholdBan', message.member, false);
            await this.sanctions.appliedSanction('ban', message, spamMatches, options);
            this.emit('banAdd', message.member);
            sanctioned = true;
        } else if (userCanBeBanned && (duplicateMatches.length >= options.maxDuplicates.ban)) {
            this.emit('spamThresholdBan', message.member, false);
            await this.sanctions.appliedSanction('ban', message, [...duplicateMatches, ...spamOtherDuplicates], options);
            this.emit('banAdd', message.member);
            sanctioned = true;
        }

        /** KICK SANCTION */
        if (sanctioned) return sanctioned;
        const userCanBeKicked = options.enable.kick && !cache.kickedUsers.includes(message.author.id) && !sanctioned;
        if (userCanBeKicked && (spamMatches.length >= options.thresholds.kick)) {
            this.emit('spamThresholdKick', message.member, false);
            await this.sanctions.appliedSanction('kick', message, spamMatches, options);
            this.emit('kickAdd', message.member);
            sanctioned = true;
        } else if (userCanBeKicked && (duplicateMatches.length >= options.maxDuplicates.kick)) {
            this.emit('spamThresholdKick', message.member, true);
            await this.sanctions.appliedSanction('kick', message, [...duplicateMatches, ...spamOtherDuplicates], options);
            this.emit('kickAdd', message.member);
            sanctioned = true;
        }

        /** MUTE SANCTION */
        if (sanctioned) return sanctioned;
        const userCanBeMuted = options.enable.mute && !sanctioned;
        if (userCanBeMuted && (spamMatches.length >= options.thresholds.mute)) {
            this.emit('spamThresholdMute', message.member, false);
            await this.sanctions.appliedSanction('mute', message, spamMatches, options);
            this.emit('muteAdd', message.member);
            sanctioned = true;
        } else if (userCanBeMuted && (duplicateMatches.length >= options.maxDuplicates.mute)) {
            this.emit('spamThresholdMute', message.member, true);
            await this.sanctions.appliedSanction('mute', message, [...duplicateMatches, ...spamOtherDuplicates], options);
            this.emit('muteAdd', message.member);
            sanctioned = true;
        }

        /** WARN SANCTION */
        if (sanctioned) return sanctioned;
        const userCanBeWarned = options.enable.warn && !cache.warnedUsers.includes(message.author.id) && !sanctioned;
        if (userCanBeWarned && (spamMatches.length >= options.thresholds.warn)) {
            this.emit('spamThresholdWarn', message.member, false);
            await this.sanctions.appliedSanction('warn', message, spamMatches, options);
            this.emit('warnAdd', message.member);
            sanctioned = true;
        } else if (userCanBeWarned && (duplicateMatches.length >= options.maxDuplicates.warn)) {
            this.emit('spamThresholdWarn', message.member, true);
            await this.sanctions.appliedSanction('warn', message, [...duplicateMatches, ...spamOtherDuplicates], options);
            this.emit('warnAdd', message.member);
            sanctioned = true;
        }

        return sanctioned;
    }

    /**
     *
     * @param {Message} message Message to Object
     * @returns {Promise<boolean|void>}
     */
    async messageWordsFilter(message) {
        const options = await this.getGuildOptions(message.guild.id) || this.options;
        if (!options) return this.logs.logsError('Discord AntiSpam (message#failed): No options found!', options);

        const can = await this.canRun(message, options);
        if (!can) return false;

        /** Check if message contain bad words */
        if (await this.anti_words.checkWord(message.cleanContent, message.guild.id)) return true;
    }

    /**
     *
     * @param {Message} message Message to Object
     * @returns {Promise<boolean>}
     */
    async messageLinksFilter(message) {
        const options = await this.getGuildOptions(message.guild.id) || this.options;
        if (!options) return this.logs.logsError('Discord AntiSpam (message#failed): No options found!', options);

        if (!options.linksFilter.globalLinksFilter && !options.linksFilter.discordInviteLinksFilter && !options.linksFilter.customLinksFilter) return false;

        const can = await this.canRun(message, options);
        if (!can) return false;

        let contain_links = false;
        /** Global filter override */
        if (options.linksFilter.globalLinksFilter) return this.anti_links.hasGlobalLink(message);
        if (options.linksFilter.discordInviteLinksFilter) contain_links = await this.anti_links.hasDiscordInviteLink(message);
        if (options.linksFilter.customLinksFilter) contain_links = await this.anti_links.hasCustomLinks(message, message.guild.id);
        return contain_links;
    }

    /**
     *
     * @param {Message} message Message to check
     * @returns {Promise<Array.string>}
     */
    async messageBadWordsUsages(message) {
        const options = await this.getGuildOptions(message.guild.id) || this.options;
        if (!message) return this.logs.logsError('Discord AntiSpam (messageBadWordsUsages#failed): No message found!', options);
        return this.anti_words.checkBadWordsUsages(message.cleanContent, message.guild.id);
    }

    /**
     * Add a word or words to custom list of words for a guild
     * If function return false, the word(s) is/are already in the list
     * @param {string|Array<string>} words Word(s) to add
     * @param {string} guildId Guild ID
     * @returns {Promise<boolean>}
     */
    async addWords(words, guildId) {
        const options = await this.getGuildOptions(guildId) || this.options;
        if (!words || !guildId) return this.logs.logsError('Discord AntiSpam (addWords#failed): No words or Guild ID given !', options);
        return this.anti_words.addWords(words, guildId);
    }

    /**
     * Add a link or links to custom list of links for a guild
     * If function return false, the word(s) is/are already in the list
     * @param {string|Array<string>} links Link(s) to add
     * @param {string} guildId Guild ID
     * @returns {Promise<boolean>}
     */
    async addLinks(links, guildId) {
        const options = await this.getGuildOptions(guildId) || this.options;
        if (!links || !guildId) return this.logs.logsError('Discord AntiSpam (addLinks#failed): No links or Guild ID given !', options);
        return this.anti_links.addLinks(links, guildId);
    }

    /**
     * Remove a word or words from custom list of words for a guild
     * @param {string|Array<string>} words Word to remove
     * @param {string} guildId Guild ID
     * @returns {Promise<boolean>}
     */
    async removeWords(words, guildId) {
        const options = await this.getGuildOptions(guildId) || this.options;
        if (!words || !guildId) return this.logs.logsError('Discord AntiSpam (removeWords#failed): No words or Guild ID given !', options);
        return this.anti_words.removeWords(words, guildId);
    }

    /**
     *
     * @param {string|Array<string>} links Links to remove
     * @param {string} guildId Guild ID
     * @returns {Promise<boolean>}
     */
    async removeLinks(links, guildId) {
        const options = await this.getGuildOptions(guildId) || this.options;
        if (!links || !guildId) return this.logs.logsError('Discord AntiSpam (removeLinks#failed): No links or Guild ID given !', options);
        return this.anti_links.removeLinks(links, guildId);
    }

    /**
     * Checks if the user left the server to remove him from the cache!
     * @param {GuildMember} member The member to remove from the cache.
     * @returns {Promise<boolean>} Whether the member has been removed
     * @example
     * client.on('guildMemberRemove', (member) => {
     * 	antiSpam.userleave(member);
     * });
     */
    async userLeave (member) {
        const cache = await this.getCache(member.guild.id);
        cache.bannedUsers = cache.bannedUsers.filter((u) => u !== member.user.id);
        cache.kickedUsers = cache.kickedUsers.filter((u) => u !== member.user.id);
        cache.warnedUsers = cache.warnedUsers.filter((u) => u !== member.user.id);
        /** Optimize cache */
        if (cache.messages.length >= 9999) {
            cache.messages = [];
        }
        await this.cache.set(member.guild.id, cache);
        return true;
    }

    /**
     * Reset the cache of this AntiSpam client instance.
     */
    async resetGuild (guildID) {
        let cache = {
            messages: [],
            warnedUsers: [],
            kickedUsers: [],
            bannedUsers: []
        }
        await this.cache.set(guildID, cache);
    }

    /**
     * Reset the cache of this AntiSpam client instance.
     * @returns {Promise<void>}
     */
    async resetAllCache () {
        this.cache = new Collection();
        return this.cache;
    }
}

module.exports = AntiSpamClient;