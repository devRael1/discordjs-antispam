const {
    Client,
    Message,
    Collection,
    Snowflake
} = require('discord.js');

class SanctionsManager  {
    constructor(client) {
        /**
         * @type {AntiSpamClient} Instance AntiSpam Client
         */
        this.antispam_client = client;

        /**
         * The Client Instance of the Bot (init)
         * @type {Client} Instance of the client
         */
        this.client = this.antispam_client.client;

        /**
         * The cache for this AntiSpam client instance
         * @type {Collection<Snowflake, AntiSpamCache>}
         */
        this.cache = this.antispam_client.cache;

        /**
         *
         * @type {LogsManager} Instance of the Logs Manager
         */
        this.antispam_client.logs.logs = this.antispam_client.logs;
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
            await this.antispam_client.clearSpamMessages(spamMessages, options);
        }
        const cache = await this.antispam_client.getCache(message.guild.id);
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
                        await this.antispam_client.logs.logsVerbose(`DAntiSpam (banUser#userNotBannable): ${message.author.tag} (ID: ${message.author.id}) could not be banned, insufficient permissions`, message, options);
                    }
                    if (options.errorMessage.enabled) {
                        await message.channel.send(this.antispam_client.logs.format(options.errorMessage.ban, message)).catch(async (e) => {
                            if (options.verbose) {
                                await this.antispam_client.logs.logsError(`DAntiSpam (banUser#sendMissingPermMessage): ${e.message}`, options);
                            }
                        });
                    }
                    return false;
                } else {
                    await message.member.ban({reason: 'Spamming!', days: options.deleteMessagesAfterBanForPastDays});
                    if (options.message.ban) {
                        await message.channel.send(this.antispam_client.logs.format(options.message.ban, message)).catch(async (e) => {
                            if (options.verbose) {
                                await this.antispam_client.logs.logsError(`DAntiSpam (banUser#sendMissingPermMessage): ${e.message}`, options);
                            }
                        });
                    }
                    if (options.modLogsEnabled) {
                        await this.antispam_client.logs.logs(message, `banned`, options);
                    }
                    return true;
                }
            }
            case 'kick': {
                if (!message.member.kickable) {
                    if (options.verbose) {
                        await this.antispam_client.logs.logsVerbose(`DAntiSpam (kickUser#userNotKickable): ${message.author.tag} (ID: ${message.author.id}) could not be kicked, insufficient permissions.`, message, options);
                    }
                    if (options.errorMessage.enabled) {
                        await message.channel.send(this.antispam_client.logs.format(options.errorMessage.kick, message)).catch(async (e) => {
                            if (options.verbose) {
                                await this.antispam_client.logs.logsError(`DAntiSpam (kickUser#sendMissingPermMessage): ${e.message}`, options);
                            }
                        })
                    }
                    return false;
                } else {
                    await message.member.kick('Spamming!');
                    if (options.message.kick) {
                        await message.channel.send(this.antispam_client.logs.format(options.message.kick, message)).catch(async (e) => {
                            if (options.verbose) {
                                await this.antispam_client.logs.logsError(`DAntiSpam (kickUser#sendSuccessMessage): ${e.message}`, options);
                            }
                        });
                    }
                    if (options.modLogsEnabled) {
                        await this.antispam_client.logs.logs(message, `kicked`, options);
                    }
                    return true;
                }
            }
            case 'mute': {
                const userCanBeMuted = message.guild.me.permissions.has('MODERATE_MEMBERS') && (message.guild.me.roles.highest.position > message.member.roles.highest.position && message.member.id !== message.guild.ownerId)
                if (!userCanBeMuted) {
                    if (options.verbose) {
                        await this.antispam_client.logs.logsVerbose(`DAntiSpam (kickUser#userNotMutable): ${message.author.tag} (ID: ${message.author.id}) could not be muted, improper permissions.`, message, options);
                    }
                    if (options.errorMessage.enabled) {
                        await message.channel.send(this.antispam_client.logs.format(options.errorMessage.mute, message)).catch(async (e) => {
                            if (options.verbose) {
                                await this.antispam_client.logs.logsError(`DAntiSpam (muteUser#sendMissingPermMessage): ${e.message}`, options);
                            }
                        });
                    }
                    return false;
                }
                await message.member.timeout(options.unMuteTime * 60_000, 'Spamming');
                if (options.message.mute) {
                    await message.channel.send(this.antispam_client.logs.format(options.message.mute, message)).catch(async (e) => {
                        if (options.verbose) {
                            await this.antispam_client.logs.logsError(`DAntiSpam (muteUser#sendSuccessMessage): ${e.message}`, options);
                        }
                    });
                }
                if (options.modLogsEnabled) {
                    await this.antispam_client.logs.logs(message, `muted`, options);
                }
                return true;
            }
            case 'warn': {
                if (options.message.warn) {
                    await message.channel.send(this.antispam_client.logs.format(options.message.warn, message)).catch(async (e) => {
                        if (options.verbose) {
                            await this.antispam_client.logs.logsError(`DAntiSpam (warnUser#sendSuccessMessage): ${e.message}`, options);
                        }
                    });
                }
                if (options.modLogsEnabled) {
                    await this.antispam_client.logs.logs(message, `warned`, options);
                }
                return true;
            }
        }
    }
}

module.exports = SanctionsManager;