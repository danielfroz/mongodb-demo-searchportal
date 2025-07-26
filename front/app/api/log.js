import { ConsoleLog } from '@danielfroz/slog'

export const glog = new ConsoleLog({ level: 'INFO', init: { service: 'front' }})