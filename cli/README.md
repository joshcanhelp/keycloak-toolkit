# Keycloak CLI

This CLI tool can be used to make requests to a Keycloak server in order to get tokens, check configuration, and make API calls. It can be used for a locally-running server or one on a public networks. 

🚨🚨🚨 **Important note:** 🚨🚨🚨 If the tool is configured to call a production Keycloak server, the tokens it can return are sensitive and should only be used locally, then deleted.

## Getting Started <a id="start"></a>

First, [install Deno](https://docs.deno.com/runtime/getting_started/installation/) and make sure that it is ready using `deno --version`. VS Code users, see [this page](https://docs.deno.com/runtime/reference/vscode/) for additional setup.

Log into Keycloak as an administrator (or a user with the `manage-clients` role) and go to **Clients** > **Create Client**. Give it a Client ID, turn off all default capabilities, then **Save**. 

Different commands will need different client capabilities. If you're working with a local or development server, you can create a single client with all the capabilities below. In production, only enable the capabilities needed as indicated in the command documentation using the numbers below.

1️⃣ **Settings > Capability config > Authentication flow > Standard flow** checked
2️⃣ Add a valid URL to **Settings** tab **> Access settings > Valid redirect URIs**. The default local redirect URI is `http://localhost:8888`.
3️⃣ **Settings** tab **> Capability config > Client authentication** turned on
4️⃣ **Settings** tab **> Authentication flow > Service account roles** checked
5️⃣ **Settings** tab **> Capability config > Authentication flow > Direct access grant** checked
6️⃣ **Advanced** tab **> OpenID Connect Compatibility Modes > Use refresh tokens** turned on
7️⃣ **Service account roles** tab, **Assign role** button, add the `realm-management: view-events` role
8️⃣ **Service account roles** tab, **Assign role** button, add the `realm-management: manage-users` role

Now, copy the included `.example.env` to a `.env` file and add the necessary values. If you enabled client authentication for any of the commands, make sure to include the Client ID (**Settings** tab) and Client secret (**Credentials** tab).

## Commands

- [Tokens](./tokens/README.md)
- [Issuer](./issuer/README.md)