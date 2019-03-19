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
