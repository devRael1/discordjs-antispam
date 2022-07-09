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

            unMuteTime: options.unMuteTime * 60_000 || 600000,

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
     * @param {AntiSpamClientOptions} options options of the guild or AntiSpam Instance
     */
    async logs (msg, action, options) {
        if (options.modLogsEnabled) {
            const modLogChannel = this.client.channels.cache.get(options.modLogsChannel) ||
                msg.guild.channels.cache.find((channel) => channel.name === options.modLogsChannel && channel.type === 'GUILD_TEXT');
            if(modLogChannel) {
                await modLogChannel.send({
                    embeds: [new MessageEmbed()
                        .setColor(msg.member.displayHexColor === '#000000' ? '#ffffff' : msg.member.displayHexColor)
                        .setAuthor({name: `Discord AntiSpam detection`, iconURL: 'https://discord-anti-spam.js.org/img/antispam.png'})
                        .setDescription(`${msg.author} *(${msg.author.id})* has been **${action}** for **spam**!`)
                        .setFooter({text: `DAS Anti spam`, iconURL: 'https://discord-anti-spam.js.org/img/antispam.png'})
                    ]
                });
            }

        }
    }

    /**
     *
     * @param {string} error - The error to log
     * @param {AntiSpamClientOptions} options options of the guild or AntiSpam Instance
     * @returns {Promise<void>}
     */
    async logsError (error, options) {
        if (options.errorMessages) {
            const errorChannel = this.client.channels.cache.get(options.modLogsChannel) ||
                this.client.channels.cache.find((channel) => channel.name === options.modLogsChannel && channel.type === 'GUILD_TEXT');
            if (errorChannel) {
                await errorChannel.send({
                    embeds: [new MessageEmbed()
                        .setColor('RED')
                        .setAuthor({name: `Disord AntiSpam detection`, iconURL: 'https://cdn-icons-png.flaticon.com/512/148/148766.png'})
                        .setTitle('⛔ Error')
                        .setDescription(error)
                        .setFooter({text: `Discord AntiSpam`, iconURL: 'https://discord-anti-spam.js.org/img/antispam.png'})
                    ]
                });
            }
        }
    }

    /**
     *
     * @param {string} msg - message to log
     * @param {Message} message  - Message object
     * @param {AntiSpamClientOptions} options options of the guild or AntiSpam Instance
     * @returns {Promise<void>}
     */
    async logsVerbose (msg, message, options) {
        if (options.verbose) {
            const verboseChannel = this.client.channels.cache.get(options.modLogsChannel) ||
                this.client.channels.cache.find((channel) => channel.name === options.modLogsChannel && channel.type === 'GUILD_TEXT');
            if (verboseChannel) {
                await verboseChannel.send({
                    embeds: [new MessageEmbed()
                        .setColor(message.member.displayHexColor === '#000000' ? '#ffffff' : message.member.displayHexColor)
                        .setAuthor({name: `Discord AntiSpam detection`, iconURL: 'https://www.iconspng.com/uploads/warning-icon.png'})
                        .setTitle('⚠️ Warning')
                        .setDescription(msg)
                        .setFooter({text: `DAS Anti spam`, iconURL: 'https://discord-anti-spam.js.org/img/antispam.png'})
                    ]
                });
            }
        }
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
                if (err && options.debug === true) return this.logsError('Discord AntiSpam (clearSpamMessages#failed): The message(s) couldn\'t be deleted', options);
            });
        } catch (e) {
            if(e){
                if (options.debug) {
                    await this.logsError('Discord AntiSpam (clearSpamMessages#failed): The message(s) couldn\'t be deleted!', options);
                }
            }
        }
    }

    /**
     * Get cache for a guild
     * @param {string} guildID Guild ID
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
     *
     * @param {string} sanction Sanciton to applied
     * @param {Message} message Message object
     * @param {CachedMessage[]} [spamMessages] Spam messages
     * @param {AntiSpamClientOptions} options options of the guild or AntiSpam Instance
     * @returns {Promise<boolean>}
     */
    async appliedSanction (sanction, message, spamMessages, options) {
        if (options.removeMessages && spamMessages) {
            await this.clearSpamMessages(spamMessages, options);
        }
        const cache = await this.getCache(message.guild.id);
        cache.messages = cache.messages.filter((u) => u.authorID !== message.author.id);
        switch (sanction) {
            case 'ban': cache.bannedUsers.push(message.author.id); break;
            case 'kick': cache.kickedUsers.push(message.author.id); break;
            case 'warn': cache.warnedUsers.push(message.author.id); break;
        }
        await this.cache.set(message.guild.id, cache);

        switch (sanction) {
            case 'ban': {
                if (!message.member.bannable) {
                    if (options.verbose) {
                        await this.logsVerbose(`DAntiSpam (banUser#userNotBannable): ${message.author.tag} (ID: ${message.author.id}) could not be banned, insufficient permissions`, message, options);
                    }
                    if (options.errorMessages) {
                        message.channel.send(this.format(options.banErrorMessage, message)).catch((e) => {
                            if (options.verbose) {
                                this.logsError(`DAntiSpam (banUser#sendMissingPermMessage): ${e.message}`, options);
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
                                    this.logsError(`DAntiSpam (banUser#sendSuccessMessage): ${e.message}`, options);
                                }
                            });
                        }
                    })
                    if (options.modLogsEnabled) {
                        await this.logs(message, `banned`, options);
                    }
                    this.emit('banAdd', message.member);
                    return true;
                }
            }
            case 'kick': {
                if (!message.member.kickable) {
                    if (options.verbose) {
                        await this.logsVerbose(`DAntiSpam (kickUser#userNotKickable): ${message.author.tag} (ID: ${message.author.id}) could not be kicked, insufficient permissions.`, message, options);
                    }
                    if (options.errorMessages) {
                        message.channel.send(this.format(options.kickErrorMessage, message)).catch((e) => {
                            if (options.verbose) {
                                this.logsError(`DAntiSpam (kickUser#sendMissingPermMessage): ${e.message}`, options);
                            }
                        })
                    }
                    return false;
                } else {
                    await message.member.kick('Spamming!');
                    if (options.kickMessage) {
                        message.channel.send(this.format(options.kickMessage, message)).catch((e) => {
                            if (options.verbose) {
                                this.logsError(`DAntiSpam (kickUser#sendSuccessMessage): ${e.message}`, options);
                            }
                        });
                    }
                    if (options.modLogsEnabled) {
                        await this.logs(message, `kicked`, options);
                    }
                    this.emit('kickAdd', message.member);
                    return true;
                }
            }
            case 'mute': {
                const userCanBeMuted = message.guild.me.permissions.has('MODERATE_MEMBERS') && (message.guild.me.roles.highest.position > message.member.roles.highest.position && message.member.id !== message.guild.ownerId)
                if (!userCanBeMuted) {
                    if (options.verbose) {
                        await this.logsVerbose(`DAntiSpam (kickUser#userNotMutable): ${message.author.tag} (ID: ${message.author.id}) could not be muted, improper permissions.`, message, options);
                    }
                    if (options.errorMessages) {
                        await message.channel
                            .send(this.format(options.muteErrorMessage, message))
                            .catch((e) => {
                                if (options.verbose) {
                                    this.logsError(`DAntiSpam (muteUser#sendMissingPermMessage): ${e.message}`, options);
                                }
                            });
                    }
                    return false;
                }
                await message.member.timeout(options.unMuteTime * 60_000, 'Spamming');
                if (options.muteMessage) {
                    await message.channel.send(this.format(options.muteMessage, message)).catch(e => {
                        if (options.verbose) {
                            this.logsError(`DAntiSpam (muteUser#sendSuccessMessage): ${e.message}`, options);
                        }
                    });
                }
                if (options.modLogsEnabled) {
                    await this.logs(message, `muted`, options);
                }
                this.emit('muteAdd', message.member);
                return true;
            }
            case 'warn': {
                if (options.warnMessage) {
                    await message.channel.send(this.format(options.warnMessage, message)).catch((e) => {
                        if (options.verbose) {
                            this.logsError(`DAntiSpam (warnUser#sendSuccessMessage): ${e.message}`, options);
                        }
                    });
                }
                if (options.modLogsEnabled) {
                    await this.logs(message, `warned`, options);
                }
                this.emit('warnAdd', message.member);
                return true;
            }
        }
    }

    /**
     * Checks a message.
     * @param {Message} message The message to check.
     * @param {AntiSpamClientOptions} _options - The guild options or Global Antispam Client Options
     * @returns {Promise<boolean>} Whether the message has triggered a threshold.
     * @example
     * client.on('message', (msg) => {
     * 	antiSpam.message(msg);
     * });
     */
    async message (message, _options) {
        const options = _options || this.options;
        if (!options) return await this.logsError('Discord AntiSpam (message#failed): No options found!', options);

        if (!message.guild || message.author.id === this.client.user.id
            || (message.guild.ownerId === message.author.id && !options.debug)
            || (options.ignoreBots && message.author.bot)) return false;

        const isMemberIgnored = typeof options.ignoredMembers === 'function' ? options.ignoredMembers(message.member) : options.ignoredMembers.includes(message.author.id)
        if (isMemberIgnored) return false;

        const isChannelIgnored = typeof options.ignoredChannels === 'function' ? options.ignoredChannels(message.channel) : options.ignoredChannels.includes(message.channel.id)
        if (isChannelIgnored) return false;

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
                if (rowBroken) return
                if (element.content !== duplicateMatches[0].content) rowBroken = true
                else spamOtherDuplicates.push(element)
            })
        }

        const spamMatches = cachedMessages.filter((m) => m.sentTimestamp > (Date.now() - options.maxInterval))
        let sanctioned = false;

        /** BAN SANCTION */
        const userCanBeBanned = options.banEnabled && !cache.bannedUsers.includes(message.author.id) && !sanctioned
        if (userCanBeBanned && (spamMatches.length >= options.banThreshold)) {
            this.emit('spamThresholdBan', message.member, false);
            await this.appliedSanction('ban', message, spamMatches, options);
            sanctioned = true;
        } else if (userCanBeBanned && (duplicateMatches.length >= options.maxDuplicatesBan)) {
            this.emit('spamThresholdBan', message.member, false);
            await this.appliedSanction('ban', message, [...duplicateMatches, ...spamOtherDuplicates], options);
            sanctioned = true;
        }

        /** KICK SANCTION */
        const userCanBeKicked = options.kickEnabled && !cache.kickedUsers.includes(message.author.id) && !sanctioned
        if (userCanBeKicked && (spamMatches.length >= options.kickThreshold)) {
            this.emit('spamThresholdKick', message.member, false);
            await this.appliedSanction('kick', message, spamMatches, options);
            sanctioned = true;
        } else if (userCanBeKicked && (duplicateMatches.length >= options.maxDuplicatesKick)) {
            this.emit('spamThresholdKick', message.member, true);
            await this.appliedSanction('kick', message, [...duplicateMatches, ...spamOtherDuplicates], options);
            sanctioned = true;
        }

        /** MUTE SANCTION */
        const userCanBeMuted = options.muteEnabled && !sanctioned;
        if (userCanBeMuted && (spamMatches.length >= options.muteThreshold)) {
            this.emit('spamThresholdMute', message.member, false);
            await this.appliedSanction('mute', message, spamMatches, options);
            sanctioned = true;
        } else if (userCanBeMuted && (duplicateMatches.length >= options.maxDuplicatesMute)) {
            this.emit('spamThresholdMute', message.member, true);
            await this.appliedSanction('mute', message, [...duplicateMatches, ...spamOtherDuplicates], options);
            sanctioned = true;
        }

        /** WARN SANCTION */
        const userCanBeWarned = options.warnEnabled && !cache.warnedUsers.includes(message.author.id) && !sanctioned;
        if (userCanBeWarned && (spamMatches.length >= options.warnThreshold)) {
            this.emit('spamThresholdWarn', message.member, false);
            await this.appliedSanction('warn', message, spamMatches, options);
            sanctioned = true;
        } else if (userCanBeWarned && (duplicateMatches.length >= options.maxDuplicatesWarn)) {
            this.emit('spamThresholdWarn', message.member, true);
            await this.appliedSanction('warn', message, [...duplicateMatches, ...spamOtherDuplicates], options);
            sanctioned = true;
        }

        await this.cache.set(message.guild.id, cache);
        return sanctioned;
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
        await this.cache.set(member.guild.id, cache);

        return true;
    }

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