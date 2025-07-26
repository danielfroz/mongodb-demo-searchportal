import {
  GetFiltersHandler,
  SearchHandler,
  UpdateTagsHandler
} from "@/handlers/cqrs/patient/index.ts";
import { Controller } from "@danielfroz/sloth";

export const PatientController = new Controller('/patient')
  .add({
    endpoint: '/search',
    handler: SearchHandler
  })
  .add({
    endpoint: '/get/filters',
    handler: GetFiltersHandler
  })
  .add({
    endpoint: '/update/tags',
    handler: UpdateTagsHandler
  })
