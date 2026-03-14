type RouteHandler = (req: Bun.BunRequest) => Response

type FlatRoutes = {
	[key: string]: RouteHandler
}

type ModularRoutes = {
	[key: string]: ModularRoutes | RouteHandler
}

function ModularRouter(routesIn: ModularRoutes): FlatRoutes
{
	function collapse(routes: ModularRoutes, prefix: string): FlatRoutes
	{
		let routesOut: FlatRoutes = {}

		for (const [key, val] of Object.entries(routes))
			if (typeof val === "function")
				routesOut[prefix + key] = val as RouteHandler
			else
				collapse(val as ModularRoutes, prefix + key)

		return routesOut
	}

	return collapse(routesIn, "")
}

export default ModularRouter