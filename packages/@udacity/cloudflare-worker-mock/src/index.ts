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

// Primarily exists to implement the Cache API:
// https://developers.cloudflare.com/workers/reference/cache-api/

// Import the service-worker-mock types.
/// <reference types="@udacity/types-service-worker-mock" />
// Import the service-worker-mock global augmentations.
import '@udacity/types-service-worker-mock/global';

import {
  CloudflareCacheQueryOptions,
  CloudflareWorkerGlobalKVPatch,
  CloudflareWorkerGlobalScopePatch,
  CloudflareWorkerKV,
} from '@udacity/types-cloudflare-worker';
import makeServiceWorkerEnv from 'service-worker-mock';
import { EnvOptions } from 'service-worker-mock';

/**
 * Create a mock environment for a Cloudflare Worker with a mockable cache layer.
 */
export function makeCloudflareWorkerEnv(
  envOptions?: EnvOptions,
): CloudflareWorkerGlobalScopePatch {
  const serviceWorkerEnv = makeServiceWorkerEnv(envOptions);
  const cloudflareWorkerEnv = serviceWorkerEnv as CloudflareWorkerGlobalScopePatch;

  cloudflareWorkerEnv.caches = {
    default: {
      put(_request: Request, _response: Response): Promise<undefined> {
        return new Promise<undefined>((resolve, _reject) => {
          resolve(undefined);
        });
      },
      match(
        _request: Request,
        _options?: CloudflareCacheQueryOptions,
      ): Promise<Response | undefined> {
        return new Promise<undefined>((resolve, _reject) => {
          resolve(undefined);
        });
      },
      delete(
        _request: Request,
        _options?: CloudflareCacheQueryOptions,
      ): Promise<boolean> {
        return new Promise<boolean>((resolve, _reject) => {
          resolve(false);
        });
      },
    },
  };

  return cloudflareWorkerEnv;
}

/**
 * Create a mock KV for a Cloudflare Worker
 */
export function makeCloudflareWorkerKVEnv(
  name: string,
): CloudflareWorkerGlobalKVPatch {
  const cloudflareWorkerKV: CloudflareWorkerKV = {
    get(
      _key: string,
      _type?: 'text' | 'json' | 'arrayBuffer' | 'stream',
    ): Promise<string | any | ArrayBuffer | ReadableStream> {
      return Promise.resolve(undefined);
    },
    put(
      _key: string,
      _value: string | ReadableStream | ArrayBuffer | FormData,
    ): Promise<void> {
      return Promise.resolve(undefined);
    },
    delete(_key: string): Promise<void> {
      return Promise.resolve(undefined);
    },
  };

  const cloudflareWorkerKVEnv = {
    [name]: cloudflareWorkerKV,
  };
  return cloudflareWorkerKVEnv;
}

export default makeCloudflareWorkerEnv;
