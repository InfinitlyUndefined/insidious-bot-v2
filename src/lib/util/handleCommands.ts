import { readdirSync } from "node:fs";
import type { Client, Command } from "@lib/structures";

export async function getCommands(
  path: string,
  client: Client
): Promise<Command[]> {
  const commands: Command[] = [];

  const commandFiles = readdirSync(`${process.cwd()}/${path}`, {
    withFileTypes: true,
  });

  for (const file of commandFiles) {
    if (file.isDirectory()) {
      const subCommands = await getCommands(`${path}/${file.name}`, client);
      commands.push(...subCommands);
    } else {
      if (!file.name.endsWith(".js")) continue;
      const { default: command } = (await import(
        `${process.cwd()}/${path}/${file.name}`
      )) as {
        default: Command;
      };

      client.commands.set(command.name, command);

      commands.push(command);
    }
  }

  return commands;
}
