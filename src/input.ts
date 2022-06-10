/* eslint-disable @typescript-eslint/strict-boolean-expressions */

// https://github.com/actions/toolkit/blob/27f76dfe1afb2b7e5e679cd8e97192d34d8320e6/packages/core/src/core.ts#L128
function getInputFromEnv(name: string, options: { required: true }): string
function getInputFromEnv(name: string, options?: { required?: false }): string | undefined
function getInputFromEnv(name: string, options: { required?: boolean } = {}): string | undefined {
  const { required = false } = options
  const value = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`]
  if (required && !value) {
    throw new Error(`Input required and not supplied: ${name}`)
  }
  return !value ? undefined : value.trim()
}

type Input = Readonly<{
  token: string
  gistId: string
  gistDescription: string | undefined
  gistFileName: string | undefined
  filePath: string
  fileType: string | undefined
}>

export const getInput = (): Input => {
  return {
    token: getInputFromEnv('token', { required: true }),
    gistId: getInputFromEnv('gist_id', { required: true }),
    gistDescription: getInputFromEnv('gist_description'),
    gistFileName: getInputFromEnv('gist_file_name'),
    filePath: getInputFromEnv('file_path', { required: true }),
    fileType: getInputFromEnv('file_type')
  }
}
