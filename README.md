# Deploy to Gist

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/exuanbo/actions-deploy-gist)](https://github.com/exuanbo/actions-deploy-gist/releases)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/exuanbo/actions-deploy-gist/test/main?event=push)](https://github.com/exuanbo/actions-deploy-gist/actions?query=workflow%3Atest)
[![libera manifesto](https://img.shields.io/badge/libera-manifesto-lightgrey.svg)](https://liberamanifesto.com)

This is a Github Action to deploy your file to Github Gist.

## Quick start

```yml
- uses: actions/checkout@v2
- name: Deploy
  uses: exuanbo/actions-deploy-gist@v1
  with:
    token: ${{ secrets.TOKEN }}
    gist_id: from_your_gist_url
    gist_file_name: foo.bar
    file_path: ./dist/foo.bar
```

## Setup

### Prep work

1. Create a public gist if you don't have one.
1. Generate a new [Personal access token](https://github.com/settings/tokens/). Only the `gist` scope is needed. Check [Scopes for OAuth Apps](https://docs.github.com/en/developers/apps/scopes-for-oauth-apps) for details.

### Project setup

1. Go to the repo **Settings > Secrets**. Add the generated token as `TOKEN`.
1. Edit workflow file `.github/workflows/deploy.yml` as the example above.

### Options

#### `gist_id`

The id portion from your gist url, e.g. `https://gist.github.com/exuanbo/`**`e885afa349a0e5d1cfb408e46d6a37bc`**.

#### `gist_file_name`

Name of the file to be added in your gist. If not provided, the original file name from `file_path` will be used.

#### `file_path`

Relative to your repo's root directory, e.g. `./dist/foo.bar`.

## License

[MIT](https://github.com/exuanbo/actions-deploy-gist/blob/main/LICENSE)
