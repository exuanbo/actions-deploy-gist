import * as core from '@actions/core'

export interface Input {
  readonly Token: string
  readonly GistID: string
  readonly GistFileName?: string
  readonly FilePath: string
}

export const getInput = (): Input => ({
  Token: core.getInput('token'),
  GistID: core.getInput('gist_id'),
  GistFileName: core.getInput('gist_file_name'),
  FilePath: core.getInput('file_path')
})

export const showInput = (input: Input): void => {
  core.info(`\
[INFO] GistID: ${input.GistID}
[INFO] GistFileName: ${input.GistFileName ?? 'No Change'}
[INFO] FilePath: ${input.FilePath}
`)
}
