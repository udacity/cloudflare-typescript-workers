/// <reference types="../../node_modules/types-serviceworker" />

declare module 'service-worker-mock' {
  interface IEnvOptions {
    [key: string]: string;
  }

  function makeServiceWorkerEnv(envOptions?: IEnvOptions): ServiceWorkerGlobalScope;
  export default makeServiceWorkerEnv;
}
