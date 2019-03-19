import CloudflareWorkerGlobalScope from '@udacity/types-cloudflare-worker';
declare var self: CloudflareWorkerGlobalScope;

import HelloWorkerClass from './helloworkerclass';

self.addEventListener('fetch', (event: Event) => {
  const worker = new HelloWorkerClass();
  const fetchEvent = event as FetchEvent;
  fetchEvent.respondWith(worker.handle(fetchEvent));
});
