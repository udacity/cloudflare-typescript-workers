// Why is this a global augmentation?
//
// Because service-worker-mock uses the ServiceWorkerGlobalScope class name
// instead of ServiceWorkerGlobalScopeMock.
// ref: https://github.com/pinterest/service-workers/issues/110

export {};
declare global {
  type ServiceWorkerGlobalScopeEventListener = <
    K extends keyof ServiceWorkerGlobalScopeEventMap
  >(
    this: ServiceWorkerGlobalScope,
    ev: K,
  ) => any;

  interface ServiceWorkerListener {
    [key: string]: ServiceWorkerGlobalScopeEventListener;
    /**
     * Gets a listener object.
     *
     * @param key string of the name of a listener
     */
    get(key: string): ServiceWorkerGlobalScopeEventListener;
  }

  // Overriding the original ServiceWorkerGlobalScope to add mock features.
  interface ServiceWorkerGlobalScope {
    listeners: ServiceWorkerListener;

    trigger(name: string, args: Request): Promise<Response[]>;
    // Final overload for void.
    trigger(name: string, args: any): Promise<void>;
  }
}
