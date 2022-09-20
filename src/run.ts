import { promises as fs } from 'fs'
import { basename, join, resolve } from 'path'
import { startGroup, endGroup, info } from '@actions/core'
import { simpleGit } from 'simple-git'
import type { ActionContext } from './types'
import { createTempDirectory } from './utils'
import { name as projectName, version, author } from '../package.json'

const MAIN_VERSION = version.split('.')[0]
const PLACEHOLDER = `Created by ${author.name}/${projectName}@v${MAIN_VERSION}`

export const run = async (context: ActionContext): Promise<void> => {
  const {
    token,
    createAsPublic = true,
    gistDescription,
    filePath: unresolvedFilePath,
    fileType: unvalidatedFileType = 'text'
  } = context.input

  const workspace = process.env.GITHUB_WORKSPACE ?? process.cwd()
  const filePath = resolve(workspace, unresolvedFilePath)
  const fileType = ['text', 'binary'].includes(unvalidatedFileType) ? unvalidatedFileType : 'text'

  let { gistId, gistFileName } = context.input
  if (gistFileName === undefined) {
    gistFileName = basename(filePath)
  }

  startGroup('Dump inputs')
  if (gistId !== undefined) {
    info(`[INFO] GistId: ${gistId}`)
  } else {
    info(`[INFO] CreateAsPublic: ${createAsPublic}`)
  }
  if (gistDescription !== undefined) {
    info(`[INFO] GistDescription: ${gistDescription}`)
  }
  info(`[INFO] GistFileName: ${gistFileName}`)
  info(`[INFO] FilePath: ${unresolvedFilePath}`)
  info(`[INFO] FileType: ${fileType}`)
  endGroup()

  startGroup('Deploy to gist')
  if (gistId === undefined) {
    const response = await context.octokit.rest.gists.create({
      files: { [gistFileName]: { content: PLACEHOLDER } },
      public: createAsPublic
    })
    gistId = response.data.id!
    context.createdGistId = gistId
    info(`[INFO] Created gist "${gistId}"`)
  }
  if (fileType === 'text') {
    const content = await fs.readFile(filePath, 'utf-8')
    await context.octokit.rest.gists.update({
      gist_id: gistId,
      description: gistDescription,
      files: { [gistFileName]: { content } }
    })
  } else {
    const git = simpleGit()
    const gistDir = await createTempDirectory()
    await git.clone(`https://${token}@gist.github.com/${gistId}.git`, gistDir, { '--depth': 1 })
    await git.cwd(gistDir)
    await git.addConfig('user.name', process.env.GITHUB_ACTOR!)
    await git.addConfig('user.email', `${process.env.GITHUB_ACTOR!}@users.noreply.github.com`)
    await fs.copyFile(filePath, join(gistDir, gistFileName))
    await git.add(gistFileName)
    await git.commit(`Add ${gistFileName}`)
    const branch = await git.revparse(['--abbrev-ref', 'HEAD'])
    await git.push('origin', branch)
  }
  info(`[INFO] Done with gist "${gistId}/${gistFileName}"`)
  endGroup()

  info('[INFO] Action successfully completed')
}
