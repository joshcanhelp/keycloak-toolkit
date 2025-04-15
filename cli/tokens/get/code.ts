import { randomBytes } from "node:crypto";
import { parseArgs } from "@std/cli/parse-args";

import { getConfig } from "../../utils/config.ts";
import { Logger } from "../../utils/logger.ts";
import { handleResponse, tokenFetch, TokenOutputTypes } from "./index.ts";

const {
  LOCAL_SERVER_PORT,
  KEYCLOAK_AUTHORIZE_URL,
  KEYCLOAK_CLIENT_ID,
} = getConfig();

const { output, scope } = parseArgs(
  Deno.args,
  {
    string: ["output", "scope"],
  },
);

const authorizeState = randomBytes(16).toString("hex");
const localBaseUrl = `http://localhost:${LOCAL_SERVER_PORT}`;
const authorizeUrl = new URL(KEYCLOAK_AUTHORIZE_URL);
authorizeUrl.searchParams.append("client_id", KEYCLOAK_CLIENT_ID);
authorizeUrl.searchParams.append("redirect_uri", localBaseUrl);
authorizeUrl.searchParams.append("response_type", "code");
authorizeUrl.searchParams.append("scope", scope || "openid email profile");
authorizeUrl.searchParams.append("state", authorizeState);

console.log("Follow this URL to authorize:");
console.log(authorizeUrl.toString());

Logger().debug(`Server running at http://localhost:${LOCAL_SERVER_PORT}`);

Deno.serve({ port: LOCAL_SERVER_PORT }, async (request) => {
  const requestUrl = new URL(request.url);

  if (!requestUrl.search) {
    return new Response("Waiting for callback response from Keycloak...");
  }

  const errorCode = requestUrl.searchParams.get("error");
  if (errorCode) {
    const errorMsg = `Error returned from the server: ${
      requestUrl.searchParams.get("error_description") || "No description"
    } (${errorCode})`;
    throw new Error(errorMsg);
  }

  const responseState = requestUrl.searchParams.get("state");
  const invalidState = !responseState || responseState !== authorizeState;
  if (invalidState) {
    const errorMsg =
      "Invalid or missing state parameter returned from Keycloak";
    throw new Error(errorMsg);
  }

  const authCode = requestUrl.searchParams.get("code");
  if (!authCode) {
    const errorMsg = "Missing auth code with valid state for some weird reason";
    throw new Error(errorMsg);
  }

  const tokenResponse = await tokenFetch({
    data: {
      code: authCode,
      grant_type: "authorization_code",
      redirect_uri: localBaseUrl,
      scope,
    },
  });

  handleResponse(tokenResponse, output as TokenOutputTypes);
  Deno.exit(0);
});
