import { setOutput, setFailed } from '@actions/core'
import { getOctokit } from '@actions/github'
import { getActionInput } from './input'
import type { ActionContext } from './types'
import { run } from './run'

const main = async (): Promise<void> => {
  const input = getActionInput()
  const octokit = getOctokit(input.token)
  const context: ActionContext = {
    input,
    octokit
  }
  try {
    await run(context)
    if (context.createdGistId !== undefined) {
      setOutput('gist_id', context.createdGistId)
    }
  } catch (err) {
    if (err instanceof Error) {
      if (context.createdGistId !== undefined) {
        try {
          await octokit.rest.gists.delete({
            gist_id: context.createdGistId
          })
        } catch {}
      }
      setFailed(`[INFO] Action failed with "Error: ${err.message}"`)
      return
    }
    throw err
  }
}

void main()
