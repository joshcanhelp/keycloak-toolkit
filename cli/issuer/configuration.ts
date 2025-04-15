import { parseArgs } from "@std/cli/parse-args";
import { getConfig } from "../utils/config.ts";
import { Logger } from "../utils/logger.ts";

const {
  KEYCLOAK_CONFIGURATION_URL,
} = getConfig();

const { property, keys } = parseArgs(Deno.args, {
  string: ["property"],
  boolean: ["keys"],
});

export const getOidcConfig = async () =>
  await (await fetch(KEYCLOAK_CONFIGURATION_URL)).json();

export const run = async () => {
  const oidcConfig = await getOidcConfig();

  if (keys) {
    return Logger().object(Object.keys(oidcConfig));
  }

  if (!property) {
    return Logger().object(oidcConfig);
  }

  return Logger().object(oidcConfig[property]);
};
