import { parseArgs } from "jsr:@std/cli/parse-args";
import { Logger } from "./utils/logger.ts";

const args = parseArgs(Deno.args)._ as string[];
const command = `${args.shift()}`;
const tokenCmds = ["tokens", "token"];
const serverCmds = ["server", "issuer"];

if (tokenCmds.includes(command)) {
  Logger().debug("Running tokens ...");
  await (await import("./tokens/index.ts")).run(args);
} else if (serverCmds.includes(command)) {
  Logger().debug("Running issuer ...");
  await (await import("./issuer/index.ts")).run(args);
} else {
  const validCmds = [...tokenCmds, ...serverCmds];
  Logger().error(`Valid commands are ${validCmds.join(", ")}`);
  Deno.exit(1);
}
