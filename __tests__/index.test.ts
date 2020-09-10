import * as cp from 'child_process'
import * as path from 'path'
import dotenv from 'dotenv'
import { getInputs } from '../src/inputs'

test('input', () => {
  process.env['INPUT_GIST_ID'] = 'test_gist_id'
  process.env['INPUT_GIST_FILE_NAME'] = 'test_gist_file_name'
  process.env['INPUT_FILE_PATH'] = 'test_file_path'

  const inp = getInputs()

  expect(inp.Token).toMatch('')
  expect(inp.GistID).toMatch('test_gist_id')
  expect(inp.GistFileName).toMatch('test_gist_file_name')
  expect(inp.FilePath).toMatch('test_file_path')
})

test('run', () => {
  dotenv.config()
  process.env['GITHUB_WORKSPACE'] = process.cwd()
  process.env['INPUT_GIST_ID'] = 'e885afa349a0e5d1cfb408e46d6a37bc'
  process.env['INPUT_GIST_FILE_NAME'] = 'foo.bar'
  process.env['INPUT_FILE_PATH'] = '__tests__/foo.bar'

  const ip = path.join(__dirname, '..', 'lib', 'index.js')
  cp.execSync(`node ${ip}`, { env: process.env })
})
