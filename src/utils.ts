import { promises as fs } from 'fs'
import { join } from 'path'
import { nanoid } from 'nanoid/async'

// https://github.com/actions/toolkit/blob/bc4be505973a6a7344bfd71e1b32f77e1755310c/packages/cache/src/internal/cacheUtils.ts#L13
export async function createTempDirectory(): Promise<string> {
  let tempDirectory = process.env.RUNNER_TEMP

  if (!tempDirectory) {
    let baseLocation: string
    if (process.platform === 'win32') {
      baseLocation = process.env.USERPROFILE || 'C:\\'
    } else {
      if (process.platform === 'darwin') {
        baseLocation = '/Users'
      } else {
        baseLocation = '/home'
      }
    }
    tempDirectory = join(baseLocation, 'actions', 'temp')
  }

  const dest = join(tempDirectory, await nanoid())
  await fs.mkdir(dest, { recursive: true })
  return dest
}
