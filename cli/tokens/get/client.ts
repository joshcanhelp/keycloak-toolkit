import { parseArgs } from "jsr:@std/cli/parse-args";
import { handleResponse, tokenFetch, TokenOutputTypes } from "./index.ts";

const {
  client_id: clientIdFlag,
  client_secret: clientSecretFlag,
  output,
  scope,
} = parseArgs(
  Deno.args,
  {
    string: ["client_id", "client_secret", "output", "scope"],
  },
);

export const run = async () => {
  const tokenResponse = await tokenFetch({
    data: {
      grant_type: "client_credentials",
      scope,
    },
    clientId: clientIdFlag,
    clientSecret: clientSecretFlag,
  });

  handleResponse(tokenResponse, output as TokenOutputTypes);
};
