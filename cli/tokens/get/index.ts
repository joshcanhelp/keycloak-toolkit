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

  const clientCmds = ["client", "cc"];
  const codeCmds = ["authcode", "code", "browser", "login"];
  const refreshCmds = ["refresh"];
  const ropgCmds = ["ropg", "direct"];

  if (clientCmds.includes(command)) {
    Logger().debug("Running client credentials ...");
    await (await import("./client.ts")).run();
  } else if (ropgCmds.includes(command)) {
    Logger().debug("Running ROPG login...");
    await (await import("./ropg.ts")).run();
  } else if (codeCmds.includes(command)) {
    Logger().debug("Running auth code login ...");
    await import("./code.ts");
  } else if (refreshCmds.includes(command)) {
    Logger().debug("Running refresh ...");
    await (await import("./refresh.ts")).run(args[0]);
  } else {
    const validCmds = [...clientCmds, ...ropgCmds, ...codeCmds, ...refreshCmds];
    throw new Error(`Valid commands are ${validCmds.join(", ")}`);
  }
};

////
/// Standard token endpoint interactions
//
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
    const formValue = data[key as keyof TokenEndpointData];
    if (formValue) {
      formData.append(key, formValue);
    }
  }

  Logger().debug("POST body:");
  Logger().debug("  " + formData.toString().replaceAll("&", "\n  "));

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

////
/// Handle token endpoint response
//
export const handleResponse = (
  tokenResponse: TokenEndpointError | TokenEndpointSuccess,
  output?: TokenOutputTypes,
) => {
  if ("error_description" in tokenResponse) {
    const { error, error_description: description } =
      tokenResponse as TokenEndpointError;
    throw new Error(description + (error ? ` (${error})` : ""));
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
