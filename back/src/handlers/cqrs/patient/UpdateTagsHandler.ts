import { Types } from "@/types.ts";
import { CommandHandler, DI, Errors } from "@danielfroz/sloth";
import { Cqrs } from "commons";
import { startOfDay } from 'date-fns';

export class UpdateTagsHandler implements CommandHandler<Cqrs.Patient.UpdateTags, Cqrs.Patient.UpdateTagsResult> {
  constructor(
    private readonly rp = DI.inject(Types.Repos.Patient),
    private readonly log = DI.inject(Types.Log),
  ) {}

  async handle(cmd: Cqrs.Patient.UpdateTags): Promise<Cqrs.Patient.UpdateTagsResult> {
    if(!cmd)
      throw new Errors.ArgumentError('cmd')
    if(!cmd.tid)
      throw new Errors.ArgumentError('cmd.tid')
    if(!cmd.patient)
      throw new Errors.ArgumentError('cmd.patient')

    const { id, sid, tid, patient: pid, tags } = cmd

    const log = this.log.child({ mod: 'patient.update.tags', sid })

    const patient = await this.rp.get({ tid, id: pid })
    if(!patient)
      throw new Errors.ArgumentError('cmd.patient.invalid')

    patient.tags = tags
    patient.attrs = patient.attrs && patient.attrs.length > 0 ? [
      ...patient.attrs.filter(x => x.k !== 'tag'),
    ]: []
    if(tags != null) {
      for(const tag of tags) {
        patient.attrs.push({ k: 'tag', v: tag })
      }
    }

    log.info({ patient })

    await this.rp.updateAttrs({ tid, id: patient.id, attrs: patient.attrs })
    await this.rp.updateTags({ tid, id: patient.id, tags })
    await this.rp.buildFilters({ tid, since: startOfDay(new Date()) })

    return {
      id,
      sid,
      patient
    }
  }
}