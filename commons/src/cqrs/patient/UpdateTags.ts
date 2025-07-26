import { Command, CommandResult } from "@danielfroz/sloth";
import { Dtos } from "../../mod.ts";

export interface UpdateTags extends Command {
  tid: string
  patient: string
  tags?: string[]
}

export interface UpdateTagsResult extends CommandResult {
  patient: Dtos.Patient
}