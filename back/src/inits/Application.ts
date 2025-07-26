import { PatientController, TenantController } from "@/controllers/index.ts";
import { NotFoundMiddleware } from "@/middlewares/index.ts";
import { Types } from "@/types.ts";
import { Application, container } from "@danielfroz/sloth";
import { ExpressFramework } from "@danielfroz/sloth/express";

export const init = async () => {
  const log = container.resolve(Types.Log)
  const app = new Application({
    framework: new ExpressFramework(),
    log
  })

  /**
   * This code injects the Controllers & Middlewares to the DI for later initialization
   * Note that initialization only happens at .start() phase
   */
  app.Handlers.add(PatientController)
  app.Handlers.add(TenantController)
  app.Handlers.add(NotFoundMiddleware)

  const port = 4000
  log.info({ msg: `starting application on port: ${port}` })
  await app.start({ port })
}