import { execSync } from 'child_process'
import path from 'path'
import dotenv from 'dotenv'
import { getInput } from '../src/input'

test('input', () => {
  process.env.INPUT_GIST_ID = 'gist_id'
  process.env.INPUT_GIST_DESCRIPTION = 'gist_description'
  process.env.INPUT_GIST_FILE_NAME = 'gist_file_name'
  process.env.INPUT_FILE_PATH = 'file_path'

  const input = getInput()

  expect(input.token).toMatch('')
  expect(input.gistId).toMatch('gist_id')
  expect(input.gistDescription).toMatch('gist_description')
  expect(input.gistFileName).toMatch('gist_file_name')
  expect(input.filePath).toMatch('file_path')
})

test('run', () => {
  process.env.GITHUB_WORKSPACE = process.cwd()
  dotenv.config()
  process.env.INPUT_GIST_ID = 'e885afa349a0e5d1cfb408e46d6a37bc'
  process.env.INPUT_GIST_DESCRIPTION = 'foo bar'
  process.env.INPUT_GIST_FILE_NAME = 'foo.bar'
  process.env.INPUT_FILE_PATH = '__tests__/foo.bar'

  const filePath = path.join(__dirname, '../lib/index.js')
  execSync(`node ${filePath}`, { env: process.env })
})
