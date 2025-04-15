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
    throw new Error("Missing JWT in command args");
  }

  const JWKS = createRemoteJWKSet(new URL(jwksUrl));
  const { payload } = await jwtVerify(rawJwt, JWKS, { issuer });
  Logger().object(payload);

  if (!introspect || !clientId || !clientSecret) {
    Deno.exit();
  }

  const introspectData = new URLSearchParams();
  introspectData.append("client_id", clientId);
  introspectData.append("client_secret", clientSecret);
  introspectData.append("token", rawJwt);

  const introspectResponse = await fetch(introspectUrl, {
    body: introspectData,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/jwt",
    },
  });

  if ((await introspectResponse.json()).active) {
    Logger().success("Token is active");
  } else {
    Logger().error("Token is inactive");
  }
};
