import makeCloudflareWorkerEnv from '../packages/cloudflare-worker-mock';

describe('helloworker', () => {

  beforeEach(() => {
    // Merge the Service Worker Environment in to the global scope.
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
    caches.default.put = (_request: Request, _response: Response): Promise<undefined> => {
      putCalled = true;
      return new Promise<undefined>((resolve, _reject) => { resolve(undefined); });
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
