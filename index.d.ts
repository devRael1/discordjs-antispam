import { EventEmitter } from 'events';
import {
    Client,
    PermissionResolvable,
    Snowflake,
    Collection,
    User,
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

    type maxDuplicatesObject = {
        warn?: number;
        mute?: number;
        kick?: number;
        ban?: number;
    }

    type MessageObject = {
        warn?: string | MessageEmbed;
        mute?: string | MessageEmbed;
        kick?: string | MessageEmbed;
        ban?: string | MessageEmbed;
    }

    type ErrorMessageObject = {
        enabled?: boolean;
        mute?: string;
        kick?: string;
        ban?: string;
    }

    type IngoreObject = {
        members?: Snowflake[] | ((user: User) => boolean);
        roles?: Snowflake[] | ((role: Role) => boolean);
        channels?: Snowflake[] | ((channel: TextChannel) => boolean);
        bots?: boolean;
    }

    type AntiSpamOptions = {
        customGuildOptions?: boolean;
        wordsFilter?: boolean;
        linksFilter?: LinksFilterObject;
        thresholds?: ThresholdsObject;
        maxInterval?: number;
        maxDuplicatesInterval?: number;
        maxDuplicates?: maxDuplicatesObject;
        message?: MessageObject;
        errorMessage?: ErrorMessageObject;
        unMuteTime?: number;
        deleteMessagesAfterBanForPastDays?: number;
        ignoredPermissions?: PermissionResolvable[];
        ignore?: IngoreObject;
        warnEnabled?: boolean;
        kickEnabled?: boolean;
        banEnabled?: boolean;
        muteEnabled?: boolean;
        modLogsChannelName?: string;
        modLogsEnabled?: boolean;
        removeMessages?: boolean;
        verbose?: boolean;
        debug?: boolean;
    };
}