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

/*
 * There are two options for using ServiceWorker types, both with hassles. We
 * are using the webworker library method instead of the types-serviceworker
 * package.
 *
 * Option 1: WebWorker library included with TypeScript
 * tsc --lib es5,webworker # or anything es5+
 *
 * But it requires:
 *   export default null;
 *   declare var self: ServiceWorkerGlobalScope;
 *
 * ref:
 * https://github.com/Microsoft/TypeScript/issues/14877#issuecomment-340279293
 *
 * Option 2: types-serviceworker package
 *
 * src:
 * https://github.com/Microsoft/TypeScript/issues/11781#issuecomment-449617791
 *
 * types-serviceworker could be referenced in tsconfig.json, but that may lead
 * to confusion because: "If types is specified, only packages listed will be
 * included."
 * ref:
 * https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
 */

import { CloudflareWorkerGlobalScope } from '@udacity/types-cloudflare-worker';
declare var self: CloudflareWorkerGlobalScope;

import makeCloudflareWorkerEnv from '@udacity/cloudflare-worker-mock';

describe('helloworker', () => {
  beforeEach(() => {
    // Merge the Cloudflare Worker Environment into the global scope.
    Object.assign(global, makeCloudflareWorkerEnv());
    // Clear all module imports.
    jest.resetModules();
    // Import and init the Worker.
    jest.requireActual('../src/helloworker');
  });

  it('should add listeners', async () => {
    expect(self.listeners.get('fetch')).toBeDefined();
  });

  it('should return Hello US!', async () => {
    fetchMock.mockResponseOnce('Hello');

    let putCalled = false;
    // Replace the default put() implementation.
    // TODO: Make this cleaner.
    caches.default.put = (
      _request: Request,
      _response: Response,
    ): Promise<undefined> => {
      putCalled = true;
      return new Promise<undefined>((resolve, _reject) => {
        resolve(undefined);
      });
    };

    const request = new Request('/path');
    request.cf = {
      colo: 'SFO',
      country: 'US',
      tlsCipher: 'AES GCM',
      tlsVersion: '1.3',
    };
    const response = await self.trigger('fetch', request);

    expect(fetchMock).toBeCalledTimes(1);
    expect(response[0].status).toBe(200);
    expect(await response[0].text()).toBe('Hello US!');
    expect(putCalled).toBe(true);
  });
});
