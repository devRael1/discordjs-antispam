const { EventEmitter } = require('events');
const { Client,
    Message,
    GuildMember,
    Snowflake,
    Role,
    Collection,
    Guild,
    MessageEmbed,
    TextChannel,
    PermissionString
} = require('discord.js');
const Logger = require('leekslazylogger');

/**
 * @callback IgnoreMemberFunction
 * @param {GuildMember} member The member to check
 * @returns {boolean} Whether the member should be ignored
 */

/**
 * @callback IgnoreRoleFunction
 * @param {Collection<Snowflake, Role>} role The role to check
 * @returns {boolean} Whether the user should be ignored
 */

/**
 * @callback IgnoreGuildFunction
 * @param {Guild} guild The guild to check
 * @returns {boolean} Whether the guild should be ignored
 */

/**
 * @callback IgnoreChannelFunction
 * @param {TextChannel} channel The channel to check
 * @returns {boolean} Whether the channel should be ignored
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
 * Logger Instance for AntiSpam Log Client
 * @typedef {Logger}
 */

/**
 * Options for the AntiSpam client
 * @typedef AntiSpamClientOptions
 *
 * @property {boolean} [customGuildOptions=false] Whether to use custom guild options
 * @property {number} [warnThreshold=3] Amount of messages sent in a row that will cause a warning.
 * @property {number} [muteThreshold=4] Amount of messages sent in a row that will cause a mute.
 * @property {number} [kickThreshold=5] Amount of messages sent in a row that will cause a kick.
 * @property {number} [banThreshold=7] Amount of messages sent in a row that will cause a ban.
 *
 * @property {number} [maxInterval=2000] Amount of time (ms) in which messages are considered spam.
 * @property {number} [maxDuplicatesInterval=2000] Amount of time (ms) in which duplicate messages are considered spam.
 *
 * @property {number} [maxDuplicatesWarn=7] Amount of duplicate messages that trigger a warning.
 * @property {number} [maxDuplicatesMute=9] Amount of duplicate messages that trigger a mute.
 * @property {number} [maxDuplicatesKick=10] Amount of duplicate messages that trigger a kick.
 * @property {number} [maxDuplicatesBan=11] Amount of duplicate messages that trigger a ban.
 *
 * @property {number} [unMuteTime='0'] Time in minutes to wait until unmuting a user.
 * @property {string|Snowflake} [modLogsChannel='mod-logs'] Name or ID of the channel in which moderation logs will be sent.
 * @property {boolean} [modLogsEnabled=false] Whether moderation logs are enabled.
 *
 * @property {string|MessageEmbed} [warnMessage='{@user}, Please stop spamming.'] Message that will be sent in the channel when someone is warned.
 * @property {string|MessageEmbed} [kickMessage='**{user_tag}** has been kicked for spamming.'] Message that will be sent in the channel when someone is kicked.
 * @property {string|MessageEmbed} [muteMessage='**{user_tag}** has been muted for spamming.'] Message that will be sent in the channel when someone is muted.
 * @property {string|MessageEmbed} [banMessage='**{user_tag}** has been banned for spamming.'] Message that will be sent in the channel when someone is banned.
 *
 * @property {boolean} [errorMessages=true] Whether the bot should send a message in the channel when it doesn't have some required permissions, like it can't kick members.
 * @property {string} [kickErrorMessage='Could not kick **{user_tag}** because of improper permissions.'] Message that will be sent in the channel when the bot doesn't have enough permissions to kick the member.
 * @property {string} [banErrorMessage='Could not ban **{user_tag}** because of improper permissions.'] Message that will be sent in the channel when the bot doesn't have enough permissions to mute the member (to add the mute role).
 * @property {string} [muteErrorMessage='Could not mute **{user_tag}** because of improper permissions.'] Message that will be sent in the channel when the bot doesn't have enough permissions to ban the member.
 *
 * @property {Snowflake|string[]|IgnoreMemberFunction} [ignoredMembers=[]] Array of member IDs that are ignored.
 * @property {Snowflake|string[]|IgnoreRoleFunction} [ignoredRoles=[]] Array of role IDs or role names that are ignored. Members with one of these roles will be ignored.
 * @property {Snowflake|string[]|IgnoreChannelFunction} [ignoredChannels=[]] Array of channel IDs or channel names that are ignored.
 * @property {PermissionString[]} [ignoredPermissions=[]] Users with at least one of these permissions will be ignored.
 * @property {boolean} [ignoreBots=true] Whether bots should be ignored.
 *
 * @property {boolean} [warnEnabled=true] Whether warn sanction is enabled.
 * @property {boolean} [kickEnabled=true] Whether kick sanction is enabled.
 * @property {boolean} [muteEnabled=true] Whether mute sanction is enabled.
 * @property {boolean} [banEnabled=true] Whether ban sanction is enabled.
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
 * @typedef AntiSpamCache
 *
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
     * @param {Logger} log Logger instance
     */
    constructor (client, options, log) {
        super()
        /**
         * The Client Instance
         * @type {Client}
         */
        this.client = client;

        /**
         * The options for this AntiSpam client instance
         * @type {AntiSpamClientOptions}
         */
        this.options = options.customGuildOptions ? undefined : {
            customGuildOptions: options.customGuildOptions || false,

            warnThreshold: options.warnThreshold || 3,
            muteThreshold: options.muteThreshold || 4,
            kickThreshold: options.kickThreshold || 5,
            banThreshold: options.banThreshold || 7,

            maxInterval: options.maxInterval || 2000,
            maxDuplicatesInterval: options.maxDuplicatesInterval || 2000,

            maxDuplicatesWarn: options.maxDuplicatesWarn || 7,
            maxDuplicatesMute: options.maxDuplicatesMute || 9,
            maxDuplicatesKick: options.maxDuplicatesKick || 10,
            maxDuplicatesBan: options.maxDuplicatesBan || 11,

            unMuteTime: options.unMuteTime * 60_000 || 300000,

            modLogsChannel: options.modLogsChannel || 'CHANNEL_ID',
            modLogsEnabled: options.modLogsEnabled || false,

            warnMessage: options.warnMessage || '{@user}, Please stop spamming.',
            muteMessage: options.muteMessage || '**{user_tag}** has been muted for spamming.',
            kickMessage: options.kickMessage || '**{user_tag}** has been kicked for spamming.',
            banMessage: options.banMessage || '**{user_tag}** has been banned for spamming.',

            errorMessages: options.errorMessages !== undefined ? options.errorMessages : true,
            kickErrorMessage: options.kickErrorMessage || 'Could not kick **{user_tag}** because of improper permissions.',
            banErrorMessage: options.banErrorMessage || 'Could not ban **{user_tag}** because of improper permissions.',
            muteErrorMessage: options.muteErrorMessage || 'Could not mute **{user_tag}** because of improper permissions.',

            ignoredMembers: options.ignoredMembers || [],
            ignoredRoles: options.ignoredRoles || [],
            ignoredChannels: options.ignoredChannels || [],
            ignoredPermissions: options.ignoredPermissions || [],
            ignoreBots: options.ignoreBots !== undefined ? options.ignoreBots : true,

            warnEnabled: options.warnEnabled !== undefined ? options.warnEnabled : true,
            kickEnabled: options.kickEnabled !== undefined ? options.kickEnabled : true,
            muteEnabled: options.muteEnabled !== undefined ? options.muteEnabled : true,
            banEnabled: options.banEnabled !== undefined ? options.banEnabled : true,

            deleteMessagesAfterBanForPastDays: options.deleteMessagesAfterBanForPastDays || 1,
            verbose: options.verbose || false,
            debug: options.debug || false,
            removeMessages: options.removeMessages !== undefined ? options.removeMessages : true,
        }

        /**
         * The log system
         */
        this.log = log instanceof Logger ? log : new Logger({
            debug: this.options.debug || false,
            levels: {
                _logger: {format: '{timestamp}&r [LOGGER] {text}'},
                basic: {format: '{timestamp} {text}'},
                commands: {
                    format: '&3{timestamp}&r &3[INFO] &d(COMMANDS)&r {text}',
                    type: 'info'
                },
                console: {format: '{timestamp} [INFO] {text}'},
                debug: {format: '&1{timestamp}&r &1[DEBUG] &9{text}'},
                error: {format: '&4{timestamp}&r &4[ERROR] &c{text}'},
                http: {
                    format: '{timestamp}&r &3[INFO] &d(HTTP)&r {text}',
                    type: 'info'
                },
                info: {format: '&3{timestamp}&r &3[INFO] &b{text}'},
                notice: {format: '&0&!6{timestamp}&r &0&!6[NOTICE] {text}'},
                plugins: {
                    format: '&d{timestamp}&r &3[INFO] &d(PLUGINS)&r {text}',
                    type: 'info'
                },
                success: {format: '&2{timestamp}&r &2[SUCCESS] &a{text}'},
                warn: {format: '&6{timestamp}&r &6[WARN] &e{text}'},
                ws: {
                    format: '&3{timestamp}&r &3[INFO] &d(WS)&r {text}',
                    type: 'info'
                },
                stats: {
                    format: '&6(STATS)&r {text}',
                    type: 'info'
                }
            },
            logToFile: false,
            timestamp: 'YYYY/MM/DD HH:mm:ss'
        });

        /**
         * The cache for this AntiSpam client instance
         * @type {AntiSpamCache}
         * // Structure:
         * guild_ID: {
            messages: [],
            warnedUsers: [],
            kickedUsers: [],
            bannedUsers: []
        }
         */
        this.cache = new Collection();

    }




    /**
     * Format a string and returns it.
     * @ignore
     * @param {string|MessageEmbed} string The string to format.
     * @param {Message} message Context message.
     * @returns {string|MessageEmbed}
     */
    format (string, message) {
        if (typeof string === 'string') {
            const content = string.replace(/{@user}/g, message.author.toString())
                .replace(/{user_tag}/g, message.author.tag)
                .replace(/{server_name}/g, message.guild.name)
            return { content };
        } else {
            const embed = new MessageEmbed(string)
            if (embed.description) embed.setDescription(this.format(embed.description, message))
            if (embed.title) embed.setTitle(this.format(embed.title, message))
            if (embed.footer && embed.footer.text) embed.footer.text = this.format(embed.footer.text, message)
            if (embed.author && embed.author.name) embed.author.name = this.format(embed.author.name, message)
            return { embeds: [embed] }
        }
    }

    /**
     * Logs the actions
     * @ignore
     * @param {Message} msg The message to check the channel with
     * @param {string} action The action to log
     * @param {AntiSpamClientOptions} options options for the action
     */
    async logs (msg, action, options) {
        if (options.modLogsEnabled) {
            const modLogChannel = this.client.channels.cache.get(options.modLogsChannel) ||
                msg.guild.channels.cache.find((channel) => channel.name === options.modLogsChannel && channel.type === 'GUILD_TEXT')
            if(modLogChannel) {
                const embed = new MessageEmbed()
                    .setAuthor({name: `DAS Spam detection`, iconURL: 'https://discord-anti-spam.js.org/img/antispam.png'})
                    .setDescription(`${msg.author} *(${msg.author.id})* has been **${action}** for **spam**!`)
                    .setFooter({text: `DAS Anti spam`, iconURL: 'https://discord-anti-spam.js.org/img/antispam.png'})
                    .setColor('RED')
                await modLogChannel.send({embeds:[embed]});
            }

        }
    }

    /**
     * Delete spam messages
     * @ignore
     * @param {CachedMessage[]} messages The messages to delete
     * @param {AntiSpamClientOptions} options options for the action
     * @returns {Promise<void>}
     */
    async clearSpamMessages (messages, options) {
        try {
            messages.forEach((message) => {
                const channel = this.client.channels.cache.get(message.channelID)
                if (channel) {
                    const msg = channel.messages.cache.get(message.messageID)
                    if (msg && msg.deletable) msg.delete().catch(err => {
                        if(err && options.debug === true) this.log.error(`DAntiSpam (clearSpamMessages#failed): The message(s) couldn't be deleted`);
                    });
                }
            });
        } catch (e) {
            if(e){
                if (options.debug) {
                    this.log.error(`DAntiSpam (clearSpamMessages#failed): The message(s) couldn't be deleted!`);
                }
            }
        }
    }

    /**
     * Checks a message.
     * @param {Message} message The message to check.
     * @param {AntiSpamClientOptions} guildOptions - The guild options or Global Antispam Client Options
     * @returns {Promise<boolean>} Whether the message has triggered a threshold.
     * @example
     * client.on('message', (msg) => {
     * 	antiSpam.message(msg);
     * });
     */
    async message (message, guildOptions) {
        const options = guildOptions || this.options;

        if (
            !message.guild ||
            message.author.id === this.client.user.id ||
            (message.guild.ownerId === message.author.id && !options.debug) ||
            (options.ignoreBots && message.author.bot)
        ) {
            return false
        }

        const isMemberIgnored = typeof options.ignoredMembers === 'function' ? options.ignoredMembers(message.member) : options.ignoredMembers.includes(message.author.id)
        if (isMemberIgnored) return false

        const isChannelIgnored = typeof options.ignoredChannels === 'function' ? options.ignoredChannels(message.channel) : options.ignoredChannels.includes(message.channel.id)
        if (isChannelIgnored) return false

        const member = message.member || await message.guild.members.fetch(message.author);

        const memberHasIgnoredRoles = typeof options.ignoredRoles === 'function'
            ? options.ignoredRoles(member.roles.cache)
            : options.ignoredRoles.some((r) => member.roles.cache.has(r))
        if (memberHasIgnoredRoles) return false;

        if (options.ignoredPermissions.some((permission) => member.permissions.has(permission))) return false;

        const currentMessage = {
            messageID: message.id,
            guildID: message.guild.id,
            authorID: message.author.id,
            channelID: message.channel.id,
            content: message.content,
            sentTimestamp: message.createdTimestamp
        }
        const cache = await this.cache.get(message.guild.id);
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
                if (rowBroken) return
                if (element.content !== duplicateMatches[0].content) rowBroken = true
                else spamOtherDuplicates.push(element)
            })
        }

        const spamMatches = cachedMessages.filter((m) => m.sentTimestamp > (Date.now() - options.maxInterval))

        let sanctioned = false;

        /**
         * Ban a user.
         * @ignore
         * @param {Message} message Context message.
         * @param {GuildMember} member The member to ban.
         * @param {CachedMessage[]} [spamMessages] The spam messages.
         * @returns {Promise<boolean>} Whether the member could be banned.
         */
        const banUser = async (message, member, spamMessages) => {
            if (options.removeMessages && spamMessages) {
                await this.clearSpamMessages(spamMessages, options);
            }
            const cache = await this.cache.get(message.guild.id);
            cache.messages = cache.messages.filter((u) => u.authorID !== message.author.id);
            cache.bannedUsers.push(message.author.id);
            await this.cache.set(message.guild.id, cache);
            if (!member.bannable) {
                if (options.verbose) {
                    this.log.warn(`DAntiSpam (banUser#userNotBannable): ${message.author.tag} (ID: ${message.author.id}) could not be banned, insufficient permissions`);
                }
                if (options.errorMessages) {
                    message.channel.send(this.format(options.banErrorMessage, message)).catch((e) => {
                        if (options.verbose) {
                            this.log.error(`DAntiSpam (banUser#sendMissingPermMessage): ${e.message}`);
                        }
                    });
                }
                return false;
            } else {
                await message.member.ban({
                    reason: 'Spamming!',
                    days: options.deleteMessagesAfterBanForPastDays
                }).catch((e) => {
                    if (options.errorMessages) {
                        message.channel.send(this.format(options.banErrorMessage, message)).catch(() => {
                            if (options.verbose) {
                                this.log.error(`DAntiSpam (banUser#sendSuccessMessage): ${e.message}`);
                            }
                        });
                    }
                })
                if (options.modLogsEnabled) {
                    await this.logs(message, `banned`, options);
                }
                this.emit('banAdd', member);
                return true;
            }
        }

        const userCanBeBanned = options.banEnabled && !cache.bannedUsers.includes(message.author.id) && !sanctioned
        if (userCanBeBanned && (spamMatches.length >= options.banThreshold)) {
            await banUser(message, member, spamMatches);
            sanctioned = true;
        } else if (userCanBeBanned && (duplicateMatches.length >= options.maxDuplicatesBan)) {
            await banUser(message, member, [...duplicateMatches, ...spamOtherDuplicates]);
            sanctioned = true;
        }


        /**
         * Mute a user.
         * @ignore
         * @param {Message} message Context message.
         * @param {GuildMember} member The member to mute.
         * @param {CachedMessage[]} [spamMessages] The spam messages.
         * @returns {Promise<boolean>} Whether the member could be muted.
         */
        const muteUser = async (message, member, spamMessages) => {
            if (options.removeMessages && spamMessages) {
                await this.clearSpamMessages(spamMessages, options)
            }
            const cache = await this.cache.get(message.guild.id);
            cache.messages = cache.messages.filter((u) => u.authorID !== message.author.id);
            await this.cache.set(message.guild.id, cache);
            const userCanBeMuted = message.guild.me.permissions.has('MODERATE_MEMBERS') && (message.guild.me.roles.highest.position > message.member.roles.highest.position && message.member.id !== message.guild.ownerId)
            if (!userCanBeMuted) {
                if (options.verbose) {
                    this.log.warn(`DAntiSpam (kickUser#userNotMutable): ${message.author.tag} (ID: ${message.author.id}) could not be muted, improper permissions.`);
                }
                if (options.errorMessages) {
                    await message.channel
                        .send(this.format(options.muteErrorMessage, message))
                        .catch((e) => {
                            if (options.verbose) {
                                this.log.error(`DAntiSpam (muteUser#sendMissingPermMessage): ${e.message}`);
                            }
                        });
                }
                return false;
            }
            await message.member.timeout(options.unMuteTime, 'Spamming')
            if (options.muteMessage) {
                await message.channel.send(this.format(options.muteMessage, message)).catch(e => {
                    if (options.verbose) {
                        this.log.error(`DAntiSpam (muteUser#sendSuccessMessage): ${e.message}`);
                    }
                });
            }
            if (options.modLogsEnabled) {
                await this.logs(message, `muted`, options);
            }
            this.emit('muteAdd', member);
            return true;
        }

        const userCanBeMuted = options.muteEnabled && !sanctioned
        if (userCanBeMuted && (spamMatches.length >= options.muteThreshold)) {
            await muteUser(message, member, spamMatches);
            sanctioned = true;
        } else if (userCanBeMuted && (duplicateMatches.length >= options.maxDuplicatesMute)) {
            await muteUser(message, member, [...duplicateMatches, ...spamOtherDuplicates]);
            sanctioned = true;
        }


        /**
         * Kick a user.
         * @ignore
         * @param {Message} message Context message.
         * @param {GuildMember} member The member to kick.
         * @param {CachedMessage[]} [spamMessages] The spam messages.
         * @returns {Promise<boolean>} Whether the member could be kicked.
         */
        const kickUser = async (message, member, spamMessages) => {
            if (options.removeMessages && spamMessages) {
                await this.clearSpamMessages(spamMessages, options)
            }
            const cache = await this.cache.get(message.guild.id);
            cache.messages = cache.messages.filter((u) => u.authorID !== message.author.id);
            cache.kickedUsers.push(message.author.id);
            await this.cache.set(message.guild.id, cache);
            if (!member.kickable) {
                if (options.verbose) {
                    this.log.warn(`DAntiSpam (kickUser#userNotKickable): ${message.author.tag} (ID: ${message.author.id}) could not be kicked, insufficient permissions`)
                }
                if (options.errorMessages) {
                    message.channel.send(this.format(options.kickErrorMessage, message)).catch((e) => {
                        if (options.verbose) {
                            this.log.error(`DAntiSpam (kickUser#sendMissingPermMessage): ${e.message}`)
                        }
                    })
                }
                return false
            } else {
                await message.member.kick('Spamming!')
                if (options.kickMessage) {
                    message.channel.send(this.format(options.kickMessage, message)).catch((e) => {
                        if (options.verbose) {
                            this.log.error(`DAntiSpam (kickUser#sendSuccessMessage): ${e.message}`);
                        }
                    });
                }
                if (options.modLogsEnabled) {
                    await this.logs(message, `kicked`, options);
                }
                this.emit('kickAdd', member);
                return true
            }
        }

        const userCanBeKicked = options.kickEnabled && !cache.kickedUsers.includes(message.author.id) && !sanctioned
        if (userCanBeKicked && (spamMatches.length >= options.kickThreshold)) {
            await kickUser(message, member, spamMatches);
            sanctioned = true;
        } else if (userCanBeKicked && (duplicateMatches.length >= options.maxDuplicatesKick)) {
            await kickUser(message, member, [...duplicateMatches, ...spamOtherDuplicates]);
            sanctioned = true;
        }

        /**
         * Warn a user.
         * @ignore
         * @param {Message} message Context message.
         * @param {GuildMember} member The member to warn.
         * @param {CachedMessage[]} [spamMessages] The spam messages.
         * @returns {Promise<boolean>} Whether the member could be warned.
         */
        const warnUser = async (message, member, spamMessages) => {
            if (options.removeMessages && spamMessages) {
                await this.clearSpamMessages(spamMessages, options);
            }
            const cache = await this.cache.get(message.guild.id);
            cache.warnedUsers.push(message.author.id);
            await this.cache.set(message.guild.id, cache);
            await this.logs(message, `warned`, options);
            if (options.warnMessage) {
                message.channel.send(this.format(options.warnMessage, message)).catch((e) => {
                    if (options.verbose) {
                        this.log.error(`DAntiSpam (warnUser#sendSuccessMessage): ${e.message}`)
                    }
                });
            }
            this.emit('warnAdd', member);
            return true;
        }

        const userCanBeWarned = options.warnEnabled && !cache.warnedUsers.includes(message.author.id) && !sanctioned
        if (userCanBeWarned && (spamMatches.length >= options.warnThreshold)) {
            await warnUser(message, member, spamMatches);
            sanctioned = true;
        } else if (userCanBeWarned && (duplicateMatches.length >= options.maxDuplicatesWarn)) {
            await warnUser(message, member, [...duplicateMatches, ...spamOtherDuplicates]);
            sanctioned = true;
        }
        await this.cache.set(message.guild.id, cache);
        this.emit('messageCreate', message, options);
        return sanctioned
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * Checks if the user left the server to remove him from the cache!
     * @param {GuildMember} member The member to remove from the cache.
     * @returns {Promise<boolean>} Whether the member has been removed
     * @example
     * client.on('guildMemberRemove', (member) => {
     * 	antiSpam.userleave(member);
     * });
     */
    async userleave (member) {
        const cache = await this.cache.get(member.guild.id);
        cache.bannedUsers = cache.bannedUsers.filter((u) => u !== member.user.id);
        cache.kickedUsers = cache.kickedUsers.filter((u) => u !== member.user.id);
        cache.warnedUsers = cache.warnedUsers.filter((u) => u !== member.user.id);
        await this.cache.set(member.guild.id, cache);

        return true
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Reset the cache of this AntiSpam client instance.
     */
    async reset (guildID) {
        let cache = {
            messages: [],
            warnedUsers: [],
            kickedUsers: [],
            bannedUsers: []
        }
        await this.cache.set(guildID, cache);
    }
}

module.exports = AntiSpamClient