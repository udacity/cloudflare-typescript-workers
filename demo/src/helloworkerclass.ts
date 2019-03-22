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

      response = new Response(
        `${body} ${request.cf.country}!`,
        this.responseInit,
      );
    }

    return response;
  }
}
export default HelloWorkerClass;
