import { Logger } from "../utils/logger.ts";

export const run = async (args: string[]) => {
  const command = `${args.shift()}`;

  const getCmds = ["get", "getwith"];
  const jwtCmds = ["verify", "jwt"];
  const decodeCmds = ["decode", "base64"];

  if (getCmds.includes(command)) {
    Logger().debug("Running get ...");
    await (await import("./get/index.ts")).run(args);
  } else if (jwtCmds.includes(command)) {
    Logger().debug("Running verify ...");
    await (await import("./verify.ts")).run(`${args[0]}`);
  } else if (decodeCmds.includes(command)) {
    Logger().debug("Running decode ...");
    (await import("./decode.ts")).run(`${args[0]}`);
  } else {
    const validCmds = [...getCmds, ...jwtCmds, ...decodeCmds];
    throw new Error(`Valid commands are ${validCmds.join(", ")}`);
  }
};
