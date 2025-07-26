/**
 * Create fake data for our tests
 */
import { Utils } from 'commons'
import { MongoClient } from 'mongodb'
import { generatePatients, tenant } from "./generate.ts"

/**
 * Customize those values in order to generate different tenants + patients
 */
const TOTAL = 150_000
const BULK_OPS = 1000
const TOTAL_ITERATIONS = Math.ceil(TOTAL / BULK_OPS) 

const config = await Utils.ConfigUtils.load()
const client = new MongoClient(config.mongo.uri)
await client.connect()

const db = client.db(config.mongo.db)

const collTenants = db.collection('tenants')
await collTenants.insertOne({ id: tenant.id, name: tenant.name })

const collPatients = db.collection('patients')
for(let i = 0; i < TOTAL_ITERATIONS; i++) {
  console.log('iteration: ', i)
  const patients = generatePatients(BULK_OPS)
  const operations = patients.map(x => ({
    insertOne: {
      document: x
    }
  }))
  await collPatients.bulkWrite(operations)
}

await client.close()
Deno.exit(0)
