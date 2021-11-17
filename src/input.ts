import { getInput as getActionInput } from '@actions/core'

interface Input {
  readonly token: string
  readonly gistId: string
  readonly gistFileName?: string
  readonly filePath: string
}

export const getInput = (): Input => {
  return {
    token: getActionInput('token'),
    gistId: getActionInput('gist_id'),
    gistFileName: getActionInput('gist_file_name'),
    filePath: getActionInput('file_path')
  }
}
