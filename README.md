# Cloudflare Workers using TypeScript and Webpack

## Background

[Cloudflare Workers][about-workers] allow you to run JavaScript around the world
on on Cloudflare's edge servers. This is a simple example and/or starting point
for creating a Cloudflare worker script using TypeScript and WebPack.

The [Cloudflare Worker API implements a subset][worker-api-reference] of the
[Service Worker API][service-worker-api] specification, therefore Service Worker
TypeScript types are usable.

[about-workers]:https://developers.cloudflare.com/workers/about/
[worker-api-reference]:https://developers.cloudflare.com/workers/reference/
[service-worker-api]:https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

## Packages

This project exists to develop, test and deploy three packages supporting the
development of Cloudflare Workers using TypeScript:

* `types-service-worker-mock` - Incomplete types for the
  `pinterest/service-worker-mock` to support Cloudflare Worker Testing. This may be pushed to the NPM `@types` project in the future, but needs additional work before that is reasonable.
* `types-cloudflare-worker` - Complete types for all public features provided by
  Cloudflare Workers. Supports the `Request.cf` object and the Cache API.
* `cloudflare-worker-mock` - Wraps `service-worker-mock` for name consistency
  developer experience and to provide a simple mockable Cache API
  implementation.

## Testing and deploying the packages

```bash
npm i
npm run test-all
scripts/publish.sh $VERSION $OTP # New version and 2FA
```

## Building the Worker(s)

There are two implementations of the same test worker in this repository.

### src/helloworker.ts

This is the development worker. It uses the local packages.

```bash
npm i
jest
npm run build
```

### demo/src/helloworker.ts

This is the demo worker. It uses the published packages. Reference it as an
example implementation and starting point for your project.

```bash
cd demo
npm i
jest
npm run build
```

## License

Licensed under the Apache License, Version 2.0.

© 2019 Udacity, Inc.

Content derived from Cloudflare Developer Documentation. © 2019 Cloudflare, Inc.
