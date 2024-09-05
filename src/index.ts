import { config } from 'dotenv';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { cors } from 'hono/cors';
import { logger as httpLogger } from 'hono/logger';
import { trimTrailingSlash } from 'hono/trailing-slash';

config();

const app = new Hono();

app.use(cors());
app.use(compress());
app.use(httpLogger());
app.use(trimTrailingSlash());

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

const port = Number(process.env.PORT);
console.log(`Server is running on port ${port}`);

const server = serve({
  fetch: app.fetch,
  port,
});

process.on('uncaughtException', function (err) {
  console.error(err.stack);
});

process.on('SIGTERM', (signal) => {
  console.log(`Process ${process.pid} received a SIGTERM signal`);
  server.close();
  process.exit(0);
});

process.on('SIGINT', (signal) => {
  console.log(`Process ${process.pid} has been interrupted`);
  server.close();
  process.exit(0);
});
