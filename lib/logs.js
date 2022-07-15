const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');

class LogsManager {
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
    }

    /**
     * Format a string and returns it.
     * @ignore
     * @param {string|MessageEmbed} string The string to format.
     * @param {Message} message Context message.
     * @param {string} reason The reason of the action.
     * @param {string} action The action to log.
     * @returns {{content: string}|{embeds: MessageEmbed[]}}
     */
    format (string, message, reason = '', action = '') {
        if (typeof string === 'string') {
            const content = string.replace(/{@user}/g, message.author.toString())
                .replace(/{user_tag}/g, message.author.tag)
                .replace(/{user_id}/g, message.author.id)
                .replace(/{server_name}/g, message.guild.name)
                .replace(/{reason}/g, reason)
                .replace(/{action}/g, action)
            return { content: content };
        } else {
            const embed = new MessageEmbed(string)
            if (embed.description) embed.setDescription(this.format(embed.description, message).content)
            if (embed.title) embed.setTitle(this.format(embed.title, message).content)
            if (embed.footer && embed.footer.text) embed.footer.text = this.format(embed.footer.text, message).content
            if (embed.author && embed.author.name) embed.author.name = this.format(embed.author.name, message).content
            if (embed.fields && embed.fields.length >= 1) {
                for (const field of embed.fields) {
                    field.value = this.format(field.value, message).content
                }
            }
            return { embeds: [embed] }
        }
    }

    /**
     * Logs the actions
     * @ignore
     * @param {Message} msg The message to check the channel with
     * @param {string} action The action to log
     * @param {string} reason The reason of the action
     * @param {AntiSpamClientOptions} options options of the guild or AntiSpam Instance
     */
    async logs (msg, action, reason, options) {
        const modLogChannel = await this.client.channels.cache.get(options.modLogsChannel) || await this.client.channels.fetch(options.modLogsChannel);
        if(modLogChannel) {
            await modLogChannel.send(this.format(options.message.logs, msg, reason, action)).catch((e) => {
                this.logsError(`DAntiSpam (logs#sendLogsMessage${action}): ${e.message}`, options);
            });
        }
    }

    /**
     *
     * @param {string} error - The error to log
     * @param {AntiSpamClientOptions} options options of the guild or AntiSpam Instance
     * @returns {Promise<void>}
     */
    async logsError (error, options) {
        if (options.errorMessage.enabled) {
            const errorChannel = await this.client.channels.cache.get(options.modLogsChannel) || await this.client.channels.fetch(options.modLogsChannel);
            if (errorChannel) {
                await errorChannel.send({
                    embeds: [new MessageEmbed()
                        .setColor('RED')
                        .setAuthor({name: `Disord AntiSpam`, iconURL: 'https://cdn-icons-png.flaticon.com/512/148/148766.png'})
                        .setDescription(error)
                    ]
                });
            }
        }
    }

    /**
     *
     * @param {string} msg - message to log
     * @param {AntiSpamClientOptions} options options of the guild or AntiSpam Instance
     * @returns {Promise<void>}
     */
    async logsVerbose (msg, options) {
        if (options.verbose) {
            const verboseChannel = await this.client.channels.cache.get(options.modLogsChannel) || await this.client.channels.fetch(options.modLogsChannel);
            if (verboseChannel) {
                await verboseChannel.send({
                    embeds: [new MessageEmbed()
                        .setColor('YELLOW')
                        .setAuthor({name: `Discord AntiSpam`, iconURL: 'https://i.imgur.com/QIDxAMT.png'})
                        .setDescription(msg)
                    ]
                });
            }
        }
    }
}

module.exports = LogsManager;