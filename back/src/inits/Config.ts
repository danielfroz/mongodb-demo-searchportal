import { container } from "@danielfroz/sloth";
import { Utils } from 'commons';
import { Types } from "../types.ts";

export const init = async () => {
  const config = await Utils.ConfigUtils.load()
  container.register(Types.Config, { useValue: config })
}