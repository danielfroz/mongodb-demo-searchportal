import { Types } from "@/types.ts";
import { container, Middleware } from "@danielfroz/sloth";
import { NextFunction, Request, Response } from "express";

/**
 * You may want to customize the Not Found of API using a Middleware like this one
 */
export const NotFoundMiddleware = async (reqfn: Middleware.ReqFn<Request>, resfn: Middleware.ResFn<Response>, _nextfn: Middleware.NextFn<NextFunction>): Promise<void> => {
  // accessing Oak.Context
  const req = reqfn()
  const res = resfn()

  const log = container.resolve(Types.Log)
  log.info({ msg: `component not found`, url: req.url.toString() })

  await res.status(404).json({
    error: {
      code: 'notfound',
      message: 'component not found'
    }
  })
}