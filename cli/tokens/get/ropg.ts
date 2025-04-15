import { parseArgs } from "jsr:@std/cli/parse-args";
import { getConfig } from "../../utils/config.ts";
import { handleResponse, tokenFetch, TokenOutputTypes } from "./index.ts";

const {
  KEYCLOAK_TEST_USER_USERNAME,
  KEYCLOAK_TEST_USER_PASSWORD,
} = getConfig();

const {
  username: usernameFlag,
  password: passwordFlag,
  output,
  audience,
  scope,
} = parseArgs(Deno.args, {
  string: ["username", "password", "output", "audience", "scope"],
});

export const run = async () => {
  const tokenResponse = await tokenFetch({
    data: {
      grant_type: "password",
      username: usernameFlag || KEYCLOAK_TEST_USER_USERNAME,
      password: passwordFlag || KEYCLOAK_TEST_USER_PASSWORD,
      audience,
      scope: scope || "openid email profile",
    },
  });

  handleResponse(tokenResponse, output as TokenOutputTypes);
};
