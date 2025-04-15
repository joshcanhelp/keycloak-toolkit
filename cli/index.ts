import { parseArgs } from "jsr:@std/cli/parse-args";
import { Logger } from "./utils/logger.ts";

const args = parseArgs(Deno.args)._ as string[];
const command = `${args.shift()}`;

Logger().error(`Unknown command ${command}`);
Deno.exit(1);
