# Github Issue Exporter

A script written in Node to export Github issues into a csv file using their Graphql API.

## Getting Started

1. Create a [Personal Access Token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) on Github _(required to access the api)_
2. Clone this repo
3. Modify your graphql query in [`index.js`](https://github.com/matbrady/github-issues-export/blob/master/index.js#L32-L73)
4. Run the script

## Running the Script

```shell
node index.js --token YOUR_TOKEN --owner REPO_OWNER --repo REPO_NAME
```

### Script Options

```
Usage: node index.js [options]

  Options:

    --token    [value]      Github OAuth token
    --owner    [value]      Github repo owner name
    --repo     [value]      Github repo name
    --filename [value]      Export file name
```

## Modifying the Query

You can modify the query by adjusting the `query` string contained in the [`index.js`](https://github.com/matbrady/github-issues-export/blob/master/index.js#L32-L73) file. Without any modifications, the script will export the **last 100 open issues with their labels and comments**.
