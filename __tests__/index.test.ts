import { execSync } from 'child_process'
import { join } from 'path'
import dotenv from 'dotenv'
import { author } from '../package.json'

beforeAll(() => {
  dotenv.config()
})

test('run', () => {
  const cwd = process.cwd()

  process.env.RUNNER_TEMP = join(cwd, 'tmp')
  process.env.GITHUB_ACTOR = author.name
  process.env.GITHUB_WORKSPACE = cwd

  process.env.INPUT_GIST_DESCRIPTION = 'foo bar'

  const run = (): void => {
    try {
      const stdout = execSync(`node ${join(__dirname, '../lib/src/index.js')}`, {
        env: process.env,
        encoding: 'utf8'
      })
      console.log(stdout)
    } catch (err) {
      console.warn(err)
      expect(err).toBeFalsy()
    }
  }

  process.env.INPUT_GIST_ID = 'e885afa349a0e5d1cfb408e46d6a37bc'
  process.env.INPUT_GIST_FILE_NAME = 'foo.bar'
  process.env.INPUT_FILE_PATH = '__tests__/foo.bar'
  run()

  delete process.env.INPUT_GIST_ID
  process.env.INPUT_CREATE_AS_PUBLIC = 'false'
  process.env.INPUT_GIST_FILE_NAME = 'dummy.pdf'
  process.env.INPUT_FILE_PATH = '__tests__/dummy.pdf'
  process.env.INPUT_FILE_TYPE = 'binary'
  run()
})
