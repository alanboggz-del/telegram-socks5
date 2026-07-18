import { Router, type IRouter } from "express";
import { GetProxyStatusResponse } from "@workspace/api-zod";
import { getProxyStatus } from "../lib/socks5";

const router: IRouter = Router();

router.get("/proxy/status", async (_req, res): Promise<void> => {
  const status = getProxyStatus();
  res.json(GetProxyStatusResponse.parse(status));
});

export default router;
