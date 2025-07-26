import { Dtos } from "commons"
import { faker } from "faker"

export const tenant = {
  id: crypto.randomUUID(),
  name: faker.company.name(),
}

export const devices = [
  { id: crypto.randomUUID(), name: 'Super Tester', model: 'D3 Meter' },
  { id: crypto.randomUUID(), name: 'Super Meter', model: 'D4 Meter'},
  { id: crypto.randomUUID(), name: 'Hyper Meter', model: 'D5 Meter' },
  { id: crypto.randomUUID(), name: 'Amazing Meter', model: 'D6 Meter' },
  { id: crypto.randomUUID(), name: 'Something Meter', model: 'D7' },
  { id: crypto.randomUUID(), name: 'Meter', model: 'D8' },
]

const tags = [ 
  'patient',
  'urgent', 
  'necessary',
  'observation',
  'important',
  'hospital',
  'clinic',
  'high',
  'pragmatic'
]

export const generatePatients = (count: number) => {
  const patients = new Array<Partial<Dtos.Patient>>()
  for(let i=0; i < count; i++) {
    const patient = {
      tid: tenant.id,
      tenant: tenant,
      name: faker.person.fullName(),
      updated: faker.date.between({
        from: new Date(2025, 1, 1),
        to: new Date(2025, 7, 1),
      }),
      since: faker.date.between({
        from: new Date(1960,0,0),
        to: new Date(2010,0,0)
      }),
      status: faker.datatype.boolean({ probability: 0.95 }) ?
        'Activated':
        faker.helpers.arrayElements(Dtos.AccountStatusValues, 1).at(0),
      sync: faker.datatype.boolean({ probability: 0.98 }) ? {
        date: faker.date.between({ 
          from: new Date(2025,0,0),
          to: new Date(2025,7,0)
        }),
        device: faker.helpers.arrayElements(devices, 1).at(0),
        home: faker.datatype.boolean({ probability: 0.2 }),
      }: undefined,
      tags: faker.datatype.boolean({ probability: 0.2 }) ? 
        faker.helpers.arrayElements(tags, { min: 0, max: 3 }):
        undefined
    } as Dtos.Patient

    patient.attrs = []
    if(patient.sync?.device) {
      patient.attrs.push({ k: 'device_id', v: patient.sync.device.id })
    }
    if(patient.status) {
      patient.attrs.push({ k: 'status', v: patient.status })
    }
    if(patient.tags && patient.tags.length > 0) {
      for(const tag of patient.tags) {
        patient.attrs.push({ k: 'tag', v: tag })
      }
    }
    if(patient.attrs.length == 0) {
      patient.attrs = undefined
    }

    patients.push(patient)
  }

  return patients
}