# Cloudflare Workers with TypeScript and Webpack

_**Retired: as of 2022, Cloudflare's official types package
[`@cloudflare/workers-types`](https://github.com/cloudflare/workers-types)
is more up-to-date and better supported.**_

[Cloudflare Workers][about-workers] allow you to run JavaScript on Cloudflare's
edge servers around the world. You can modify your site’s HTTP requests and
responses, make parallel requests, or generate responses from the edge. This
project develops, tests, and deploys NPM packages supporting the development of
Cloudflare Workers using TypeScript.

[Get started on your own TypeScript Cloudflare Worker using the
Template.][starter-template]

* [`types-cloudflare-worker`][types-cloudflare-worker] - Complete types for all
  public features provided by Cloudflare Workers. Supports the `Request.cf`
  object, the Cache API and KV API.
* [`cloudflare-worker-mock`][cloudflare-worker-mock] - Wraps
  `service-worker-mock` for name consistency, developer experience and to
  provide a simple mockable Cache API and KV API implementation.
* [`@udacity/types-service-worker-mock`][types-service-worker-mock] - Incomplete
  types for the `pinterest/service-worker-mock` to support Cloudflare Worker
  Testing. May be pushed to the NPM `@types` project in the future, but needs
  additional work before that is reasonable.

The [Cloudflare Worker API implements a subset][worker-api-reference] of the
[Service Worker API][service-worker-api] specification, therefore Service Worker
TypeScript types are a useful starting point.

[about-workers]:https://developers.cloudflare.com/workers/about/
[starter-template]:https://github.com/udacity/cloudflare-typescript-worker-template
[types-service-worker-mock]:https://www.npmjs.com/package/@udacity/types-service-worker-mock
[types-cloudflare-worker]:https://www.npmjs.com/package/types-cloudflare-worker
[cloudflare-worker-mock]:https://www.npmjs.com/package/cloudflare-worker-mock
[worker-api-reference]:https://developers.cloudflare.com/workers/reference/
[service-worker-api]:https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

## Example

A small example of a strictly typed worker:

```typescript
import CloudflareWorkerGlobalScope from 'types-cloudflare-worker';
declare var self: CloudflareWorkerGlobalScope;

export class Worker {
  public async handle(event: FetchEvent) {
    const originResponse = fetch(event.request, {
      cf: {
        minify: {
          html: true,
        },
      },
    });

    return originResponse;
  }
}

self.addEventListener('fetch', (event: FetchEvent) => {
  const worker = new Worker();
  event.respondWith(worker.handle(event));
});
```

## Getting started

Start with the [Starter Template][starter-template] or run the following
commands:

```bash
npm init
# Add TypeScript
npm i -D \
  typescript \
  @types/node
# Setup the Cloudflare Worker Types and Mock
npm i -D \
  @udacity/types-service-worker-mock \
  types-cloudflare-worker \
  cloudflare-worker-mock

# Init TypeScript
tsc --init
```

Set the TypeScript compiler options in `tsconfig.json`:

```js
"compilerOptions": {
  /* https://developers.cloudflare.com/workers/reference/ */
  /* Cloudflare Workers use the V8 JavaScript engine from Google Chrome. The
    * Workers runtime is updated at least once a week, to at least the version
    * that is currently used by Chrome’s stable release. This means you can
    * safely use latest JavaScript features, with no need for "transpilers".
    */
  "target": "ESNext",
  /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017','ES2018' or 'ESNEXT'. */
  "module": "commonjs",
  /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'. */
  "lib": ["esnext", "webworker"],
  /* Specify library files to be included in the compilation. */

  /* Recommend enabling all Strict Type-Checking Options and Additional Checks */
}
```

## Building the Worker(s)

There are two implementations of the same test worker in this repository.

### demo/src/helloworker.ts

This is the demo worker. It uses the published packages. Reference it as an
example implementation and starting point for your project.

```bash
cd demo
npm i
jest
npm run build
```

### src/helloworker.ts

This is the development worker. It uses the local packages.

```bash
npm i
jest
npm run build
```

## Testing and deploying the packages

```bash
npm i
npm run test-all
scripts/publish.sh $VERSION $OTP # New version and 2FA
```

## Author

Brad Erickson ([@13rac1](https://github.com/13rac1))

## License

Licensed under the Apache License, Version 2.0.

© 2019 Udacity, Inc.

Content derived from Cloudflare Developer Documentation. © 2019 Cloudflare, Inc.
