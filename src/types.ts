import type { getOctokit } from '@actions/github'

export interface ActionInput {
  readonly token: string
  readonly gistId: string | undefined
  readonly createAsPublic: boolean | undefined
  readonly gistDescription: string | undefined
  readonly gistFileName: string | undefined
  readonly filePath: string
  readonly fileType: string | undefined
}

type ActionOctokit = ReturnType<typeof getOctokit>

export interface ActionContext {
  readonly input: ActionInput
  readonly octokit: ActionOctokit
  createdGistId?: string
}
