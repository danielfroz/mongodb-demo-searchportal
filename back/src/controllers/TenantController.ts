import { ListHandler } from "@/handlers/cqrs/tenant/index.ts";
import { Controller } from "@danielfroz/sloth";

export const TenantController = new Controller('/tenant')
  .add({
    endpoint: '/list',
    handler: ListHandler
  })