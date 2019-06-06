/*
Copyright 2019 Udacity, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// The class is separate file simply to show imports working
import { CloudflareWorkerKV } from 'types-cloudflare-worker';

// Declare a Named KV in the global scope. ref:
// https://developers.cloudflare.com/workers/kv/api/

// The name the KV is used to help you identify the namespace and must be unique
// within your account for this demo, we use countryCodeKV to represent the KV
// to store country code info.
declare global {
  const countryCodeKV: CloudflareWorkerKV;
}

export class HelloWorkerClass {
  private responseInit = {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  };

  public async handle(event: FetchEvent) {
    const cache = caches.default;
    const request = event.request;

    let response = await cache.match(request);

    if (!response) {
      const originResponse = await fetch(request, {
        cf: {
          cacheKey: 'hello-world',
          minify: {
            html: true,
          },
        },
      });
      let body = 'Hello ';

      if (originResponse.status === 200) {
        event.waitUntil(cache.put(request, originResponse));
        body = await originResponse.text();
      }
      countryCodeKV.put(request.cf.country, '!', { expiration: 100 });
      const countryCode = await countryCodeKV.get(request.cf.country);

      response = new Response(
        `${body} ${request.cf.country} ${countryCode}!`,
        this.responseInit,
      );
    }

    return response;
  }
}
export default HelloWorkerClass;
