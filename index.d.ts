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

interface AntiSpamData {
    messageCache: {
        messageID: string;
        content: string;
        author: Snowflake;
        time: number;
    }[];
    bannedUsers: Snowflake[];
    kickedUsers: Snowflake[];
    warnedUsers: Snowflake[];
}

interface LinksFilterObject {
    globalLinksFilter?: boolean;
    customLinksFilter?: boolean;
    discordInviteLinksFilter?: boolean;
}

interface ThresholdsObject {
    warn?: number;
    mute?: number;
    kick?: number;
    ban?: number;
}

interface maxDuplicatesObject {
    warn?: number;
    mute?: number;
    kick?: number;
    ban?: number;
}

interface MessageObject {
    warn?: string | MessageEmbed;
    mute?: string | MessageEmbed;
    kick?: string | MessageEmbed;
    ban?: string | MessageEmbed;
}

interface ErrorMessageObject {
    enabled?: boolean;
    mute?: string;
    kick?: string;
    ban?: string;
}

interface IngoreObject {
    members?: Snowflake[] | ((user: User) => boolean);
    roles?: Snowflake[] | ((role: Role) => boolean);
    channels?: Snowflake[] | ((channel: TextChannel) => boolean);
    permissions?: PermissionResolvable[];
    bots?: boolean;
}

interface EnableObjecty {
    warn?: boolean;
    mute?: boolean;
    kick?: boolean;
    ban?: boolean;
}

interface AntiSpamOptions {
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
    ignore?: IngoreObject;
    enable?: EnableObjecty;
    modLogsChannelName?: string;
    modLogsEnabled?: boolean;
    removeMessages?: boolean;
    verbose?: boolean;
    debug?: boolean;
}

declare class AntiSpam extends EventEmitter {
    public client: Client;
    public options: AntiSpamOptions;
    public data: AntiSpamData;

    constructor(client: Client, options?: AntiSpamOptions);

    /** Functions Guilds Options Management */
    public getGuildOptions(guildId: string): Promise<AntiSpamOptions>;
    public setGuildOptions(guildId: string, options: AntiSpamOptions): Promise<AntiSpamOptions>;

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

export = AntiSpam;