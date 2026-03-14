
type RouteHandler = (req: Bun.BunRequest) => Response
type AsyncRouteHandler = (req: Bun.BunRequest) => Promise<Response>

type RouteMethods = {
	GET?: FlatRouteTypes,
	HEAD?: FlatRouteTypes,
	POST?: FlatRouteTypes,
	PUT?: FlatRouteTypes,
	DELETE?: FlatRouteTypes,
	CONNECT?: FlatRouteTypes,
	OPTIONS?: FlatRouteTypes,
	TRACE?: FlatRouteTypes,
	PATCH?: FlatRouteTypes,
}

type FlatRouteTypes = RouteHandler | AsyncRouteHandler | RouteMethods | Response | Bun.HTMLBundle

type FlatRoutes = {
	[key: string]: FlatRouteTypes
}

type ModularRoutes = {
	[key: string]: ModularRoutes | FlatRouteTypes
}

function ModularRouter(routesIn: ModularRoutes): FlatRoutes
{
	let routesOut: FlatRoutes = {}
	function collapse(routes: ModularRoutes, prefix: string)
	{
		for (const [key, val] of Object.entries(routes))
		{
			if (typeof val === "function" || // routehandler, asyncroutehandler
				'index' in val || // bun.htmlbundle
				'onmessage' in val || // response
				'GET' in val ||
				'HEAD' in val ||
				'POST' in val ||
				'PUT' in val ||
				'DELETE' in val ||
				'CONNECT' in val ||
				'OPTIONS' in val ||
				'TRACE' in val ||
				'PATCH' in val
			)
				routesOut[prefix + key] = val as RouteHandler | AsyncRouteHandler | Response | Bun.HTMLBundle
			else
			{
				collapse(val as ModularRoutes, prefix + key)
			}
		}
	}
	collapse(routesIn, "")
	return routesOut
}

export default ModularRouter