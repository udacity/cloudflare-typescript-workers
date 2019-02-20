import { CloudFlareDefaultCacheStorage } from '.';

// Why is this a global augmentation?
//
// Because Cloudflare extends the Request object with additional attributes.
// ref: https://developers.cloudflare.com/workers/reference/request-attributes/

export { };
declare global {
  interface Request {
    /**
     * CloudFlare Request Attributes
     *
     * Workers allows you to run custom logic based for any incoming request. In
     * addition to the information available on the Request object, such as
     * headers, Cloudflare provides additional attributes of the request using
     * the request.cf object.
     *
     * Attributes available on request.cf:
     * * tlsVersion: the TLS version used on the connection to Cloudflare.
     * * tlsCipher: the cipher used on the connection to Cloudflare.
     * * country: the two letter country code on the request (this is the same
     *   value as the one provided by the CF-IPCountry header)
     * * colo: the three letter airport code of the colo the request hit.
     *
     * Attributes available through headers:
     * * Client IP: the client IP is available via the CF-Connecting-IP header.
     */
    cf: {
      /**
       * The TLS version used on the connection to Cloudflare.
       */
      tlsVersion: string;

      /**
       * The cipher used on the connection to Cloudflare.
       */
      tlsCipher: string;

      /**
       * The two letter country code on the request (this is the same value as
       * the one provided by the CF-IPCountry header.)
       */
      country: string;

      /**
       * The three letter airport code of the colo the request hit.
       */
      colo: string;
    };
  }

  /**
   * CloudFlare Cache Storage
   *
   * The Cache API gives you fine grained control of reading and writing from
   * cache, and deciding exactly when to fetch data from your origin.
   *
   * ref: https://developers.cloudflare.com/workers/reference/cache-api/
   *
   * This global augmentation adds the Cloudflare Cache storage object to the
   * regular CacheStorage interface.
   */
  interface CacheStorage {
    /**
     * The Cloudflare Workers runtime exposes a single global Cache object,
     * caches.default. This differs from web browsers’ Cache API in that they do
     * not expose any default cache object.
     */
    default: CloudFlareDefaultCacheStorage;
  }
}
