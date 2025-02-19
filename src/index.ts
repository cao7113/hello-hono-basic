import { Hono } from "hono";
import { swaggerUI } from "@hono/swagger-ui";
import { html } from "hono/html";
import { basicAuth } from "hono/basic-auth";
import { upgradeWebSocket } from "hono/cloudflare-workers";

const app = new Hono();

app.get("/", (c) => {
  // plain text response
  return c.text("Hello Hono!");
});

// Use the middleware to serve Swagger UI at /ui
app.get("/ui", swaggerUI({ url: "/doc" }));

app.get("/doc", (c) => {
  // application/json Response (Swagger JSON)
  return c.json({
    openapi: "3.0.0",
    info: {
      title: "Hello Hono API",
      version: "1.0.0",
    },
    paths: {
      "/": {
        get: {
          summary: "Get home info",
          responses: {
            "200": {
              description: "Home info",
              content: {
                "text/plain": {
                  schema: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
      "/api": {
        get: {
          summary: "Get API status",
          responses: {
            "200": {
              description: "API status",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      ok: { type: "boolean" },
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/hello": {
        get: {
          summary: "Say Hello",
          responses: {
            "200": {
              description: "Hello message",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      ok: { type: "boolean" },
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/ping": {
        get: {
          summary: "Ping the API",
          responses: {
            "200": {
              description: "Pong message",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      ok: { type: "boolean" },
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
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

app.get("/api/ping", (c) => {
  return c.json({
    ok: true,
    message: "Pong!",
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

// export default {
//   fetch: app.fetch,
//   scheduled: async (batch, env) => {},
// }
