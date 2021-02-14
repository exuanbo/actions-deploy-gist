/* eslint "@typescript-eslint/no-floating-promises": 0 */
import * as core from '@actions/core'
import { run } from './run'
;(async (): Promise<void> => {
  try {
    await run()
  } catch (err) {
    if (err instanceof Error) {
      core.setFailed(`[INFO] Action failed with "Error: ${err.message}"`)
      return
    }
    throw err
  }
})()
