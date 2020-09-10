import * as core from '@actions/core'

export interface Inputs {
  readonly GithubToken: string
  readonly GistID: string
  readonly GistFileName?: string
  readonly FilePath: string
}

export const showInputs = (inp: Inputs): void => {
  core.info(`\
[INFO] GistID: ${inp.GistID}
[INFO] GistFileName: ${inp.GistFileName ? inp.GistFileName : 'No Change'}
[INFO] FilePath: ${inp.FilePath}
`)
}

export const getInputs = (): Inputs => {
  const inp: Inputs = {
    GithubToken: core.getInput('github_token'),
    GistID: core.getInput('gist_id'),
    GistFileName: core.getInput('gist_file_name'),
    FilePath: core.getInput('file_path')
  }

  return inp
}
