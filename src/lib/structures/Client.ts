import {
  type ClientOptions,
  Collection,
  Client as DJSClient,
} from "discord.js";
import { Command } from "./Command";
import { Listener } from "./Listener";
import { Logger } from "./Logger";

export class Client<Ready extends boolean = boolean> extends DJSClient<Ready> {
  public readonly commands = new Collection<string, Command>();
  public readonly listener = new Collection<string, Listener>();
  public readonly ownerIds: string[] = [];
  public readonly commandsDir: string;
  public readonly listenersDir: string;
  public logger: Logger = new Logger();

  public constructor(options: ExtendedClientOptions) {
    super(options);
    this.ownerIds = options.ownerIds ?? [];
    this.commandsDir = options.commandsDir;
    this.listenersDir = options.listenersDir;
  }

  public override async login(token?: string | undefined): Promise<string> {
    const promiseString = await super.login(token);
    return promiseString;
  }
}

interface ExtendedClientOptions extends ClientOptions {
  commandsDir: string;
  listenersDir: string;
  ownerIds?: string[];
}

declare module "discord.js" {
  interface Client {
    ownerIds: string[];
    commands: Collection<string, Command>;
    listener: Collection<string, Listener>;
    logger: Logger;
  }
}
