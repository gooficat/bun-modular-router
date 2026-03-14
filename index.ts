
type RouteHandler = (req: Bun.BunRequest) => Response

type FlatRoutes = {
	[key: string]: RouteHandler
}

type ModularRoutes = {
	[key: string]: ModularRoutes | RouteHandler | Bun.HTMLBundle
}

function ModularRouter(routesIn: ModularRoutes): FlatRoutes
{
	let routesOut: FlatRoutes = {}
	function collapse(routes: ModularRoutes, prefix: string)
	{
		for (const [key, val] of Object.entries(routes))
		{

			if (typeof val === "function" || val.index)
				routesOut[prefix + key] = val as any
			else
				collapse(val as ModularRoutes, prefix + key)
		}
	}
	collapse(routesIn, "")
	return routesOut
}

export default ModularRouter