const {
    Client,
    Message,
    Collection,
    Snowflake,
    MessageEmbed
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
                        .setAuthor({name: `Discord AntiSpam detection`, iconURL: 'https://i.imgur.com/gKayUAV.png'})
                        .setDescription(`${msg.author} *\`(${msg.author.id})\`* has been **${action}** for **spam**!`)
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
            if (options.debug) {
                await this.logsError('Discord AntiSpam (clearSpamMessages#failed): The message(s) couldn\'t be deleted!', options);
            }
        }
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
                        await this.logsVerbose(`DAntiSpam (banUser#userNotBannable): ${message.author.tag} (ID: ${message.author.id}) could not be banned, insufficient permissions`, message, options);
                    }
                    if (options.errorMessages) {
                        await message.channel.send(this.format(options.banErrorMessage, message)).catch(async (e) => {
                            if (options.verbose) {
                                await this.logsError(`DAntiSpam (banUser#sendMissingPermMessage): ${e.message}`, options);
                            }
                        });
                    }
                    return false;
                } else {
                    await message.member.ban({reason: 'Spamming!', days: options.deleteMessagesAfterBanForPastDays});
                    if (options.message.ban) {
                        await message.channel.send(this.format(options.message.ban, message)).catch(async (e) => {
                            if (options.verbose) {
                                await this.logsError(`DAntiSpam (banUser#sendMissingPermMessage): ${e.message}`, options);
                            }
                        });
                    }
                    if (options.modLogsEnabled) {
                        await this.logs(message, `banned`, options);
                    }
                    return true;
                }
            }
            case 'kick': {
                if (!message.member.kickable) {
                    if (options.verbose) {
                        await this.logsVerbose(`DAntiSpam (kickUser#userNotKickable): ${message.author.tag} (ID: ${message.author.id}) could not be kicked, insufficient permissions.`, message, options);
                    }
                    if (options.errorMessages) {
                        await message.channel.send(this.format(options.kickErrorMessage, message)).catch(async (e) => {
                            if (options.verbose) {
                                await this.logsError(`DAntiSpam (kickUser#sendMissingPermMessage): ${e.message}`, options);
                            }
                        })
                    }
                    return false;
                } else {
                    await message.member.kick('Spamming!');
                    if (options.message.kick) {
                        await message.channel.send(this.format(options.message.kick, message)).catch(async (e) => {
                            if (options.verbose) {
                                await this.logsError(`DAntiSpam (kickUser#sendSuccessMessage): ${e.message}`, options);
                            }
                        });
                    }
                    if (options.modLogsEnabled) {
                        await this.logs(message, `kicked`, options);
                    }
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
                        await message.channel.send(this.format(options.muteErrorMessage, message)).catch(async (e) => {
                            if (options.verbose) {
                                await this.logsError(`DAntiSpam (muteUser#sendMissingPermMessage): ${e.message}`, options);
                            }
                        });
                    }
                    return false;
                }
                await message.member.timeout(options.unMuteTime * 60_000, 'Spamming');
                if (options.message.mute) {
                    await message.channel.send(this.format(options.message.mute, message)).catch(async (e) => {
                        if (options.verbose) {
                            await this.logsError(`DAntiSpam (muteUser#sendSuccessMessage): ${e.message}`, options);
                        }
                    });
                }
                if (options.modLogsEnabled) {
                    await this.logs(message, `muted`, options);
                }
                return true;
            }
            case 'warn': {
                if (options.message.warn) {
                    await message.channel.send(this.format(options.message.warn, message)).catch(async (e) => {
                        if (options.verbose) {
                            await this.logsError(`DAntiSpam (warnUser#sendSuccessMessage): ${e.message}`, options);
                        }
                    });
                }
                if (options.modLogsEnabled) {
                    await this.logs(message, `warned`, options);
                }
                return true;
            }
        }
    }
}

module.exports = SanctionsManager;