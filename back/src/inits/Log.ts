import { Types } from "@/types.ts"
import { ConsoleLog } from "@danielfroz/slog"
import { container } from "@danielfroz/sloth"

export const init = async () => {
  const log = new ConsoleLog({
    level: 'INFO',
    init: { service: 'back' }
  })

  container.register(Types.Log, { useValue: log })
}