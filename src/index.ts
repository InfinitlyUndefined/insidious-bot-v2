import { Client } from "@lib/structures";
import { GatewayIntentBits, Partials } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.GuildMember, Partials.Message, Partials.User],
  commandsDir: "src/commands",
  listenersDir: "src/listeners",
  ownerIds: ["807741099367989308"],
});

await client.login(process.env.DISCORD_TOKEN);
