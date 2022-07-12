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
     * @returns {string|MessageEmbed}
     */
    format (string, message, reason = '') {
        if (typeof string === 'string') {
            const content = string.replace(/{@user}/g, message.author.toString())
                .replace(/{user_tag}/g, message.author.tag)
                .replace(/{server_name}/g, message.guild.name)
                .replace(/{reason}/g, reason)
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
            const modLogChannel = await this.client.channels.cache.get(options.modLogsChannel) || await this.client.channels.fetch(options.modLogsChannel);
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
        if (options.errorMessage.enabled) {
            const errorChannel = await this.client.channels.cache.get(options.modLogsChannel) || await this.client.channels.fetch(options.modLogsChannel);
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
            const verboseChannel = await this.client.channels.cache.get(options.modLogsChannel) || await this.client.channels.fetch(options.modLogsChannel);
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
}

module.exports = LogsManager;