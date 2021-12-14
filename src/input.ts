import { getInput as getActionInput } from '@actions/core'

type Input = Readonly<{
  token: string
  gistId: string
  gistDescription?: string
  gistFileName?: string
  filePath: string
}>

export const getInput = (): Input => {
  return {
    token: getActionInput('token'),
    gistId: getActionInput('gist_id'),
    gistDescription: getActionInput('gist_description'),
    gistFileName: getActionInput('gist_file_name'),
    filePath: getActionInput('file_path')
  }
}
