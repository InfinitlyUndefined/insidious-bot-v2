import { Listener } from "@lib/structures";

export default new Listener({
  name: "ready",
  callback(client) {
    client.logger.info(`Logged in as ${client.user.tag}`);
  },
});
