const server = Bun.serve({
    routes: {
        "/api": {
            GET: (req) => {
                // server.
                // console.log(new URL(req.url).searchParams);
                // console.log(req);
                const params = new URL(req.url).searchParams;
                return Response.json({ 'сам ты': params.get('q') });
            },
            POST: async req => {
                const body = await req.json() as { 'ты': string };
                return Response.json({ 'сам ты': body['ты'] });
            }
        },

        // "/api/:q": {
        //     // GET: req => new Response(JSON.stringify(req)),
        //     GET: req => {
        //         console.log(req);
        //         // console.log(JSON.stringify(req));
        //         return Response.json(req);
        //     },
        //     POST: req => Response.json(req),
        // }
    }
});

console.log(server);
console.log();
