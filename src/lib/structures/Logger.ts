import {
  type Color,
  cyanBright,
  gray,
  magentaBright,
  redBright,
  yellowBright,
} from "colorette";

export class Logger {
  private level: LogLevel = LogLevel.Info;

  public setLevel(level: LogLevel): void {
    this.level = level;
  }

  public getLevel(): LogLevel {
    return this.level;
  }

  public log(
    level: LogLevel,
    type: LogLevelString,
    color: Color,
    message: string,
    ...args: unknown[]
  ): void {
    if (level > this.level) return;
    console.log(
      `[${color(
        type.padStart(type.length + (7 - type.length) / 2).padEnd(7)
      )}] - ${message}`,
      ...args
    );
  }

  public info(message: string, ...args: unknown[]): void {
    this.log(LogLevel.Info, "INFO", cyanBright, message, ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    this.log(LogLevel.Warn, "WARN", yellowBright, message, ...args);
  }

  public error(message: string, ...args: unknown[]): void {
    this.log(LogLevel.Error, "ERROR", redBright, message, ...args);
  }

  public debug(message: string, ...args: unknown[]): void {
    this.log(LogLevel.Debug, "DEBUG", magentaBright, gray(message), ...args);
  }
}

export enum LogLevel {
  Debug,
  Info,
  Warn,
  Error,
}

export type LogLevelString = "INFO" | "DEBUG" | "WARN" | "ERROR";
