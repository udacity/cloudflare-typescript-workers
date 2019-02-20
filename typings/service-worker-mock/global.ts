/// <reference types="../../node_modules/types-serviceworker" />
// Why is this a global augmentation?
//
// Because service-worker-mock uses the ServiceWorkerGlobalScope class name
// instead of ServiceWorkerGlobalScopeMock.
// ref: https://github.com/pinterest/service-workers/issues/110

export { };
declare global {
  type ServiceWorkerGlobalScopeEvents = (<K extends keyof ServiceWorkerGlobalScopeEventMap>(this: ServiceWorkerGlobalScope, ev: K) => any);

  interface ServiceWorkerListener {
    [key: string]: ServiceWorkerGlobalScopeEvents;
    get(key: string): ServiceWorkerGlobalScopeEvents;
  }

  // Overriding the original ServiceWorkerGlobalScope to add mock features.
  interface ServiceWorkerGlobalScope {
    listeners: ServiceWorkerListener;

    trigger(name: string, args: Request): Promise<Response[]>;
    // Final overload for void.
    trigger(name: string, args: any): Promise<void>;
  }
}
