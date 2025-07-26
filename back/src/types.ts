import { Log } from '@danielfroz/slog';
import { DI } from '@danielfroz/sloth';
import { Dtos } from 'commons';
import { Db } from 'mongodb';
import {
  PatientRepository,
  TenantRepository
} from "./repositories/index.ts";

export const Types = {
  Config: DI.Type<Dtos.Config>('Config'),
  Log: DI.Type<Log>('Log'),
  Database: DI.Type<Db>('Database'),
  Repos: {
    Patient: DI.Type<PatientRepository>('Repos.Patient'),
    Tenant: DI.Type<TenantRepository>('Repos.Tenant'),
  },
}