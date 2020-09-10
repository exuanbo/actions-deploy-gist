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
    const fileContent = fs.readFileSync(filePath).toString()
    core.endGroup()

    core.startGroup('Deploy to gist')
    const octokit = github.getOctokit(inp.Token)
    const fileName = inp.GistFileName ? inp.GistFileName : path.basename(filePath)
    octokit.gists.update({
      gist_id: inp.GistID,
      files: {
        [fileName]: {
          filename: fileName,
          content: fileContent
        }
      }
    })
    core.endGroup()

    core.info('[INFO] Action successfully completed')
  } catch (err) {
    throw new Error(err.message)
  }
}
