/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// src/index.ts
export interface Env {
	SHORT_URLS: KVNamespace;
  }

  const basePath = "https://msb.link";
  
  export default {
	async fetch(
	  request: Request,
	  env: Env,
	  _ctx: ExecutionContext
	): Promise<Response> {
	  const rurl = new URL(request.url);
	  const { pathname, search } = rurl;
		
	  const redirectURL = await env.SHORT_URLS.get(pathname);
		console.log(env.SHORT_URLS)
	  if (redirectURL) {
		let kvObj = JSON.parse(redirectURL);
		const { url, params } = kvObj;

		var newPath = `${url}${search}&${params}`;
	  
		return Response.redirect(newPath, 301);
		
	  } else {
		return Response.redirect(basePath, 301);
	  }
		
	},
  };

//   https://developers.cloudflare.com/api/operations/workers-kv-namespace-write-key-value-pair-with-metadata
// https://blog.cloudflare.com/building-a-serverless-slack-bot-using-cloudflare-workers/