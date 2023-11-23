import {
  type ClientOptions,
  Collection,
  Client as DJSClient,
} from "discord.js";
import { Command, Listener, Logger } from "@lib/structures";
import { handleRegistry, initiateCommands, handleListeners } from "@lib/util";

export class Client<Ready extends boolean = boolean> extends DJSClient<Ready> {
  public readonly commands = new Collection<string, Command>();
  public readonly customListeners = new Collection<string, Listener>();
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
    await handleRegistry(this.commandsDir, this);
    await handleListeners(this.listenersDir, this);
    const promiseString = await super.login(token);
    await initiateCommands(this, true, true);
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
    customListeners: Collection<string, Listener>;
    logger: Logger;
  }
}
