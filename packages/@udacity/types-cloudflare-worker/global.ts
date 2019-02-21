// Why is this a global augmentation?
//
// Because Cloudflare extends the Request object with additional attributes.
// ref: https://developers.cloudflare.com/workers/reference/request-attributes/

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

/**
 * A type of the ServiceWorkerGlobalScope which will include
 * CloudflareWorkerGlobalScopePatch when created with makeCloudflareWorkerEnv().
 */
export type CloudflareWorkerGlobalScope = ServiceWorkerGlobalScope;
export default CloudflareWorkerGlobalScope;

export interface CloudFlareCacheQueryOptions {
  /**
   * Consider the request method to be GET, regardless of its actual value.
   */
  ignoreMethod: boolean;
}

/**
 * A Cache object exposes three methods. Each method accepts a Request object or
 * string value as its first parameter. If a string is passed, it will be
 * interpreted as the URL for a new Request object.
 */
export interface CloudFlareDefaultCacheStorage {
  put(request: Request | string, response: Response): Promise<undefined>;
  match(request: Request | string, options?: CloudFlareCacheQueryOptions): Promise<Response | undefined>;
  delete(request: Request | string, options?: CloudFlareCacheQueryOptions): Promise<boolean>;
}

export interface CloudflareCacheStorage {
  default: CloudFlareDefaultCacheStorage;
}

// Does not extend ServiceWorkerGlobalScope because we are entirely replacing to
// match the Cloudflare implementation.
export interface CloudflareWorkerGlobalScopePatch {
  caches: CloudflareCacheStorage;
}

// An interface for controlling Cloudflare Features on Requests. Reference:
// https://developers.cloudflare.com/workers/reference/cloudflare-features/
export interface CloudFlareRequestFeatures {
  /**
   * Sets Polish mode. The possible values are "lossy", "lossless", or "off".
   */
  polish?: string;

  /**
   * Enables or disables AutoMinify for various file types. The value is an
   * object containing boolean fields for javascript, css, and html.
   */
  minify?: {
    javascript?: boolean;
    css?: boolean;
    html?: boolean;
  };

  /**
   * Disables Mirage for this request. When you specify this option, the value
   * should always be false.
   */
  mirage?: boolean;

  /**
   * Disables ScrapeShield for this request. When you specify this option, the
   * value should always be false.
   */
  scrapeShield?: boolean;

  /**
   * Disables Cloudflare Apps for this request. When you specify this option,
   * the value should always be false.
   */
  apps?: boolean;

  /**
   *
   * Redirects the request to an alternate origin server. You can use this, for
   * example, to implement load balancing across several origins.
   *
   * You can achieve a similar effect by simply changing the request URL. For
   * example:
   *
   * let url = new URL(event.request.url)
   * url.hostname = 'us-east.example.com'
   * fetch(url, event.request)
   *
   * However, there is an important difference: If you use resolveOverride to
   * change the origin, then the request will be sent with a Host header
   * matching the original URL. Often, your origin servers will all expect the
   * Host header to specify your web site’s main hostname, not the hostname of
   * the specific replica. This is where resolveOverride is needed.
   *
   * For security reasons, resolveOverride is only honored when both the URL
   * hostname and the resolveOverride hostname are orange-cloud hosts within
   * your own zone. Otherwise, the setting is ignored. Note that CNAME hosts are
   * allowed. So, if you want to resolve to a hostname that is under a different
   * domain, first declare a CNAME record within your own zone’s DNS mapping to
   * the external hostname, then set resolveOverride to point to that CNAME
   * record.
   */
  resolveOverride?: boolean;

  /**
   * Set cache key for this request.
   *
   * A request’s cache key is what determines if two requests are "the same" for
   * caching purposes. If a request has the same cache key as some previous
   * request, then we can serve the same cached response for both.
   *
   * Normally, Cloudflare computes the cache key for a request based on the
   * request’s URL. Sometimes, though, you’d like different URLs to be treated
   * as if they were the same for caching purposes. For example, say your web
   * site content is hosted from both Amazon S3 and Google Cloud Storage – you
   * have the same content in both places, and you use a Worker to randomly
   * balance between the two. However, you don’t want to end up caching two
   * copies of your content! You could utilize custom cache keys to cache based
   * on the original request URL rather than the subrequest URL:
   *
   * addEventListener('fetch', event => {
   *   let url = new URL(event.request.url);
   *   if (Math.random() < 0.5) {
   *     url.hostname = 'example.s3.amazonaws.com'
   *   } else {
   *     url.hostname = 'example.storage.googleapis.com'
   *   }
   *
   *   let request = new Request(url, event.request)
   *   event.respondWith(fetch(request, {
   *     cf: { cacheKey: event.request.url }
   *   }))
   * })
   *
   * Notes:
   * * Each zone has its own private cache key namespace. That means that two
   *   workers operating within the same zone (even on different hostnames) may
   *   share cache using custom cache keys, but workers operating on behalf of
   *   different zones cannot affect each other’s cache.
   * * You can only override cache keys when making requests within your own
   *   zone, or requests to hosts that are not on Cloudflare. When making a
   *   request to another Cloudflare zone (e.g. belonging to a different
   *   Cloudflare customer), that zone fully controls how its own content is
   *   cached within Cloudflare; you cannot override it.
   * * URLs that are fetch()ed with a custom cache key cannot be purged using a
   *   URL purge. However you can use the Cache API and set a Cache Tag on the
   *   response object if you need to purge the URL.
   */
  cacheKey?: string;

  /**
   * This option forces Cloudflare to cache the response for this request,
   * regardless of what headers are seen on the response. This is equivalent to
   * setting two page rules: "Edge Cache TTL" and "Cache Level" (to "Cache
   * Everything").
   */
  cacheTtl?: number;

  /**
   * This option is a version of the cacheTtl feature which chooses a TTL based
   * on the response’s status code. If the response to this request has a status
   * code that matches, Cloudflare will cache for the instructed time, and
   * override cache instructives sent by the origin.
   *
   * This gives you control over how long assets will stay in the Cloudflare
   * cache based on the response code. For example, you could cache successful
   * fetches for longer, but continue to fetch assets from the origin in the
   * event of failures. You may also use this feature to cache redirects.
   *
   * You may still choose to have different rules based on request settings by
   * checking the URI or headers.
   *
   * TTL values:
   * * Positive TTL values indicate in seconds how long Cloudflare should cache
   *   the asset for
   * * 0 TTL will cause assets to get cached, but expire immediately (revalidate
   *   from origin every time)
   * * -1, or any negative value will instruct Cloudflare not to cache at all
   *
   * Please note, that Cloudflare will still adhere to standard cache levels,
   * so by default this will override cache behavior for static files. If you
   * wish to cache non-static
   */
  cacheTtlByStatus?: { [key: string]: number };
}

export interface CloudFlareRequestInit extends RequestInit {
  /**
   * Controlling Cloudflare Features
   * You can use a Worker to control how other Cloudflare features affect the
   * request. Your Worker runs after security features, but before everything
   * else. Therefore, a Worker cannot affect the operation of security features
   * (since they already finished), but it can affect other features, like
   * Polish or ScrapeShield, or how Cloudflare caches the response.
   *
   * Cloudflare features are controlled through the cf property of a request.
   * Setting cf is kind of like setting headers. You can add cf to a request
   * object by making a copy:
   *
   * // Disable ScrapeShield for this request.
   * let request = new Request(event.request, { cf: { scrapeShield: false } })
   *
   * Alternatively, you can set cf directly on fetch():
   * // Disable ScrapeShield for this request.
   * fetch(event.request, { cf: { scrapeShield: false } })
   *
   * Note: Invalid or incorrectly-named settings in the cf object will be
   * silently ignored. Be careful to test that you are getting the behavior you
   * want. Currently, settings in the cf object cannot be tested in the live
   * preview.
   */
  cf: CloudFlareRequestFeatures;
}

// Overload fetch to accept the CloudFlareRequestInit interface
// declare function fetch(input: RequestInfo, init?: CloudFlareRequestInit
//  | RequestInit | undefined): Promise<Response>;
