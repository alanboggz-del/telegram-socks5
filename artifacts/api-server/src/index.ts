import app from "./app";
import { logger } from "./lib/logger";
import { startSocks5Proxy } from "./lib/socks5";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const socksPort = Number(process.env["SOCKS_PORT"] ?? "1080");

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
  startSocks5Proxy(socksPort);
});
