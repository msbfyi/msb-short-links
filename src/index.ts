// Worker to handle short url redirects for banners
export interface Env {
	SHORT_URLS: KVNamespace;
  }
  // Add short link urls to existing search params (query params)
  function buildParams(sourceParams: string, utm: string): string {
	let queryParams = sourceParams;
	if (sourceParams !== '' && utm !== '') {
	  queryParams = `${sourceParams}&${utm}`;
	} else if (sourceParams === '' && utm !== '') {
		queryParams += `?${utm}`;
	} 
	return queryParams;
  }

  export default {
	async fetch(
	  request: Request,
	  env: Env,
	  _ctx: ExecutionContext
	): Promise<Response> {
	  if (request.method === 'GET') {
		const url = new URL(request.url);
		let { pathname, search, hash } = url;
		// if the path name is not the root, then we need to check if it's a short url
		if (pathname !== '/') {
			// if the path name has a trailing slash, remove it
			if (pathname.endsWith('/')) {
				pathname = pathname.slice(0, -1);
			}
			// get the short url from the KV store
			const redirectURL = await env.SHORT_URLS.get(pathname.toLocaleLowerCase());
			if (redirectURL) {
				let kvObj = JSON.parse(redirectURL);
				const { url, params } = kvObj;
				let newParams = buildParams(search, params);
				var newPath = `${url}${newParams}`;
				return Response.redirect(newPath, 301);
			} 
		}
	}

	return fetch(request);
	},
  };
