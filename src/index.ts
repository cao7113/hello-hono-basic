import { Hono } from "hono";
import { html } from "hono/html";
import { basicAuth } from "hono/basic-auth";
import { upgradeWebSocket } from "hono/cloudflare-workers";

// todo try bear auth and jwt
// todo add swagger-ui

const app = new Hono();

app.get("/", (c) => {
  // plain text response
  return c.text("Hello Hono!");
});

app.get("/api", (c) => {
  // application/json Response
  return c.json({
    ok: true,
    message: "json API!",
  });
});

app.get("/api/hello", (c) => {
  return c.json({
    ok: true,
    message: "Hello Hono!",
  });
});

app.get("/posts/:id", (c) => {
  const page = c.req.query("page") || "no-page-query-param";
  const id = c.req.param("id");
  c.header("X-Message", "Hi!");
  return c.text(`You want to see ${page} of ${id}`);
});

app.post("/posts", (c) => c.text("Created!", 201));

app.delete("/posts/:id", (c) => c.text(`${c.req.param("id")} is deleted!`));

app.get("/html", (c) => {
  return c.html(
    html`<body style="color: blue">
      Hello html
    </body>`
  );
});

app.get("/raw", () => {
  return new Response("raw Response!");
});

app.use(
  "/admin/*",
  basicAuth({
    username: "admin",
    password: "secret",
  })
);

app.get("/admin", (c) => {
  return c.text("You are authorized!");
});

// There are Adapters for platform-dependent functions, e.g., handling static files or WebSocket. For example, to handle WebSocket in Cloudflare Workers, import hono/cloudflare-workers.
app.get(
  "/ws",
  upgradeWebSocket((c) => {
    const [client, server] = Object.values(new WebSocketPair());
    server.accept();

    server.addEventListener("message", (event) => {
      console.log("Received message:", event.data);
      server.send(`Echo: ${event.data}`);
    });

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  })
);

// platform-dependent functions
app.get("/cf-works", (c) => c.text("Hello Cloudflare Workers!"));

export default app;
