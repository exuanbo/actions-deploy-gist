import fs from 'fs'
import path from 'path'
import * as core from '@actions/core'
import * as github from '@actions/github'
import { showInput, getInput } from './input'

export const run = async (): Promise<void> => {
  const input = getInput()
  showInput(input)

  core.startGroup('Read file content')
  const workSpace = process.env.GITHUB_WORKSPACE!
  const filePath = path.join(workSpace, input.FilePath)
  const content = fs.readFileSync(filePath, 'utf-8')
  core.info(`[INFO] Done with file "${filePath}"`)
  core.endGroup()

  core.startGroup('Deploy to gist')
  const octokit = github.getOctokit(input.Token)
  const fileName = input.GistFileName ?? path.basename(filePath)
  await octokit.gists.update({
    gist_id: input.GistID,
    files: {
      [fileName]: {
        fileName,
        content
      }
    }
  })
  core.info(`[INFO] Done with gist "${input.GistID}/${fileName}"`)
  core.endGroup()

  core.info('[INFO] Action successfully completed')
}
