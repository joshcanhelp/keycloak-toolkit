# Tokens

These commands are used to obtain and interact with tokens.

- [Get tokens](./get/README.md)
- [Verify a JWT](#verify)
- [Decode a JWT](#decode)

## Verify a JWT <a id="verify"></a>

This command is used to see if a JWT-formatted token is valid or not.

**Client requirements ([ref](https://github.com/joshcanhelp/keycloak-toolkit#start))**

3️⃣ if using the `--introspect` flag

**Examples**

```bash
$ deno task run token verify __JWT_GOES_HERE__

# Call the introspection endpoint for the authorization server
$ deno task run token verify __JWT_GOES_HERE__ --introspect

# Get an access token and see the contents
$ deno task run token verify $(deno --quiet task run token get client --output access_token)
```

## Decode a JWT <a id="decode"></a>

This command is used to see the contents of a token without checking whether a token is valid or not.

**Examples**

```bash
$ deno task run token decode __JWT_GOES_HERE__
```