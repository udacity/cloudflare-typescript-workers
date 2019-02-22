// Primarily exists to implement the Cache API:
// https://developers.cloudflare.com/workers/reference/cache-api/

// Import the service-worker-mock types.
/// <reference types="@udacity/types-service-worker-mock" />
// Import the service-worker-mock global augmentations.
import '@udacity/types-service-worker-mock/global';

import { CloudFlareCacheQueryOptions, CloudflareWorkerGlobalScopePatch } from '@udacity/types-cloudflare-worker';
import makeServiceWorkerEnv from 'service-worker-mock';
import { EnvOptions } from 'service-worker-mock';

/**
 * Create a mock environment for a Cloudflare Worker with a mockable cache layer.
 */
export function makeCloudflareWorkerEnv(envOptions?: EnvOptions): CloudflareWorkerGlobalScopePatch {
  const serviceWorkerEnv = makeServiceWorkerEnv(envOptions);
  const cloudflareWorkerEnv = serviceWorkerEnv as CloudflareWorkerGlobalScopePatch;

  cloudflareWorkerEnv.caches = {
    default: {
      put(_request: Request, _response: Response): Promise<undefined> {
        return new Promise<undefined>((resolve, _reject) => { resolve(undefined); });
      },
      match(_request: Request, _options?: CloudFlareCacheQueryOptions): Promise<Response | undefined> {
        return new Promise<undefined>((resolve, _reject) => { resolve(undefined); });
      },
      delete(_request: Request, _options?: CloudFlareCacheQueryOptions): Promise<boolean> {
        return new Promise<boolean>((resolve, _reject) => { resolve(false); });
      },
    },
  };

  return cloudflareWorkerEnv;
}

export default makeCloudflareWorkerEnv;
