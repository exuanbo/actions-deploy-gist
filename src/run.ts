import { promises as fs } from 'fs'
import { basename, join } from 'path'
import { startGroup, endGroup, info } from '@actions/core'
import { getOctokit } from '@actions/github'
import simpleGit from 'simple-git'
import { getInput } from './input'
import { createTempDirectory } from './utils'

export const run = async (): Promise<void> => {
  const input = getInput()

  const workspace = process.env.GITHUB_WORKSPACE!
  const filePath = join(workspace, input.filePath)
  const fileName = input.gistFileName ?? basename(filePath)

  startGroup('Dump inputs')
  info(`\
[INFO] GistId: ${input.gistId}${
    input.gistDescription === undefined ? '' : `\n[INFO] GistDescription: ${input.gistDescription}`
  }
[INFO] GistFileName: ${fileName}
[INFO] FilePath: ${input.filePath}`)
  endGroup()

  startGroup('Deploy to gist')
  if (input.fileType !== 'binary') {
    const content = await fs.readFile(filePath, 'utf-8')
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
  } else {
    const git = simpleGit()
    const gistDir = await createTempDirectory()
    await git.clone(`https://${input.token}@gist.github.com/${input.gistId}.git`, gistDir)
    await git.cwd(gistDir)
    await git.addConfig('user.name', process.env.GITHUB_ACTOR!)
    await git.addConfig('user.email', `${process.env.GITHUB_ACTOR}@users.noreply.github.com`)
    await fs.copyFile(filePath, join(gistDir, fileName))
    await git.add(fileName)
    await git.commit(`Add ${fileName}`)
    await git.push('origin', 'master')
  }
  info(`[INFO] Done with gist "${input.gistId}/${fileName}"`)
  endGroup()

  info('[INFO] Action successfully completed')
}
