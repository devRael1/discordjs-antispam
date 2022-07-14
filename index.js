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
 * @property {string} reason The reason for the warning.
 */

/**
 * Emitted when a member gets kicked.
 * @event AntiSpamClient#kickAdd
 * @property {GuildMember} member The member that was kicked.
 * @property {string} reason The reason for the kick.
 */

/**
 * Emitted when a member gets muted.
 * @event AntiSpamClient#muteAdd
 * @property {GuildMember} member The member that was muted.
 * @property {string} reason The reason for the mute.
 */
/**
 * Emitted when a member gets banned.
 * @event AntiSpamClient#banAdd
 * @property {GuildMember} member The member that was banned.
 * @property {string} reason The reason for the ban.
 */

/**
 * Type of Sanction to applied
 * @typedef TypeSanctions
 * @property {string} ban Ban
 * @property {string} kick Kick
 * @property {string} warn Warn
 * @property {string} mute Mute
 */

/**
 * Client Instance for AntiSpamn Client
 * @typedef {Client}
 */

/**
 * Object of Words Filter System
 * @typedef WordsFilterObject
 * @property {boolean} enabled Whether the words filter is enabled
 * @property {TypeSanctions} typeSanction The type of sanction to apply when a member trigger the words filter system
 */

/**
 * Object of Links Filter System
 * @typedef LinksFilterObject
 * @property {boolean} enabled Whether the links filter is enabled
 * @property {boolean} globalLinksFilter Whether to filter global links (all links)
 * @property {boolean} discordInviteLinksFilter Whether to filter discord invite links
 * @property {boolean} customLinksFilter Whether to filter custom links per guild
 * @property {TypeSanctions} typeSanction The type of sanction to apply when a member trigger the links filter system
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
 * Antispam Filter System
 * @typedef AntispamFilterObject
 * @property {boolean} enabled Whether the Antispam filter is enabled
 * @property {ThresholdsObject} [thresholds] Amount of messages sent in a row that will cause a warning / mute / kick / ban.
 * @property {number} [maxInterval=3000] Amount of time (ms) in which messages are considered spam.
 * @property {number} [maxDuplicatesInterval=3000] Amount of time (ms) in which duplicate messages are considered spam.
 * @property {MaxDuplicatesObject} [maxDuplicates] Amount of duplicate messages that trigger a warning / mute / kick / ban.
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
 * @property {string|MessageEmbed} [mute='Could not mute @{user} because of improper permissions.'] Message that will be sent in the channel when the bot doesn't have enough permissions to mute the member (to timeout member).
 * @property {string|MessageEmbed} [kick='Could not kick @{user} because of improper permissions.'] Message that will be sent in the channel when the bot doesn't have enough permissions to kick the member.
 * @property {string|MessageEmbed} [ban='Could not ban @{user} because of improper permissions.'] Message that will be sent in the channel when the bot doesn't have enough permissions to ban the member.
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
 * @property {WordsFilterObject} [wordsFilter] Whether to use words filter system
 * @property {LinksFilterObject} [linksFilter] Whether to use links filter system
 * @property {antispamFilter} [antispamFilter] Whether to use antispam filter system.
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
         * Type of Sanctions to be used
         * @type {{warn: string, kick: string, mute: string, ban: string}}
         */
        this.types_sanction = {
            warn: 'warn',
            mute: 'mute',
            kick: 'kick',
            ban: 'ban',
        };

        /**
         * Default values of the options for AntiSpam Client
         * @type {AntiSpamClientOptions}
         * @private
         */
        this._defaultOptions = {
            customGuildOptions: options.customGuildOptions || false,
            wordsFilter: {
                enabled: options.wordsFilter?.enabled !== undefined ? options.wordsFilter.enabled : false,
                typeSanction: options.wordsFilter?.typeSanction || this.types_sanction.warn,
            },
            linksFilter: {
                enabled: options.linksFilter?.enabled !== undefined ? options.linksFilter.enabled : false,
                globalLinksFilter: options.linksFilter?.globalLinksFilter !== undefined ? options.linksFilter.globalLinksFilter : false,
                customLinksFilter: options.linksFilter?.customLinksFilter !== undefined ? options.linksFilter.customLinksFilter : false,
                discordInviteLinksFilter: options.linksFilter?.discordInviteLinksFilter ? options.linksFilter.discordInviteLinksFilter : false,
                typeSanction: options.linksFilter?.typeSanction || this.types_sanction.warn,
            },
            antispamFilter: {
                enabled: options.antispamFilter?.enabled !== undefined ? options.antispamFilter?.enabled : true,
                thresholds: {
                    warn: options.antispamFilter?.thresholds?.warn || 4,
                    mute: options.antispamFilter?.thresholds?.mute || 5,
                    kick: options.antispamFilter?.thresholds?.kick || 6,
                    ban: options.antispamFilter?.thresholds?.ban || 8,
                },
                maxInterval: options.antispamFilter?.maxInterval || 3000,
                maxDuplicatesInterval: options.antispamFilter?.maxDuplicatesInterval || 3000,
                maxDuplicates: {
                    warn: options.antispamFilter?.maxDuplicates?.warn || 4,
                    mute: options.antispamFilter?.maxDuplicates?.mute || 5,
                    kick: options.antispamFilter?.maxDuplicates?.kick || 6,
                    ban: options.antispamFilter?.maxDuplicates?.ban || 8,
                },
            },
            unMuteTime: options.unMuteTime * 60_000 || 600000,
            modLogsChannel: options.modLogsChannel || 'CHANNEL_ID',
            modLogsEnabled: options.modLogsEnabled || false,
            message: {
                warn: options.message?.warn !== undefined ? options.message?.warn instanceof MessageEmbed ? options.message.warn.toJSON() : options.message.warn : '{@user} has been warned for reason: **{reason}**',
                mute: options.message?.mute !== undefined ? options.message?.mute instanceof MessageEmbed ? options.message.mute.toJSON() : options.message.mute : '@{user} has been muted for reason: **{reason}**',
                kick: options.message?.kick !== undefined ? options.message?.kick instanceof MessageEmbed ? options.message.kick.toJSON() : options.message.kick : '**{user_tag}** has been kicked for reason: **{reason}**',
                ban: options.message?.ban !== undefined ? options.message?.ban instanceof MessageEmbed ? options.message.ban.toJSON() : options.message.ban : '**{user_tag}** has been banned for reason: **{reason}**',
                logs: options.message?.logs !== undefined ? options.message?.logs instanceof MessageEmbed ? options.message.logs.toJSON() : options.message.logs : '{@user} `({user_id})` has been **{action}** for **{reason}** !',
            },
            errorMessage: {
                enabled: options.errorMessage?.enabled !== undefined ? options.errorMessage.enabled : true,
                mute: options.errorMessage?.mute !== undefined ? options.errorMessage?.mute instanceof MessageEmbed ? options.errorMessage?.mute.toJSON() : options.errorMessage.mute : 'Could not mute @{user} because of improper permissions.',
                kick: options.errorMessage?.kick !== undefined ? options.errorMessage?.kick instanceof MessageEmbed ? options.errorMessage?.kick.toJSON() : options.errorMessage.kick : 'Could not kick @{user} because of improper permissions.',
                ban: options.errorMessage?.ban !== undefined ? options.errorMessage?.ban instanceof MessageEmbed ? options.errorMessage?.ban.toJSON() : options.errorMessage.ban : 'Could not ban @{user} because of improper permissions.',
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
     * Return default options for this AntiSpam client instance
     * @returns {AntiSpamClientOptions}
     */
    async getDefaultOptions () {
        return this._defaultOptions;
    }
    /**
     * Get cache for a guild
     * @param {string} guildID Guild ID
     * @returns {Promise<AntiSpamCache>}
     */
    async getCache (guildID) {
        if (!this.cache.has(guildID)) {
            await this.cache.set(guildID, {
                messages: [],
                warnedUsers: [],
                kickedUsers: [],
                bannedUsers: []
            });
        }
        return this.cache.get(guildID);
    }

    /**
     *
     * @param {Message} message Message object
     * @returns {Promise<AntiSpamCache>}
     */
    async addMessagesCache (message) {
        const cache = await this.getCache(message.guild.id);
        cache.messages.push({
            messageID: message.id,
            guildID: message.guild.id,
            authorID: message.author.id,
            channelID: message.channel.id,
            content: message.content,
            sentTimestamp: message.createdTimestamp
        });
        await this.cache.set(message.guild.id, cache);
        return this.cache.get(message.guild.id);
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
     * 	antiSpam.messageAntiSpam(msg);
     * });
     */
    async messageAntiSpam (message) {
        // Guild Options is priority
        const options = await this.getGuildOptions(message.guild.id) || this.options;
        if (!options) return this.logs.logsVerbose('Discord AntiSpam (message#failed): No options found!', options);

        if (!options.antispamFilter.enabled) return false;

        const can = await this.canRun(message, options);
        if (!can) return false;

        // Add message to cache
        const cache = await this.getCache(message.guild.id);

        const cachedMessages = cache.messages.filter((m) => m.authorID === message.author.id && m.guildID === message.guild.id);
        const duplicateMatches = cachedMessages.filter((m) => m.content === message.content && (m.sentTimestamp > (message.createdTimestamp - options.antispamFilter.maxDuplicatesInterval)));

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

        const spamMatches = cachedMessages.filter((m) => m.sentTimestamp > (Date.now() - options.antispamFilter.maxInterval));
        let sanctioned = false;

        /** BAN SANCTION */
        const userCanBeBanned = options.enable.ban && !cache.bannedUsers.includes(message.author.id) && !sanctioned;
        if (userCanBeBanned && (duplicateMatches.length >= options.antispamFilter.maxDuplicates.ban)) {
            this.emit('spamThresholdBan', message.member, false);
            await this.sanctions.appliedSanction(this.types_sanction.ban, message, 'Spamming',[...duplicateMatches, ...spamOtherDuplicates], options);
            this.emit('banAdd', message.member, 'Spamming Duplicate Messages');
            sanctioned = true;
        } else if (userCanBeBanned && (spamMatches.length >= options.antispamFilter.thresholds.ban)) {
            this.emit('spamThresholdBan', message.member, false);
            await this.sanctions.appliedSanction(this.types_sanction.ban, message, 'Spamming', spamMatches, options);
            this.emit('banAdd', message.member, 'Spamming');
            sanctioned = true;
        }

        /** KICK SANCTION */
        if (sanctioned) return sanctioned;
        const userCanBeKicked = options.enable.kick && !cache.kickedUsers.includes(message.author.id) && !sanctioned;
        if (userCanBeKicked && (duplicateMatches.length >= options.antispamFilter.maxDuplicates.kick)) {
            this.emit('spamThresholdKick', message.member, true);
            await this.sanctions.appliedSanction(this.types_sanction.kick, message, 'Spamming',[...duplicateMatches, ...spamOtherDuplicates], options);
            this.emit('kickAdd', message.member, 'Spamming Duplicate Messages');
            sanctioned = true;
        } else if (userCanBeKicked && (spamMatches.length >= options.antispamFilter.thresholds.kick)) {
            this.emit('spamThresholdKick', message.member, false);
            await this.sanctions.appliedSanction(this.types_sanction.kick, message, 'Spamming', spamMatches, options);
            this.emit('kickAdd', message.member, 'Spamming');
            sanctioned = true;
        }

        /** MUTE SANCTION */
        if (sanctioned) return sanctioned;
        const userCanBeMuted = options.enable.mute && !sanctioned;
        if (userCanBeMuted && (duplicateMatches.length >= options.antispamFilter.maxDuplicates.mute)) {
            this.emit('spamThresholdMute', message.member, true);
            await this.sanctions.appliedSanction(this.types_sanction.mute, message, 'Spamming',[...duplicateMatches, ...spamOtherDuplicates], options);
            this.emit('muteAdd', message.member, 'Spamming Duplicate Messages');
            sanctioned = true;
        } else if (userCanBeMuted && (spamMatches.length >= options.antispamFilter.thresholds.mute)) {
            this.emit('spamThresholdMute', message.member, false);
            await this.sanctions.appliedSanction(this.types_sanction.mute, message, 'Spamming', spamMatches, options);
            this.emit('muteAdd', message.member, 'Spamming');
            sanctioned = true;
        }

        /** WARN SANCTION */
        if (sanctioned) return sanctioned;
        const userCanBeWarned = options.enable.warn && !cache.warnedUsers.includes(message.author.id) && !sanctioned;
        if (userCanBeWarned && (duplicateMatches.length >= options.antispamFilter.maxDuplicates.warn)) {
            this.emit('spamThresholdWarn', message.member, true);
            await this.sanctions.appliedSanction(this.types_sanction.warn, message, 'Spamming', [...duplicateMatches, ...spamOtherDuplicates], options);
            this.emit('warnAdd', message.member, 'Spamming Duplicate Messages');
            sanctioned = true;
        } else if (userCanBeWarned && (spamMatches.length >= options.antispamFilter.thresholds.warn)) {
            this.emit('spamThresholdWarn', message.member, false);
            await this.sanctions.appliedSanction(this.types_sanction.warn, message, 'Spamming', spamMatches, options);
            this.emit('warnAdd', message.member, 'Spamming');
            sanctioned = true;
        }

        return sanctioned;
    }

    /**
     *
     * @param {Message} message Message to Object
     * @returns {Promise<boolean>}
     */
    async messageWordsFilter(message) {
        const options = await this.getGuildOptions(message.guild.id) || this.options;
        if (!options) return this.logs.logsVerbose('Discord AntiSpam (messageWordsFilter#failed): No options found!', options);

        if (!options.wordsFilter.enabled) return false;

        const can = await this.canRun(message, options);
        if (!can) return false;

        /** Check if message contain bad words */
        const contain = await this.anti_words.checkWord(message.cleanContent, message.guild.id);
        if (contain) {
            await this.sanctions.appliedSanction(options.wordsFilter.typeSanction, message, 'Send prohibited words', [], options);
            this.emit(`${options.wordsFilter.typeSanction}Add`, message.member, 'Send prohibited words');
            return true;
        }
        return false;
    }

    /**
     *
     * @param {Message} message Message to Object
     * @returns {Promise<boolean>}
     */
    async messageLinksFilter(message) {
        const options = await this.getGuildOptions(message.guild.id) || this.options;
        if (!options) return this.logs.logsVerbose('Discord AntiSpam (messageLinksFilter#failed): No options found!', options);

        if (!options.linksFilter.enabled) return false;
        if (!options.linksFilter.globalLinksFilter && !options.linksFilter.discordInviteLinksFilter && !options.linksFilter.customLinksFilter) return false;

        const can = await this.canRun(message, options);
        if (!can) return false;

        let contain_links = false;
        /** Global filter override */
        if (options.linksFilter.globalLinksFilter) await this.anti_links.hasGlobalLink(message) === true ? contain_links = true : null;
        if (options.linksFilter.discordInviteLinksFilter) await this.anti_links.hasDiscordInviteLink(message) === true ? contain_links = true : null;
        if (options.linksFilter.customLinksFilter) await this.anti_links.hasCustomLinks(message, message.guild.id) === true ? contain_links = true : null;

        if (contain_links) {
            await this.sanctions.appliedSanction(options.linksFilter.typeSanction, message, 'Send unauthorized links', [], options);
            this.emit(`${options.linksFilter.typeSanction}Add`, message.member, 'Send unauthorized links');
            return true;
        }

        return false;
    }

    /**
     *
     * @param {Message} message Message to check
     * @returns {Promise<Array<string>>}
     */
    async messageBadWordsUsages(message) {
        if (!message) return;
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
        if (!words || !guildId) return false;
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
        if (!links || !guildId) return false;
        return this.anti_links.addLinks(links, guildId);
    }

    /**
     * Remove a word or words from custom list of words for a guild
     * @param {string|Array<string>} words Word to remove
     * @param {string} guildId Guild ID
     * @returns {Promise<boolean>}
     */
    async removeWords(words, guildId) {
        if (!words || !guildId) return false;
        return this.anti_words.removeWords(words, guildId);
    }

    /**
     *
     * @param {string|Array<string>} links Links to remove
     * @param {string} guildId Guild ID
     * @returns {Promise<boolean>}
     */
    async removeLinks(links, guildId) {
        if (!links || !guildId) return false;
        return this.anti_links.removeLinks(links, guildId);
    }

    /**
     * Get all words for a guild
     * @param {string} guildId Guild ID
     * @returns {Promise<Array<string>>}
     */
    async listWords(guildId) {
        return this.anti_words.listWords(guildId);
    }

    /**
     * Get all links for a guild
     * @param {string} guildId Guild ID
     * @returns {Promise<Array<string>>}
     */
    async listLinks(guildId) {
        return this.anti_links.listLinks(guildId);
    }

    /**
     * Checks if the user left the server to remove him from the cache!
     * @param {GuildMember} member The member to remove from the cache.
     * @returns {Promise<boolean>} Whether the member has been removed
     * @example
     * client.on('guildMemberRemove', (member) => {
     * 	antiSpam.userLeave(member);
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