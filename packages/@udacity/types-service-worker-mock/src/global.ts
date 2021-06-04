/*
Copyright 2019 Udacity, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// Why is this a global augmentation?
//
// Because service-worker-mock uses the ServiceWorkerGlobalScope class name
// instead of ServiceWorkerGlobalScopeMock.
// ref: https://github.com/pinterest/service-workers/issues/110

export {};
declare global {
  type ServiceWorkerGlobalScopeEventListener = <
    K extends keyof ServiceWorkerGlobalScopeEventMap,
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

    trigger(name: string, args: Request): Promise<Response>;
    // Final overload for void.
    trigger(name: string, args: any): Promise<void>;
  }
}
