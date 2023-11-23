import type { ClientEvents, Awaitable } from "discord.js";

export class Listener<E extends keyof ClientEvents = keyof ClientEvents> {
  public readonly name: E;
  public readonly once: boolean;
  public callback: (...args: ClientEvents[E]) => Awaitable<void>;

  constructor(options: ListenerOptions<E>) {
    this.name = options.name;
    this.once = options.once ?? false;
    this.callback = options.callback as (
      ...args: ClientEvents[E]
    ) => Awaitable<void>;
  }
}

export interface ListenerOptions<E extends keyof ClientEvents> {
  name: E;
  once?: boolean;
  callback: (...args: ClientEvents[E]) => Awaitable<void>;
}
