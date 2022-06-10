import { promises as fs } from 'fs'
import { join } from 'path'
import { nanoid } from 'nanoid/async'

/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

// https://github.com/actions/toolkit/blob/b5f31bb5a25d129441c294fc81ba7f92f3e978ba/packages/cache/src/internal/cacheUtils.ts#L13
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
