import { setFailed } from '@actions/core'
import { run } from './run'
;(async (): Promise<void> => {
  try {
    await run()
  } catch (err) {
    if (err instanceof Error) {
      setFailed(`[INFO] Action failed with "Error: ${err.message}"`)
      return
    }
    throw err
  }
})()
