# Deploy to Gist

[![test](https://github.com/exuanbo/actions-deploy-gist/workflows/test/badge.svg?branch=main&event=push)](https://github.com/exuanbo/actions-deploy-gist/actions?query=workflow%3Atest)

## Getting started

```yml
- name: Deploy
  uses: exuanbo/actions-deploy-gist@v1
  with:
    token: ${{ secrets.TOKEN }}
    gist_id: if_you_don't_have_then_create_one
    gist_file_name: foo.bar
    file_path: ./dist/foo.bar
```

## License

[MIT](https://github.com/exuanbo/actions-deploy-gist/blob/master/LICENSE)
