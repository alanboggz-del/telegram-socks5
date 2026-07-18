import simpleSocks from "simple-socks";
import { logger } from "./logger";

const { createServer } = simpleSocks;

let socksServer: ReturnType<typeof createServer> | null = null;
let socksPort = 1080;
let socksHost = "0.0.0.0";
let startedAt: string | null = null;
let connectionCount = 0;

export function getProxyStatus() {
  return {
    running: socksServer !== null,
    host: socksHost,
    port: socksPort,
    startedAt,
    connections: connectionCount,
  };
}

export function startSocks5Proxy(port = 1080): void {
  socksPort = port;
  socksHost = "0.0.0.0";

  socksServer = createServer({
    authenticate(username, password, socket, callback) {
      // No auth by default — open proxy
      callback();
    },
  });

  socksServer.on("proxyConnect", (info: { dstAddr: string; dstPort: number }) => {
    connectionCount++;
    logger.info({ dst: `${info.dstAddr}:${info.dstPort}`, total: connectionCount }, "SOCKS5 connection opened");
  });

  socksServer.on("proxyDisconnect", (info: { dstAddr: string; dstPort: number }) => {
    connectionCount = Math.max(0, connectionCount - 1);
    logger.info({ dst: `${info.dstAddr}:${info.dstPort}`, total: connectionCount }, "SOCKS5 connection closed");
  });

  socksServer.on("error", (err: Error) => {
    logger.error({ err }, "SOCKS5 proxy error");
  });

  socksServer.listen(port, "0.0.0.0", () => {
    startedAt = new Date().toISOString();
    const displayHost = process.env["REPLIT_DEV_DOMAIN"] ?? "localhost";
    logger.info(
      {
        host: displayHost,
        port,
        url: `socks5://${displayHost}:${port}`,
      },
      "SOCKS5 proxy server started",
    );
    // Print prominently to stdout so it's visible in deployment logs
    process.stdout.write(
      `\n  ✦ SOCKS5 proxy running\n` +
      `    Host : ${displayHost}\n` +
      `    Port : ${port}\n` +
      `    URL  : socks5://${displayHost}:${port}\n\n`,
    );
  });
}
