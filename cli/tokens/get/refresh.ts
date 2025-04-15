import { parseArgs } from "jsr:@std/cli/parse-args";
import {
  handleResponse,
  TokenEndpointData,
  tokenFetch,
  TokenOutputTypes,
} from "./index.ts";
import { Logger } from "../../utils/logger.ts";

const { output, scope } = parseArgs(Deno.args, {
  string: ["output", "scope"],
});

export const run = async (refreshToken: string) => {
  if (!refreshToken) {
    Logger().error("Missing refresh token in command args");
    Deno.exit(1);
  }

  const tokenFetchData: TokenEndpointData = {
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  };

  if (scope) {
    tokenFetchData.scope = scope;
  }

  const tokenResponse = await tokenFetch({
    data: tokenFetchData,
  });

  handleResponse(tokenResponse, output as TokenOutputTypes);
};
