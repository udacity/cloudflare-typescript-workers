/// <reference types="../../node_modules/types-serviceworker" />
// Why is this a global augmentation?
//
// Because service-worker-mock uses the ServiceWorkerGlobalScope class name
// instead of ServiceWorkerGlobalScopeMock.
// ref: https://github.com/pinterest/service-workers/issues/110

export { };
declare global {
  interface ServiceWorkerListener {
    [key: string]: (<K extends keyof ServiceWorkerGlobalScopeEventMap>(this: ServiceWorkerGlobalScope, ev: K) => any);
  }

  // Overriding the original ServiceWorkerGlobalScope to add mock features.
  interface ServiceWorkerGlobalScope {
    listeners: ServiceWorkerListener;

    trigger(name: string, args: Request): Promise<Response>;
    // Final overload for void.
    trigger(name: string, args: any): Promise<void>;
  }
}
