import { parseArgs } from "@std/cli/parse-args";
import {
  createRemoteJWKSet,
  jwtVerify,
} from "https://deno.land/x/jose@v5.9.6/index.ts";

import { getConfig } from "../utils/config.ts";
import { Logger } from "../utils/logger.ts";

const { introspect } = parseArgs(Deno.args, {
  boolean: ["introspect"],
});

const {
  KEYCLOAK_CLIENT_ID: clientId,
  KEYCLOAK_CLIENT_SECRET: clientSecret,
  KEYCLOAK_INTROSPECTION_URL: introspectUrl,
  KEYCLOAK_ISSUER: issuer,
  KEYCLOAK_JWKS_URL: jwksUrl,
} = getConfig();

export const run = async (rawJwt: string) => {
  if (!rawJwt) {
    Logger().error("Missing JWT in command args");
    Deno.exit(1);
  }

  let JWKS;
  try {
    JWKS = createRemoteJWKSet(new URL(jwksUrl));
  } catch (error) {
    Logger().error(`Could not get JWKS: ${(error as Error).message}`);
    Deno.exit(1);
  }

  try {
    const { payload } = await jwtVerify(rawJwt, JWKS, { issuer });
    Logger().object(payload);
  } catch (error) {
    Logger().error(`Error verifying JWT: ${(error as Error).message}`);
    Deno.exit(1);
  }

  if (!introspect || !clientId || !clientSecret) {
    Deno.exit();
  }

  const introspectData = new URLSearchParams();
  introspectData.append("client_id", clientId);
  introspectData.append("client_secret", clientSecret);
  introspectData.append("token", rawJwt);

  let tokenActive = false;
  try {
    const introspectResponse = await fetch(introspectUrl, {
      body: introspectData,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/jwt",
      },
    });
    tokenActive = (await introspectResponse.json()).active;
  } catch (error) {
    Logger().error(`Error introspecting JWT: ${(error as Error).message}`);
    Deno.exit(1);
  }

  if (tokenActive) {
    Logger().success("Token is active");
  } else {
    Logger().error("Token is inactive");
  }
};
