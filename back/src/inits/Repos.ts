import { PatientMongo, TenantMongo } from "@/repositories/mongo/index.ts";
import { Types } from "@/types.ts";
import { container } from "@danielfroz/sloth";
import { MongoClient, MongoError } from "mongodb";

export const init = async () => {
  const config = container.resolve(Types.Config)
  const clog = container.resolve(Types.Log)
  const log = clog.child({ mod: 'Repos.init' })

  try {
    const DB_NAME = config.mongo.db 
    const uri = config.mongo.uri
    const client = new MongoClient(uri)

    await client.connect()

    const masked = () => {
      return uri.replace(/\:\/\/\w+\:\w+\@/, "://****@")
    }

    log.info({ msg: 'connected to cluster', uri: masked() })

    const db = client.db(DB_NAME)

    // const admin = db.admin()
    // const pingResult = await admin.ping()
    // log.info({ msg: `ping result: ${JSON.stringify(pingResult)}` })

    container.register(Types.Database, { useValue: db })
    container.register(Types.Repos.Patient, { useClass: PatientMongo })
    container.register(Types.Repos.Tenant, { useClass: TenantMongo })
  }
  catch (error: Error | MongoError | any) {
    log.error({ msg: `failed to initialize mongo connection`, error })
    process.exit(-1)
  }
}