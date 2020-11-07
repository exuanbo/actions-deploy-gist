import fs from 'fs'
import path from 'path'
import * as core from '@actions/core'
import * as github from '@actions/github'
import { showInputs, getInputs } from './inputs'

export const run = async (): Promise<void> => {
  try {
    const inp = getInputs()
    showInputs(inp)

    core.startGroup('Read file content')
    const workSpace = process.env.GITHUB_WORKSPACE as string
    const filePath = path.join(workSpace, inp.FilePath)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    core.info(`[INFO] Done with file "${filePath}"`)
    core.endGroup()

    core.startGroup('Deploy to gist')
    const octokit = github.getOctokit(inp.Token)
    const fileName =
      inp.GistFileName !== undefined
        ? inp.GistFileName
        : path.basename(filePath)
    await octokit.gists.update({
      gist_id: inp.GistID,
      files: {
        [fileName]: {
          filename: fileName,
          content: fileContent
        }
      }
    })
    core.info(`[INFO] Done with gist "${inp.GistID}/${fileName}"`)
    core.endGroup()

    core.info('[INFO] Action successfully completed')
  } catch (err) {
    if (err instanceof Error) throw new Error(err.message)
    else throw err
  }
}
