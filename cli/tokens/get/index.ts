import { Logger } from "../../utils/logger.ts";
import { getConfig } from "../../utils/config.ts";

////
/// Types
//

type TokenGrantType =
  | "client_credentials"
  | "password"
  | "authorization_code"
  | "refresh_token";

export interface TokenEndpointData {
  grant_type: TokenGrantType;
  redirect_uri?: string;
  code?: string;
  audience?: string;
  scope?: string;
  username?: string;
  password?: string;
  refresh_token?: string;
}

interface TokenEndpointError {
  error: string;
  error_description: string;
}

interface TokenEndpointSuccess {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  id_token?: string;
  refresh_token?: string;
  refresh_expires_in?: number;
}

export type TokenOutputTypes =
  | "raw"
  | "json"
  | "access_token"
  | "refresh_token"
  | "id_token";

////
/// Setup
//

const {
  KEYCLOAK_CLIENT_ID,
  KEYCLOAK_CLIENT_SECRET,
  KEYCLOAK_TOKEN_URL,
} = getConfig();

////
/// Exports
//

export const run = async (args: string[]) => {
  const command = `${args.shift()}`;

  if (["client", "cc"].includes(command)) {
    Logger().debug("Running client credentials ...");
    return await (await import("./client.ts")).run();
  }

  if (["ropg", "direct"].includes(command)) {
    Logger().debug("Running ROPG login...");
    return await (await import("./ropg.ts")).run();
  }

  if (["authcode", "code", "browser"].includes(command)) {
    Logger().debug("Running auth code login ...");
    return (await import("./code.ts")).run();
  }

  if (["refresh"].includes(command)) {
    Logger().debug("Running refresh ...");
    return await (await import("./refresh.ts")).run(`${args[0]}`);
  }

  Logger().error(`Unknown command ${command}`);
  Deno.exit(1);
};

export const tokenFetch = async ({
  data,
  clientId = KEYCLOAK_CLIENT_ID,
  clientSecret = KEYCLOAK_CLIENT_SECRET,
}: {
  data: TokenEndpointData;
  clientId?: string;
  clientSecret?: string;
}): Promise<TokenEndpointError | TokenEndpointSuccess> => {
  if (
    (data.grant_type === "client_credentials" &&
      (!clientId || !clientSecret)) ||
    (data.grant_type === "password" && (!data.username || !data.password))
  ) {
    return {
      error: "missing_credentials",
      error_description: `Missing required credentials`,
    };
  }

  const formData = new URLSearchParams();
  for (const key in data) {
    formData.append(key, data[key as keyof TokenEndpointData] || "");
  }

  const fetchConfig = {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
  };

  const tokenResponse = await fetch(
    KEYCLOAK_TOKEN_URL,
    fetchConfig,
  );
  return await tokenResponse.json();
};

export const handleResponse = (
  tokenResponse: TokenEndpointError | TokenEndpointSuccess,
  output?: TokenOutputTypes,
) => {
  if ("error_description" in tokenResponse) {
    const { error, error_description: description } =
      tokenResponse as TokenEndpointError;
    Logger().error(description + (error ? ` (${error})` : ""));
    Deno.exit(1);
  }

  if (!output || "raw" === output) {
    Logger().object(tokenResponse);
    return;
  }

  if ("json" === output) {
    Logger().log(JSON.stringify(tokenResponse, null, 2));
    return;
  }

  // access_token, id_token, refresh_token
  Logger().log((tokenResponse as TokenEndpointSuccess)[output]!);
};
