import * as core from '@actions/core'
import { run } from './run'
;(async (): Promise<void> => {
  try {
    await run()
  } catch (err) {
    core.setFailed(`Action failed with "${err.message}"`)
  }
})()
