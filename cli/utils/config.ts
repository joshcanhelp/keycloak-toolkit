
let configuration: {
  DEBUG_MODE: boolean;
  LOCAL_SERVER_PORT: number;
  KEYCLOAK_REALM: string;
  KEYCLOAK_CLIENT_ID: string;
  KEYCLOAK_CLIENT_SECRET: string;
  KEYCLOAK_BASE_URL: string;
  KEYCLOAK_API_URL: string;
  KEYCLOAK_ISSUER: string;
  KEYCLOAK_AUTHORIZE_URL: string;
  KEYCLOAK_TOKEN_URL: string;
  KEYCLOAK_INTROSPECTION_URL: string;
  KEYCLOAK_JWKS_URL: string;
  KEYCLOAK_CONFIGURATION_URL: string;
  KEYCLOAK_TEST_USER_USERNAME: string;
  KEYCLOAK_TEST_USER_PASSWORD: string;
};

export const getConfig = () => {
  if (configuration) {
    return configuration;
  }
  
  const DEBUG_MODE = ["yes", "true", "y"].includes(Deno.env.get("DEBUG") || "");
  const KEYCLOAK_BASE_URL = Deno.env.get("KEYCLOAK_BASE_URL") ||
    "http://localhost:8081";

  let keycloakBaseUrl;
  try {
    keycloakBaseUrl = new URL(KEYCLOAK_BASE_URL);
    if (!keycloakBaseUrl.host) {
      throw new Error();
    }
  } catch (_error) {
    console.error("Invalid KEYCLOAK_BASE_URL env var");
    Deno.exit(1);
  }

  const KEYCLOAK_REALM = Deno.env.get("KEYCLOAK_REALM") || "master";
  const keycloakRealmUrl = `${keycloakBaseUrl}/realms/${KEYCLOAK_REALM}`;
  const keycloakOidcUrl = `${keycloakRealmUrl}/protocol/openid-connect/`;

  configuration = {
    DEBUG_MODE,
    LOCAL_SERVER_PORT: parseInt(Deno.env.get("LOCAL_SERVER_PORT") || "8888", 10),
    KEYCLOAK_REALM,
    KEYCLOAK_CLIENT_ID: Deno.env.get("KEYCLOAK_CLIENT_ID") || "",
    KEYCLOAK_CLIENT_SECRET: Deno.env.get("KEYCLOAK_CLIENT_SECRET") || "",
    KEYCLOAK_BASE_URL: keycloakBaseUrl.toString(),
    KEYCLOAK_API_URL: `${keycloakBaseUrl}/admin/realms/${KEYCLOAK_REALM}/`,
    KEYCLOAK_ISSUER: keycloakRealmUrl,
    KEYCLOAK_AUTHORIZE_URL: keycloakOidcUrl + "auth",
    KEYCLOAK_TOKEN_URL: keycloakOidcUrl + "token",
    KEYCLOAK_INTROSPECTION_URL: keycloakOidcUrl + "token/introspect",
    KEYCLOAK_JWKS_URL: keycloakOidcUrl + "certs",
    KEYCLOAK_CONFIGURATION_URL: `${keycloakRealmUrl}/.well-known/openid-configuration`,
    KEYCLOAK_TEST_USER_USERNAME: "admin",
    KEYCLOAK_TEST_USER_PASSWORD: "admin",
  };

  return configuration;
};
