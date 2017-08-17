# Github Issue Exporter

A script written in Node to export Github issues into a csv file using their Graphql API.

## Running the Script

```shell
node index.js --token YOUR_TOKEN --owner REPO_OWNER --repo REPO_NAME
```

### Script Options

```
Usage: node index.js [options]

  Options:

    --token [value]             Github OAuth token
    --owner [value]             Github repo owner name
    --repo  [value]             Github repo name
```

## Modifying the Query
