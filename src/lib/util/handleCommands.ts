import { readdirSync } from "node:fs";
import type { Client, Command } from "@lib/structures";
import type {
  ApplicationCommandData,
  ApplicationCommandType,
} from "discord.js";

export async function initiateCommands(
  client: Client,
  register: boolean = false,
  sync: boolean = false
) {
  client.logger.info(`Syncing Commands...`);
  const now = Date.now();
  await Promise.all([
    register && registerCommands(client),
    sync && syncCommands(client),
  ]);
  const diff = Date.now() - now;
  client.logger.info(`Commands Synced in ${diff.toLocaleString()}ms`);
}

export async function handleRegistry(
  path: string,
  client: Client
): Promise<Command[]> {
  const commands: Command[] = [];

  const commandFiles = readdirSync(`${process.cwd()}/${path}`, {
    withFileTypes: true,
  });

  for (const file of commandFiles) {
    if (file.isDirectory()) {
      const subCommands = await handleRegistry(`${path}/${file.name}`, client);
      commands.push(...subCommands);
    } else {
      if (!file.name.endsWith(".js")) continue;
      const { default: command } = (await import(
        `${process.cwd()}/${path}/${file.name}`
      )) as {
        default: Command;
      };

      if (!command)
        throw new Error(
          `There is no default export in ${
            file.name
          }! \nPath: ${process.cwd()}/dist/${path}/${file.name}`
        );

      client.commands.set(command.name, command);

      commands.push(command);
    }
  }

  return commands;
}

async function registerCommands(client: Client) {
  const clientCommands = client.commands.values();

  for (const command of clientCommands) {
    checkFromClient(client, command);
  }
}

async function checkFromClient(client: Client, command: Command) {
  const { logger } = client;

  if (command.guildIds?.length) {
    for (const guildId of command.guildIds) {
      const guild = await client.guilds.fetch(guildId);

      if (!guild) throw new Error(`Guild ${guildId} not found!`);

      const APICommand = (await guild.commands.fetch()).find(
        (c) => c.name === command.name
      );

      const providedCommandData: ApplicationCommandData = {
        name: command.name,
        description: command.description,
        options: command.options,
        defaultMemberPermissions: command.permissions,
        dmPermission: command.guildOnly,
        type: command.type as unknown as ApplicationCommandType,
      };

      if (!APICommand) {
        await guild.commands.create(providedCommandData);
        logger.info(`Command ${command.name} created -> ${guild.name}`);
      }

      if (!APICommand?.equals(providedCommandData, true)) {
        await APICommand?.edit(providedCommandData);
        logger.info(`Command ${command.name} updated -> ${guild.name}`);
      }
    }
    logger.debug(`Command ${command.name} synced`);
    return;
  }

  const APICommand = (
    await (await client.application?.fetch())!.commands.fetch()
  ).find((c) => c.name === command.name);

  const providedCommandData: ApplicationCommandData = {
    name: command.name,
    description: command.description,
    options: command.options,
    defaultMemberPermissions: command.permissions,
    dmPermission: command.guildOnly,
    type: command.type as unknown as ApplicationCommandType,
  };

  if (!APICommand) {
    await client.application!.commands.create(providedCommandData);
    logger.info(`Command ${command.name} created`);
  } else {
    if (!APICommand.equals(providedCommandData, true)) {
      await APICommand.edit(providedCommandData);
      logger.info(`Command ${command.name} updated`);
    }
  }

  logger.debug(`Command ${command.name} synced`);
  return;
}

async function syncCommands(client: Client) {
  const { logger } = client;

  logger.debug("Fetching Global Commands");

  const localGlobalCommands = [
    ...client.commands.filter((c) => !c.guildIds).keys(),
  ];

  const APIGlobalCommands =
    await (await client.application?.fetch())!.commands.fetch();

  const APIGlobalCommandNames = APIGlobalCommands.map((c) => c.name);

  logger.debug("Comparing Global Commands to local data");

  const toRemove = APIGlobalCommandNames.filter(
    (c) => !localGlobalCommands.includes(c)
  );

  if (toRemove.length) {
    logger.debug(`Removing ${toRemove.length} Global Commands from API`);
  } else logger.debug(`No Global Commands found to remove, All synced!`);

  for (const command of toRemove) {
    logger.debug(`Deleted Global Command: ${command}`);
    APIGlobalCommands.find((cmd) => cmd.name === command)?.delete();
  }

  // Guild
  const guilds = [...client.guilds.cache.values()];

  for (const guild of guilds) {
    logger.debug(`Fetching Guild Commands for ${guild.name}`);

    const APIGuildCommands = await guild.commands.fetch();

    const localGuildCommands = [
      ...client.commands
        .filter((c) => Boolean(c.guildIds?.includes(guild.id)))
        .keys(),
    ];

    const APIGuildCommandsNames = APIGuildCommands.map((c) => c.name);

    logger.debug(`Comparing Guild Commands data to local data`);
    const toRemove = APIGuildCommandsNames.filter(
      (c) => !localGuildCommands.includes(c)
    );
    if (toRemove.length) {
      logger.debug(`Removing ${toRemove.length} Guild Commands from API`);
    } else
      logger.debug(
        `No Commands found to remove from Guild "${guild.name}", All synced!`
      );

    for (const command of toRemove) {
      logger.debug(`Deleted Guild Command ${command} -> ${guild.name}`);
      APIGuildCommands.find((cmd) => cmd.name === command)?.delete();
    }
  }
}
