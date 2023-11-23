import { Listener } from "@lib/structures";
import { InteractionType } from "discord.js";

export default new Listener({
  name: "interactionCreate",
  async callback(interaction) {
    const { client } = interaction;
    if (
      interaction.isChatInputCommand() ||
      interaction.isContextMenuCommand()
    ) {
      const command = client.commands.get(interaction.commandName);
      if (command) {
        if (command.ownerOnly && !client.ownerIds.includes(interaction.user.id))
          return;
        await command
          .callback(interaction)
          .catch((e) => client.logger.error(e.stack));
      }
    }

    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
      const command = client.commands.get(interaction.commandName);

      if (command && command.autoComplete) {
        if (command.ownerOnly && !client.ownerIds.includes(interaction.user.id))
          return;

        if (command.name !== interaction.commandName) return;

        await command
          .autoComplete(interaction)
          .catch((e) => client.logger.error(e.stack));
      }
    }
  },
});
