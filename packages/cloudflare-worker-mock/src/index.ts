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

import makeServiceWorkerEnv from 'service-worker-mock';
import { EnvOptions } from 'service-worker-mock';
import {
  CloudflareCacheQueryOptions,
  CloudflareRequestAttributes,
  CloudflareWorkerGlobalKVPatch,
  CloudflareWorkerGlobalScopePatch,
  CloudflareWorkerKV,
  CloudflareWorkerKVList,
  MockCloudflareRequestInit,
} from 'types-cloudflare-worker';

/**
 * Create a mock environment for a Cloudflare Worker with a mockable cache layer.
 */
export function makeCloudflareWorkerEnv(
  envOptions?: EnvOptions,
): CloudflareWorkerGlobalScopePatch {
  const serviceWorkerEnv = makeServiceWorkerEnv(envOptions);
  const cloudflareWorkerEnv =
    serviceWorkerEnv as CloudflareWorkerGlobalScopePatch;

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
    list(
      _params:
        | {
            prefix?: string | undefined;
            limit?: number | undefined;
            cursor?: string | undefined;
          }
        | undefined,
    ): Promise<CloudflareWorkerKVList> {
      return Promise.resolve({
        cursor: '1234567890',
        keys: [{ name: 'foo', expiration: 1234 }],
        list_complete: true,
      });
    },
  };

  const cloudflareWorkerKVEnv = {
    [name]: cloudflareWorkerKV,
  };
  return cloudflareWorkerKVEnv;
}

/**
 * Create a mock Request for a Cloudflare Worker
 *
 * A CloudflareRequestAttributes object can be created manually, but it requires
 * the developer to specify every field. This helper function allows the
 * developer to specify only fields required by tests.
 */
export function makeCloudflareWorkerRequest(
  input: RequestInfo,
  init?: MockCloudflareRequestInit,
): Request {
  if (init == null) {
    return new Request(input);
  }

  const attr = init.cf;
  const tlsAttr: Partial<CloudflareRequestAttributes['tlsClientAuth']> =
    attr.tlsClientAuth || {};
  const cf: CloudflareRequestAttributes = {
    asn: attr.asn || '395747',
    city: attr.city || 'Austin',
    colo: attr.colo || 'AUS',
    continent: attr.continent || 'NA',
    country: attr.country || 'US',
    exclusive: attr.exclusive || '0',
    group: attr.exclusive || '0',
    'group-weight': attr['group-weight'] || '0',
    httpProtocol: attr.httpProtocol || 'HTTP/2',
    latitude: attr.latitude || 30.2713,
    longitude: attr.longitude || -97.7426,
    postalCode: attr.postalCode || '78701',
    region: attr.region || 'Texas',
    regionCode: attr.regionCode || 'TX',
    requestPriority:
      attr.requestPriority || 'weight=192;exclusive=0;group=3;group-weight=127',
    timezone: attr.timezone || 'America/Chicago',
    tlsCipher: attr.tlsCipher || 'AEAD-AES128-GCM-SHA256',
    tlsClientAuth: {
      certFingerprintSHA1: tlsAttr.certFingerprintSHA1 || '',
      certIssuerDN: tlsAttr.certIssuerDN || '',
      certIssuerDNLegacy: tlsAttr.certIssuerDNLegacy || '',
      certIssuerDNRFC2253: tlsAttr.certIssuerDNRFC2253 || '',
      certNotAfter: tlsAttr.certNotAfter || 'Dec 22 19:39:00 2018 GMT',
      certNotBefore: tlsAttr.certNotBefore || 'Dec 22 19:39:00 2018 GMT',
      certPresented: tlsAttr.certPresented || '1',
      certSerial: tlsAttr.certSerial || '',
      certSubjectDN: tlsAttr.certSubjectDN || '',
      certSubjectDNLegacy: tlsAttr.certSubjectDNLegacy || '',
      certVerified: tlsAttr.certVerified || 'SUCCESS',
    },
    tlsVersion: attr.weight || 'TLSv1.3',
    weight: attr.weight || '0',
  };

  const request = new Request(input, init);
  // Manually add CloudflareRequestAttributes since new Request() drops them.
  request.cf = cf;

  return request;
}

export default makeCloudflareWorkerEnv;
