# Get Tokens

These commands are used to obtain tokens.

- [Get a token for a Client](#client)
- [Get tokens for a user with an authorization code](#code)
- [Get new tokens with a refresh token](#refresh)
- [Get tokens for a user with ROPG](#ropg)

## Get a token for a Client <a id="client"></a>

This command is used to get an access token for a client using a `client_credentials` grant.

**Client requirements ([ref](https://github.com/joshcanhelp/keycloak-toolkit#start))**

3️⃣, 4️⃣

**Examples**

```bash
$ deno task run token getwith client

# Get an access token for a different client than the one in env
$ deno task run token getwith client --client_id "__CLIENT_ID__" --client_secret "__CLIENT_SECRET__"

# Ask for specific scopes in the token if using built-in authorization
$ deno task run token getwith client --scope "profile"

# Return the token endpoint response in JSON instead of an object
$ deno task run token getwith client --output "json"

# Only output a specific property
$ deno task --quiet run token getwith client --output "access_token"
$ deno task --quiet run token getwith client --output "expires_in"
```

## Get tokens for a user with an authorization code <a id="code"></a>

This command is used to get an access token for a client using an `authorization_code` grant. The command starts a server locally and outputs a URL to visit. Once you login, your browser should show a connection error and the outcome of the transaction will appear in the terminal.

**Client requirements ([ref](https://github.com/joshcanhelp/keycloak-toolkit#start))**

1️⃣, 2️⃣, 3️⃣

**Examples**

```bash
$ deno task run token getwith code

# Ask for specific scopes in the token
$ deno task run token getwith code --scope "openid email phone profile"

# Only output the access token
$ deno task --quiet run token getwith code --output "access_token"
```

## Get new tokens with a refresh token <a id="refresh"></a>

This command is used to get new tokens for a user with a refresh token.

**Client requirements ([ref](https://github.com/joshcanhelp/keycloak-toolkit#start))**

3️⃣, 6️⃣

**Examples**

```bash
$ deno task run token getwith refresh __REFRESH_TOKEN_GOES_HERE__

# Only output the new access token
$ deno task --quiet run token getwith refresh __REFRESH_TOKEN_GOES_HERE__ --output "access_token"
```

## Get tokens for a user with ROPG <a id="ropg"></a>

This command is used to get tokens for a user with their username and password. This method is [insecure and should not be used in production](https://datatracker.ietf.org/doc/html/rfc9700#name-resource-owner-password-cre) but can be useful for getting access tokens for testing.

**Client requirements ([ref](https://github.com/joshcanhelp/keycloak-toolkit#start))**

3️⃣, 5️⃣

**Examples**

```bash
$ deno task run token getwith ropg

# Use credentials for a different user than what's stored in env
$ deno task run token getwith ropg --username "__USERNAME__" --password "__PASSWORD__"

# Ask for specific scopes in the token
$ deno task run token getwith ropg --scope "openid email phone profile"

# Only output the access token
$ deno task --quiet run token getwith ropg --output "access_token"
```