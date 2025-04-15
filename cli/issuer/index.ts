import { Logger } from "../utils/logger.ts";

export const run = async (args: string[]) => {  
  const command = `${args.shift()}`;
  
  const configCmds = ["config", "configuration", "openid"];

  if (configCmds.includes(command)) {
    Logger().debug("Running get ...");
    return await (await import("./configuration.ts")).run();
  } else {
    const validCmds = [...configCmds];
    Logger().error(`Valid commands are ${validCmds.join(", ")}`);
    Deno.exit(1);
  }

  
}