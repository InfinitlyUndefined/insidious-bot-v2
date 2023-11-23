import {
  type ApplicationCommandOptionData,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  type PermissionResolvable,
  UserContextMenuCommandInteraction,
} from "discord.js";

export class Command<T extends CommandType = CommandType> {
  public readonly type: CommandType;
  public readonly name: string;
  public readonly description: string;
  public readonly options?: ApplicationCommandOptionData[];
  public readonly permissions?: PermissionResolvable[];
  public readonly ownerOnly?: boolean;
  public readonly guildOnly?: boolean;
  public readonly guildIds?: string[];
  public readonly nsfw?: boolean;
  public callback: (interaction: RunType[T]) => Promise<unknown>;
  public autoComplete?: (
    interaction: AutocompleteInteraction
  ) => Promise<unknown>;

  constructor(options: CommandOptions<T>) {
    this.type = options.type;
    this.name = options.name;
    this.description = options.description ?? "";
    this.permissions = options.permissions;
    this.ownerOnly = options.ownerOnly;
    this.guildOnly = options.guildOnly ?? false;
    this.guildIds = options.guildIds;
    this.nsfw = options.nsfw ?? false;
    this.callback = options.callback as (
      interaction: RunType[T]
    ) => Promise<unknown>;

    if (options.type === CommandType.ChatInput) {
      this.options = options.options ?? [];
      this.autoComplete = options.autoComplete;
    }
  }
}

export enum CommandType {
  ChatInput = 1,
  User = 2,
  Message = 3,
}

export type RunType = {
  [CommandType.ChatInput]: ChatInputCommandInteraction;
  [CommandType.User]: UserContextMenuCommandInteraction;
  [CommandType.Message]: MessageContextMenuCommandInteraction;
};

export interface DefaultCommandOptions<T extends CommandType> {
  type: T;
  name: string;
  description?: string;
  permissions?: PermissionResolvable[];
  ownerOnly?: boolean;
  guildOnly?: boolean;
  guildIds?: string[];
  nsfw?: boolean;
  callback: (interaction: RunType[T]) => Promise<unknown>;
}

export interface ChatInputCommandOptions
  extends DefaultCommandOptions<CommandType.ChatInput> {
  description: string;
  options?: ApplicationCommandOptionData[];
  autoComplete?: (interaction: AutocompleteInteraction) => Promise<unknown>;
}

export type CommandOptions<T extends CommandType> =
  T extends CommandType.ChatInput
    ? ChatInputCommandOptions
    : DefaultCommandOptions<T>;
