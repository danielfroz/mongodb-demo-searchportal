import { exists } from '@std/fs';
import { parse } from '@std/yaml';
import { Config } from "../dtos/index.ts";

export class ConfigUtils {
  static async load(): Promise<Config> {
    let path = Deno.env.get('CONFIG') ?? 'config.yaml'
    if(!await exists(path))
      path = 'config.yml'
    if(!await exists(path))
      path = '../config.yaml'
    if(!await exists(path))
      path = '../config.yml'
    if(!await exists(path)) 
      throw new Error('failed to locate config.yaml file')

    const decoder = new TextDecoder('utf-8')
    const bytes = await Deno.readFile(path)
    const content = decoder.decode(bytes)
    const config = parse(content) as Config
    if(!config)
      throw new Error('invalid yaml config file')
    if(!config.mongo)
      throw new Error('invalid yaml config file: mongo')
    if(!config.mongo.uri)
      throw new Error('invalid yaml config file: mongo.uri')
    if(!config.mongo.db)
      throw new Error('invalid yaml config file: mongo.db')
    return config as Config
  }
}