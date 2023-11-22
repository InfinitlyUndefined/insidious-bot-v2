import { readdirSync } from "node:fs";
import type { Client, Listener } from "@lib/structures";

export async function handleListeners(
  path: string,
  client: Client
): Promise<Listener[]> {
  const listeners: Listener[] = [];

  const listenerFiles = readdirSync(`${process.cwd()}/${path}`, {
    withFileTypes: true,
  });

  for (const file of listenerFiles) {
    if (file.isDirectory()) {
      const subListeners = await handleListeners(
        `${path}/${file.name}`,
        client
      );
      listeners.push(...subListeners);
    } else {
      if (!file.name.endsWith(".js")) continue;
      const { default: listener } = (await import(
        `${process.cwd()}/${path}/${file.name}`
      )) as {
        default: Listener;
      };

      client.listener.set(listener.name, listener);

      listeners.push(listener);
    }
  }

  return listeners;
}
