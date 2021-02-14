import { execSync } from 'child_process'
import path from 'path'
import dotenv from 'dotenv'
import { getInput } from '../src/input'

test('input', () => {
  process.env.INPUT_GIST_ID = 'gist_id'
  process.env.INPUT_GIST_FILE_NAME = 'gist_file_name'
  process.env.INPUT_FILE_PATH = 'file_path'

  const input = getInput()

  expect(input.Token).toMatch('')
  expect(input.GistID).toMatch('gist_id')
  expect(input.GistFileName).toMatch('gist_file_name')
  expect(input.FilePath).toMatch('file_path')
})

test('run', () => {
  dotenv.config()
  process.env.GITHUB_WORKSPACE = process.cwd()
  process.env.INPUT_GIST_ID = 'e885afa349a0e5d1cfb408e46d6a37bc'
  process.env.INPUT_GIST_FILE_NAME = 'foo.bar'
  process.env.INPUT_FILE_PATH = '__tests__/foo.bar'

  const filePath = path.join(__dirname, '..', 'lib', 'index.js')
  execSync(`node ${filePath}`, { env: process.env })
})
