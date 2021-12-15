import { promises as fs } from 'fs'
import path from 'path'
import { startGroup, endGroup, info } from '@actions/core'
import { getOctokit } from '@actions/github'
import { getInput } from './input'

export const run = async (): Promise<void> => {
  const input = getInput()

  const workSpace = process.env.GITHUB_WORKSPACE!
  const filePath = path.join(workSpace, input.filePath)

  const fileName = input.gistFileName ?? path.basename(filePath)

  startGroup('Dump inputs')
  info(`\
[INFO] GistId: ${input.gistId}${
    input.gistDescription === undefined
      ? ''
      : `\n[INFO] GistDescription: ${input.gistDescription}`
  }
[INFO] GistFileName: ${fileName}
[INFO] FilePath: ${input.filePath}`)
  endGroup()

  startGroup('Read file content')
  const content = await fs.readFile(filePath, 'utf-8')
  info(`[INFO] Done with file "${filePath}"`)
  endGroup()

  startGroup('Deploy to gist')
  const octokit = getOctokit(input.token)
  await octokit.rest.gists.update({
    gist_id: input.gistId,
    description: input.gistDescription,
    files: {
      [fileName]: {
        fileName,
        content
      }
    }
  })
  info(`[INFO] Done with gist "${input.gistId}/${fileName}"`)
  endGroup()

  info('[INFO] Action successfully completed')
}
