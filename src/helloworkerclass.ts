export class HelloWorkerClass {
  private responseInit = {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  };

  public async handle(request: Request) {
    const response = await fetch(request);
    let body = 'Hello';

    if (response.status === 200) {
      body = await response.text();
    }

    return new Response(body + ' World!', this.responseInit);
  }
}
