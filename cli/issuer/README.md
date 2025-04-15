# Issuer

These commands are used to interact with public endpoints on the authorization server.

- [Get configuration](#config)
- [Get JWKS](#jwks)

## Get configuration <a id="config"></a>

This command is used to pull down the public configuration data.

**Examples**

```bash
$ deno task run issuer config
```

## Get JWKS <a id="jwks"></a>

This command is used to pull down the public key data.

**Examples**

```bash
$ deno task run issuer jwks

# Get the keys for a specific key ID
$ deno task run issuer jwks --kid "__KID_REQUESTED__"
```