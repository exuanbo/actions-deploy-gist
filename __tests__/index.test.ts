import { execSync } from 'child_process'
import { join } from 'path'
import dotenv from 'dotenv'
import { getInput } from '../src/input'

beforeAll(() => {
  dotenv.config()
})

test('input', () => {
  process.env.INPUT_GIST_ID = 'gist_id'
  process.env.INPUT_GIST_DESCRIPTION = 'gist_description'
  process.env.INPUT_GIST_FILE_NAME = 'gist_file_name'
  process.env.INPUT_FILE_PATH = 'file_path'

  const input = getInput()

  expect(input.token).toBeTruthy()
  expect(input.gistId).toMatch('gist_id')
  expect(input.gistDescription).toMatch('gist_description')
  expect(input.gistFileName).toMatch('gist_file_name')
  expect(input.filePath).toMatch('file_path')
})

test('run', () => {
  const cwd = process.cwd()

  process.env.RUNNER_TEMP = join(cwd, 'tmp')
  process.env.GITHUB_WORKSPACE = cwd

  process.env.INPUT_GIST_ID = 'e885afa349a0e5d1cfb408e46d6a37bc'
  process.env.INPUT_GIST_DESCRIPTION = 'foo bar'

  const run = (): void => {
    try {
      const stdout = execSync(`node ${join(__dirname, '../lib/index.js')}`, {
        env: process.env,
        encoding: 'utf8'
      })
      console.log(stdout)
    } catch (err) {
      console.error(err)
      expect(err).toBeFalsy()
    }
  }

  process.env.INPUT_GIST_FILE_NAME = 'foo.bar'
  process.env.INPUT_FILE_PATH = '__tests__/foo.bar'
  run()

  process.env.INPUT_GIST_FILE_NAME = 'dummy.pdf'
  process.env.INPUT_FILE_PATH = '__tests__/dummy.pdf'
  process.env.INPUT_FILE_TYPE = 'binary'
  run()
})
