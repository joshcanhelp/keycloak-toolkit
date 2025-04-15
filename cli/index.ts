import { parseArgs } from "jsr:@std/cli/parse-args";
import { Logger } from "./utils/logger.ts";

const args = parseArgs(Deno.args)._ as string[];
const command = `${args.shift()}`;

if (["tokens", "token"].includes(command)) {
  Logger().debug("Running tokens ...");
  await (await import("./tokens/index.ts")).run(args);
  Deno.exit(0);
}

Logger().error(`Unknown command ${command}`);
Deno.exit(1);
