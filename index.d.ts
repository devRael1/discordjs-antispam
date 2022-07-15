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
    //DiscordAPIError,
    MessageEmbed,
    Role
} from 'discord.js';

type TypesSanction = 'ban' | 'kick' | 'mute' | 'warn';

interface AntiSpamDataMessages {
    messageID: Snowflake|string,
    guildID: Snowflake|string,
    authorID: Snowflake|string,
    channelID: Snowflake|string,
    content: string,
    sentTimestamp: number
}

interface AntiSpamData {
    messages: AntiSpamDataMessages[];
    bannedUsers: Snowflake[];
    kickedUsers: Snowflake[];
    warnedUsers: Snowflake[];
}

interface WordsFilterObject {
    enabled?: boolean;
    typeSanction?: TypesSanction;
}

interface LinksFilterObject {
    enabled?: boolean;
    globalLinksFilter?: boolean;
    customLinksFilter?: boolean;
    discordInviteLinksFilter?: boolean;
    typeSanction?: TypesSanction;
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
    logs?: string | MessageEmbed;
}

interface ErrorMessageObject {
    enabled?: boolean;
    mute?: string | MessageEmbed;
    kick?: string | MessageEmbed;
    ban?: string | MessageEmbed;
}

interface IngoreObject {
    members?: Snowflake[] | ((user: User) => boolean);
    roles?: Snowflake[] | ((role: Role) => boolean);
    channels?: Snowflake[] | ((channel: TextChannel) => boolean);
    permissions?: PermissionResolvable[];
    bots?: boolean;
}

interface EnableObject {
    warn?: boolean;
    mute?: boolean;
    kick?: boolean;
    ban?: boolean;
}

interface AntiSpamFilterObject {
    enabled?: boolean;
    thresholds?: ThresholdsObject;
    maxDuplicates?: maxDuplicatesObject;
    maxInterval?: number;
    maxDuplicatesInterval?: number;
}

interface AntiSpamOptions {
    customGuildOptions?: boolean;
    wordsFilter?: WordsFilterObject;
    linksFilter?: LinksFilterObject;
    antispamFilter?: AntiSpamFilterObject;
    message?: MessageObject;
    errorMessage?: ErrorMessageObject;
    unMuteTime?: number;
    deleteMessagesAfterBanForPastDays?: number;
    ignore?: IngoreObject;
    enable?: EnableObject;
    modLogsChannel?: string|Snowflake;
    modLogsEnabled?: boolean;
    removeMessages?: boolean;
    verbose?: boolean;
    debug?: boolean;
}

declare class AntiSpam extends EventEmitter {
    public client: Client;
    public options: AntiSpamOptions;
    public data: Collection<Snowflake, AntiSpamData>;

    constructor(client: Client, options?: AntiSpamOptions);

    /** Cache Message */
    public addMessagesCache(message: Message): Promise<AntiSpamData>;

    /** Functions Guilds Options Management */
    public getDefaultOptions(): AntiSpamOptions;
    public getGuildOptions(guild_id: string|Snowflake): AntiSpamOptions;
    public setGuildOptions(guild_id: string|Snowflake, options: AntiSpamOptions): Promise<AntiSpamOptions>;

    /** Function AntiSpam */
    public messageAntiSpam(message: Message): Promise<boolean>;

    /** Functions for Words Filter System */
    public messageWordsFilter(message: Message): Promise<boolean>;
    public messageBadWordsUsages(message: Message): Promise<string[]>;
    public addWords(words: string|string[], guild_id: string|Snowflake): Promise<boolean>;
    public removeWords(words: string|string[], guild_id: string|Snowflake): Promise<boolean>;
    public listWords(guild_id: string|Snowflake): Promise<string[]>;

    /** Functions for Links Filter System */
    public messageLinksFilter(message: Message): Promise<boolean>;
    public addLinks(links: string|string[], guild_id: string|Snowflake): Promise<boolean>;
    public removeLinks(links: string|string[], guild_id: string|Snowflake): Promise<boolean>;
    public listLinks(guild_id: string|Snowflake): Promise<string[]>;

    /** Functions utility */
    public resetGuild(guild_id: string|Snowflake): AntiSpamData;
    public resetAllCache(): Promise<Collection<string, AntiSpamData>>;
    public userLeave(member: GuildMember): void;

    /** All events (listeners) */
    public on(event: 'banAdd' | 'kickAdd' | 'warnAdd' | 'muteAdd', listener: (member: GuildMember, reason: string) => any): this;
    public on(event: 'spamThresholdBan' | 'spamThresholdKick' | 'spamThresholdWarn' | 'spamThresholdMute', listener: (member: GuildMember, duplicateMessages: boolean) => any): this;

    // TODO: Add support of error event with errors message system
    // public on(
    //     event: 'error',
    //     listener: (
    //         message: Message,
    //         error: DiscordAPIError,
    //         type: 'ban' | 'kick' | 'mute'
    //     ) => any
    // ): this;
}

export = AntiSpam;