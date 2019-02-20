# A tested Cloudflare Worker using TypeScript and Webpack

## Background

[Cloudflare Workers][about-workers] allow you to run JavaScript around the world
on on Cloudflare's edge servers. This is a simple example and/or starting point
for creating a Cloudflare worker script using TypeScript and WebPack.

The [Cloudflare Worker API implements a subset][worker-api-reference] of the [Service Worker
API][service-worker-api] specification, therefore Service Worker TypeScript types are usable.

[about-workers]:https://developers.cloudflare.com/workers/about/
[worker-api-reference]:https://developers.cloudflare.com/workers/reference/
[service-worker-api]:https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

## Building

```bash
npm i
npm run build
```
