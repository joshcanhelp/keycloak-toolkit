import { Logger } from "../utils/logger.ts";

export const run = async (args: string[]) => {  
  const command = `${args.shift()}`;
  
  if (["config", "configuration", "openid"].includes(command)) {
    Logger().debug("Running get ...");
    return await (await import("./configuration.ts")).run();
  }

  Logger().error(`Unknown command ${command}`);
  Deno.exit(1);
}