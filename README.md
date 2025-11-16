# Ionic + Juno + Google authentication

An experimental repo to try out Google Sign-In using Juno as a serverless backend in a mobile application.

Using Ionic, Capacitor, and the plugin [capacitor-social-login](https://github.com/Cap-go/capacitor-social-login) for testing purposes.

## Juno

The JS API is obviously not designed (yet) to support this use case. That is why it currently relies on a custom tarball that exposes a function `initContext`, which is not public (because developers should not normally need to use it).

During testing, once everything was relatively set up, I ran into the error `BadClaim: aud` because I was using a Satellite configured with a different Google client ID.

This made me realize that if we want to support a setup where a single Satellite can be used with Google login across web, iOS, Android, and other platforms, we will need to extend the configuration. Google generates different client IDs for different device types. By contrast, the current configuration only supports a single ID.

```rust
pub type OpenIdProviderClientId = String;

#[derive(Default, CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct OpenIdProviderConfig {
    pub client_id: OpenIdProviderClientId,
    pub delegation: Option<OpenIdProviderDelegationConfig>,
}
```

## iOS open issue

Once everything was correctly set up, the login still failed on iOS with the error:
`{"JwtVerify":{"BadClaim":"nonce"}}`.

This happens because the Capacitor plugin does not transmit the nonce to Google for signature verification.

Related issue: https://github.com/Cap-go/capacitor-social-login/issues/15
