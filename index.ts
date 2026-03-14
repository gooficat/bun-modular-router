import path from "path"

type RouteHandler = (req: Bun.BunRequest) => Response

type ModularRoutes = {
	[key: string]: ModularRoutes | RouteHandler
}

function ModularRouter(req: Bun.BunRequest, node: ModularRoutes | RouteHandler, clientPath: string): Response
{
	function walk(node: ModularRoutes | RouteHandler | undefined, route: string[]): Response
	{
		if (!node)
		{
			let pat = new URL(req.url).pathname
			if (pat === "/") pat = "index.html"
			return new Response(Bun.file(path.join(clientPath, pat)))
		}
		if (typeof node === "function")
			return node(req)
		return walk(node[route[0]!], route.slice(1))
	}
	return walk(node, new URL(req.url).pathname.split("/").filter(Boolean))
}

export { ModularRouter, type RouteHandler, type ModularRoutes }

export default ModularRouter