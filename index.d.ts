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

declare module 'discordjs-antispam' {
    const _default: AntiSpamConstructor;
    export default _default;
    interface AntiSpamConstructor {
        new (client: Client, options?: AntiSpamOptions): AntiSpam;
    }
    class AntiSpam extends EventEmitter {
        public client: Client;
        public options: AntiSpamOptions;
        public data: AntiSpamData;

        constructor(client: Client, options?: AntiSpamOptions);

        /** Functions */
        public message(message: Message, options: AntiSpamOptions): Promise<boolean>;
        public message_wordfilter(message: Message, options: AntiSpamOptions): Promise<boolean>;
        public message_badWordsUsages(message: Message): Promise<string[]>;
        public reset(): AntiSpamData;
        public userLeave(member: GuildMember): void;

        /** All events (listeners) */
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
        customGuildOptions?: boolean;
        wordsFilter?: boolean;
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