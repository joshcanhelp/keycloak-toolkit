import { Logger } from "../utils/logger.ts";

export const run = async (args: string[]) => {
  const command = `${args.shift()}`;

  const configCmds = ["config", "configuration", "openid"];
  const jwksCmds = ["jwks", "keys"];

  if (configCmds.includes(command)) {
    Logger().debug("Running config ...");
    return await (await import("./configuration.ts")).run();
  } else if (jwksCmds.includes(command)) {
    Logger().debug("Running jwks ...");
    return await (await import("./jwks.ts")).run();
  } else {
    const validCmds = [...configCmds];
    throw new Error(`Valid commands are ${validCmds.join(", ")}`);
  }
};
