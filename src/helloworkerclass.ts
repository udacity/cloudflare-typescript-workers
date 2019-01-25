export class HelloWorkerClass {
  private responseInit = {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  };

  private cfDefaults: CloudFlareRequestInit = {
    cf: {
      cacheKey: "hello-world",
      minify: {
        html: true,
      },
    }
  }

  public async handle(request: Request) {
    const response = await fetch(request, this.cfDefaults);
    let body = 'Hello ';

    if (response.status === 200) {
      body = await response.text();
    }

    return new Response(`${body} ${request.cf.country}!`, this.responseInit);
  }
}
