import { ClientEvents } from "discord.js";

export class Listener<E extends keyof ClientEvents = keyof ClientEvents> {
  public readonly name: E;
  public readonly once: boolean;
  public callback: (...args: ClientEvents[E]) => Promise<unknown>;

  constructor(options: ListenerOptions<E>) {
    this.name = options.name;
    this.once = options.once ?? false;
    this.callback = options.callback as (
      ...args: ClientEvents[E]
    ) => Promise<unknown>;
  }
}

export interface ListenerOptions<E extends keyof ClientEvents> {
  name: E;
  once?: boolean;
  callback: (...args: ClientEvents[E]) => Promise<unknown>;
}
