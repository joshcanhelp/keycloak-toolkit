import { Logger } from "../utils/logger.ts";

export const run = async (args: string[]) => {  
  const command = `${args.shift()}`;
  
  if (["get"].includes(command)) {
    Logger().debug("Running get ...");
    return await (await import("./get/index.ts")).run(args);
  }
  
  if (["verify", "jwt"].includes(command)) {
    Logger().debug("Running verify ...");
    return await (await import("./verify.ts")).run(`${args[0]}`);
  }
  
  if (["decode", "base64"].includes(command)) {
    Logger().debug("Running decode ...");
    return (await import("./decode.ts")).run(`${args[0]}`);
  }

  Logger().error(`Unknown command ${command}`);
  Deno.exit(1);
}