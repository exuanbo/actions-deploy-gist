import fs from 'fs'
import path from 'path'
import * as core from '@actions/core'
import * as github from '@actions/github'
import { showInputs, getInputs } from './inputs'

export const run = async (): Promise<void> => {
  const inp = getInputs()
  showInputs(inp)

  core.startGroup('Read file content')
  const workSpace = process.env.GITHUB_WORKSPACE as string
  const filepath = path.join(workSpace, inp.FilePath)
  const content = fs.readFileSync(filepath, 'utf-8')
  core.info(`[INFO] Done with file "${filepath}"`)
  core.endGroup()

  core.startGroup('Deploy to gist')
  const octokit = github.getOctokit(inp.Token)
  const filename = inp.GistFileName || path.basename(filepath)
  await octokit.gists.update({
    gist_id: inp.GistID,
    files: {
      [filename]: {
        filename,
        content
      }
    }
  })
  core.info(`[INFO] Done with gist "${inp.GistID}/${filename}"`)
  core.endGroup()

  core.info('[INFO] Action successfully completed')
}
