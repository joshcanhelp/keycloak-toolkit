import { parseArgs } from "@std/cli/parse-args";
import { getConfig } from "../utils/config.ts";
import { Logger } from "../utils/logger.ts";

const {
  KEYCLOAK_JWKS_URL,
} = getConfig();

const { kid } = parseArgs(Deno.args, {
  string: ["kid"],
});

export const getJwks = async () =>
  await (await fetch(KEYCLOAK_JWKS_URL)).json();

export const run = async () => {
  const jwksContents = await getJwks();

  if (kid) {
    const foundWebKey = jwksContents.keys.find((webKey: { kid: string }) =>
      webKey.kid === kid
    ) || {};
    if (!foundWebKey.kid) {
      throw new Error(`No key found for kid ${kid}`);
    }
    return Logger().object(foundWebKey);
  }

  Logger().object(jwksContents);
};
