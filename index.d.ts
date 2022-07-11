import { EventEmitter } from 'events';
import {
    Client,
    PermissionResolvable,
    Snowflake,
    Collection,
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

        /** Function AntiSpam */
        public message(message: Message, options: AntiSpamOptions): Promise<boolean>;

        /** Functions for Words Filter System */
        public messageWordsFilter(message: Message, options: AntiSpamOptions): Promise<boolean>;
        public messageBadWordsUsages(message: Message): Promise<string[]>;
        public addWords(words: string|string[], guild_id: string): Promise<boolean>;
        public removeWords(words: string|string[], guild_id: string): Promise<boolean>;

        /** Functions for Links Filter System */
        public messageLinksFilter(message: Message, options: AntiSpamOptions): Promise<boolean>;
        public addLinks(links: string|string[], guild_id: string): Promise<boolean>;
        public removeLinks(links: string|string[], guild_id: string): Promise<boolean>;

        /** Functions utility */
        public resetGuild(guild_id: string): AntiSpamData;
        public resetAllCache(): Promise<Collection<string, AntiSpamData>>;
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

    type LinksFilterObject = {
        globalLinksFilter?: boolean;
        customLinksFilter?: boolean;
        discordInviteLinksFilter?: boolean;
    }

    type ThresholdsObject = {
        warn?: number;
        mute?: number;
        kick?: number;
        ban?: number;
    }

    type AntiSpamOptions = {
        customGuildOptions?: boolean;
        wordsFilter?: boolean;
        linksFilter?: LinksFilterObject;
        thresholds?: ThresholdsObject;
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