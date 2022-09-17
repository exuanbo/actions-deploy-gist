import type { ActionInput } from './types'

interface InputOptions {
  required?: boolean
}

// https://github.com/actions/toolkit/blob/bc4be505973a6a7344bfd71e1b32f77e1755310c/packages/core/src/core.ts#L143
function getInput(name: string, options: InputOptions & { required: true }): string
function getInput(name: string, options?: InputOptions): string | undefined
function getInput(name: string, options: InputOptions = {}): string | undefined {
  const { required = false } = options
  const key = `INPUT_${name.replace(/ /g, '_').toUpperCase()}`
  const value = process.env[key]?.trim()
  if (required && !value) {
    throw new Error(`Input required and not supplied: ${name}`)
  }
  return value || undefined
}

const TRUE_VALUES = ['true', 'True', 'TRUE']
const FALSE_VALUES = ['false', 'False', 'FALSE']

// https://github.com/actions/toolkit/blob/bc4be505973a6a7344bfd71e1b32f77e1755310c/packages/core/src/core.ts#L186
function getBooleanInput(name: string, options: InputOptions & { required: true }): boolean
function getBooleanInput(name: string, options?: InputOptions): boolean | undefined
function getBooleanInput(name: string, options: InputOptions = {}): boolean | undefined {
  const value = getInput(name, options)
  if (value === undefined) {
    return undefined
  }
  if (TRUE_VALUES.includes(value)) {
    return true
  }
  if (FALSE_VALUES.includes(value)) {
    return false
  }
  throw new TypeError(
    `Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
      'Support boolean input list: `true | True | TRUE | false | False | FALSE`'
  )
}

export const getActionInput = (): ActionInput => {
  return {
    token: getInput('token', { required: true }),
    gistId: getInput('gist_id'),
    createAsPublic: getBooleanInput('create_as_public'),
    gistDescription: getInput('gist_description'),
    gistFileName: getInput('gist_file_name'),
    filePath: getInput('file_path', { required: true }),
    fileType: getInput('file_type')
  }
}
