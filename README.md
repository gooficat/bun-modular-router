# bun modular router


this is a modular router package for the bun runtime, allowing you to split your routes into branches, which are collapsed down to avoid runtime penalties

for example, the following is changed:
```js
Bun.serve({
	routes: ModularRouter({
		"/": return new Response("Hello, World!"),
		"/animal": {
			"/cat": {}
		}
	})
})
```