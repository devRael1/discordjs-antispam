import { EventEmitter } from 'events';
import {
    Client,
    PermissionResolvable,
    Snowflake,
    User,
    Guild,
    TextChannel,
    GuildMember,
    Message,
    DiscordAPIError,
    MessageEmbed,
    Role
} from 'discord.js';
import Logger from 'leekslazylogger';

declare module 'discordjs-antispam' {
    const _default: AntiSpam;
    export default _default;
    class AntiSpam extends EventEmitter {
        public client: Client;
        public options: AntiSpamOptions;
        public data: AntiSpamData;
        public log: Logger;
        constructor(client: Client, options?: AntiSpamOptions, log?: Logger, );

        public message(message: Message): Promise<boolean>;
        public reset(): AntiSpamData;

        public on(
            event: 'banAdd' | 'kickAdd' | 'warnAdd' | 'muteAdd',
            listener: (member: GuildMember) => any
        ): this;
        public on(
            event: 'spamThresholdBan' | 'spamThresholdKick' | 'spamThresholdWarn' | 'spamThresholdMute',
            listener: (member: GuildMember, duplicateMessages: boolean) => any
        ): this;
        public on(
            event: 'error',
            listener: (
                message: Message,
                error: DiscordAPIError,
                type: 'ban' | 'kick' | 'mute'
            ) => any
        ): this;
    }

    type AntiSpamData = {
        messageCache: {
            messageID: string;
            content: string;
            author: Snowflake;
            time: number;
        }[];
        bannedUsers: Snowflake[];
        kickedUsers: Snowflake[];
        warnedUsers: Snowflake[];
    };

    type AntiSpamOptions = {
        warnThreshold?: number;
        banThreshold?: number;
        kickThreshold?: number;
        muteThreshold?: number;
        maxInterval?: number;
        maxDuplicatesInterval?: number;
        warnMessage?: string | MessageEmbed;
        banMessage?: string | MessageEmbed;
        kickMessage?: string | MessageEmbed;
        muteMessage?: string | MessageEmbed;
        maxDuplicatesWarning?: number;
        maxDuplicatesBan?: number;
        maxDuplicatesKick?: number;
        maxDuplicatesMute?: number;
        maxDuplicatesWarn?: number;
        unMuteTime?: number;
        deleteMessagesAfterBanForPastDays?: number;
        ignoredPermissions?: PermissionResolvable[];
        ignoreBots?: boolean;
        verbose?: boolean;
        debug?: boolean;
        errorMessages?: boolean;
        kickErrorMessage?: string;
        banErrorMessage?: string;
        muteErrorMessage?: string;
        warnErrorMessage?: string;
        ignoredMembers?: Snowflake[] | ((user: User) => boolean);
        ignoredRoles?: (Snowflake | string)[] | ((role: Role) => boolean);
        ignoredGuilds?: Snowflake[] | ((guild: Guild) => boolean);
        ignoredChannels?: Snowflake[] | ((channel: TextChannel) => boolean);
        warnEnabled?: boolean;
        kickEnabled?: boolean;
        banEnabled?: boolean;
        muteEnabled?: boolean;
        modLogsChannelName?: string;
        modLogsEnabled?: boolean;
        removeMessages?: boolean;
    };
}