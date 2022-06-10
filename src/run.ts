import { promises as fs } from 'fs'
import { basename, join } from 'path'
import { startGroup, endGroup, info } from '@actions/core'
import { getOctokit } from '@actions/github'
import simpleGit from 'simple-git'
import { getInput } from './input'
import { createTempDirectory } from './utils'

export const run = async (): Promise<void> => {
  const input = getInput()
  const { token, gistId, gistDescription } = input

  const filePath = join(process.env.GITHUB_WORKSPACE!, input.filePath)
  const fileName = input.gistFileName ?? basename(filePath)

  const fileType = input.fileType === 'binary' ? 'binary' : 'text'

  startGroup('Dump inputs')
  info(`[INFO] GistId: ${gistId}`)
  if (gistDescription !== undefined) {
    info(`[INFO] GistDescription: ${gistDescription}`)
  }
  info(`[INFO] GistFileName: ${fileName}`)
  info(`[INFO] FilePath: ${input.filePath}`)
  info(`[INFO] FileType: ${fileType}`)
  endGroup()

  startGroup('Deploy to gist')
  if (fileType === 'text') {
    const content = await fs.readFile(filePath, 'utf-8')
    const octokit = getOctokit(token)
    await octokit.rest.gists.update({
      gist_id: gistId,
      description: gistDescription,
      files: { [fileName]: { fileName, content } }
    })
  } else {
    const git = simpleGit()
    const gistDir = await createTempDirectory()
    await git.clone(`https://${token}@gist.github.com/${gistId}.git`, gistDir, { '--depth': 1 })
    await git.cwd(gistDir)
    await git.addConfig('user.name', process.env.GITHUB_ACTOR!)
    await git.addConfig('user.email', `${process.env.GITHUB_ACTOR}@users.noreply.github.com`)
    await fs.copyFile(filePath, join(gistDir, fileName))
    await git.add(fileName)
    await git.commit(`Add ${fileName}`)
    const branch = await git.revparse(['--abbrev-ref', 'HEAD'])
    await git.push('origin', branch)
  }
  info(`[INFO] Done with gist "${gistId}/${fileName}"`)
  endGroup()

  info('[INFO] Action successfully completed')
}
