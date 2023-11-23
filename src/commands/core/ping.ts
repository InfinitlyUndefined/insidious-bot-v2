import { Command, CommandType } from "@lib/structures";
import { PermissionFlagsBits } from "discord.js";

export default new Command({
  name: "ping",
  description: "Pong!",
  type: CommandType.ChatInput,
  permissions: [PermissionFlagsBits.SendMessages],
  async callback(interaction) {
    return interaction.reply("Pong!");
  },
});
