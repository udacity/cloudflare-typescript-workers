/// <reference types="../node_modules/types-serviceworker" />
/*
 * types-serviceworker src:
 * https://github.com/Microsoft/TypeScript/issues/11781#issuecomment-449617791
 *
 * types-serviceworker could be referenced in tsconfig.json, but that may lead
 * to confusion because:
 * "If types is specified, only packages listed will be included."
 * ref: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
 *
 * Instead of types-serviceworker, we could use:
 *   tsc --lib es5,webworker # or anything es5+
 *
 * But that requires:
 *   export default null
 *   declare var self: ServiceWorkerGlobalScope;
 * ref: https://github.com/Microsoft/TypeScript/issues/14877#issuecomment-340279293
 */

import { HelloWorkerClass } from './helloworkerclass';

addEventListener('fetch', (event: Event) => {
  const worker = new HelloWorkerClass();
  (event as FetchEvent).respondWith(worker.handle((event as FetchEvent).request));
});
