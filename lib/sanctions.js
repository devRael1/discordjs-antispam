const {
    Client,
    Message,
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
         *
         * @type {LogsManager} Instance of the Logs Manager
         */
        this.logs = this.antispam_client.logs;
    }

    /**
     *
     * @param {string} sanction Sanciton to applied
     * @param {Message} message Message object
     * @param {string} reason Reason of the sanction
     * @param {CachedMessage[]} [spamMessages] Spam messages
     * @param {AntiSpamClientOptions} options options of the guild or AntiSpam Instance
     * @returns {Promise<boolean>}
     */
    async appliedSanction (sanction, message, reason, spamMessages, options) {
        if (options.removeMessages && spamMessages) {
            await this.antispam_client.clearSpamMessages(spamMessages, options);
        }

        switch (sanction) {
            /** BAN SANCTION */
            case this.antispam_client.types_sanction.ban: {
                if (!message.member.bannable) {
                    if (options.verbose) await this.antispam_client.logs.logsVerbose(
                        `DAntiSpam (banUser#userNotBannable): ${message.author} \`(ID: ${message.author.id})\` could not be banned, insufficient permissions`, options);
                    if (options.errorMessage.enabled) await message.channel.send(this.antispam_client.logs.format(options.errorMessage.ban, message)).catch((e) => {
                        this.antispam_client.logs.logsError(`DAntiSpam (banUser#sendMissingPermMessage): \`\`\`${e.message}\`\`\``, options);
                    });
                    return false;
                } else {
                    await message.member.ban({reason: 'Spamming!', days: options.deleteMessagesAfterBanForPastDays});
                    if (options.message.ban) await message.channel.send(this.antispam_client.logs.format(options.message.ban, message, reason)).catch((e) => {
                        this.antispam_client.logs.logsError(`DAntiSpam (banUser#sendMissingPermMessage): \`\`\`${e.message}\`\`\``, options);
                    });
                    if (options.modLogsEnabled) await this.logs.logs(message, `banned`, reason, options);
                    return true;
                }
            }
            /** KICK SANCTION */
            case this.antispam_client.types_sanction.kick: {
                if (!message.member.kickable) {
                    if (options.verbose) await this.antispam_client.logs.logsVerbose(
                        `DAntiSpam (kickUser#userNotKickable): ${message.author} \`(ID: ${message.author.id})\` could not be kicked, insufficient permissions.`, options);
                    if (options.errorMessage.enabled) await message.channel.send(this.antispam_client.logs.format(options.errorMessage.kick, message)).catch((e) => {
                        this.antispam_client.logs.logsError(`DAntiSpam (kickUser#sendMissingPermMessage): \`\`\`${e.message}\`\`\``, options);
                    });
                    return false;
                } else {
                    await message.member.kick('Spamming!');
                    if (options.message.kick) await message.channel.send(this.antispam_client.logs.format(options.message.kick, message, reason)).catch((e) => {
                        this.antispam_client.logs.logsError(`DAntiSpam (kickUser#sendSuccessMessage): \`\`\`${e.message}\`\`\``, options);
                    });
                    if (options.modLogsEnabled) await this.logs.logs(message, `kicked`, reason, options);
                    return true;
                }
            }
            /** MUTE SANCTION */
            case this.antispam_client.types_sanction.mute: {
                const userCanBeMuted = message.guild.me.permissions.has('MODERATE_MEMBERS') && (message.guild.me.roles.highest.position > message.member.roles.highest.position && message.member.id !== message.guild.ownerId)
                if (!userCanBeMuted) {
                    if (options.verbose) await this.antispam_client.logs.logsVerbose(
                        `DAntiSpam (muteUser#userNotMutable): ${message.author} \`(ID: ${message.author.id})\` could not be muted, improper permissions.`, options);
                    if (options.errorMessage.enabled) await message.channel.send(this.antispam_client.logs.format(options.errorMessage.mute, message)).catch((e) => {
                        this.antispam_client.logs.logsError(`DAntiSpam (muteUser#sendMissingPermMessage): \`\`\`${e.message}\`\`\``, options);
                    });
                    return false;
                }
                await message.member.timeout(options.unMuteTime * 60_000, 'Spamming');
                if (options.message.mute) await message.channel.send(this.antispam_client.logs.format(options.message.mute, message, reason)).catch((e) => {
                    this.antispam_client.logs.logsError(`DAntiSpam (muteUser#sendSuccessMessage): \`\`\`${e.message}\`\`\``, options);
                });
                if (options.modLogsEnabled) await this.logs.logs(message, `muted`, reason, options);
                return true;
            }
            /** WARN SANCTION */
            case this.antispam_client.types_sanction.warn: {
                if (options.message.warn) await message.channel.send(this.antispam_client.logs.format(options.message.warn, message, reason)).catch((e) => {
                    this.antispam_client.logs.logsError(`DAntiSpam (warnUser#sendSuccessMessage): \`\`\`${e.message}\`\`\``, options);
                });
                if (options.modLogsEnabled) await this.logs.logs(message, `warned`, reason, options);
                return true;
            }
        }
    }
}

module.exports = SanctionsManager;