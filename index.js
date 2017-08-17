const graphql = require("graphql-request");
const json2csv = require("json2csv");
const fs = require("fs");
const argv = require("minimist")(process.argv.slice(2));
const fileName = "issues.csv";

const fields = [
  "node.title",
  "node.number",
  "node.state",
  "node.author.login",
  "node.bodyText",
  "node.url",
  "node.milestone.id",
  "node.labels.edges.node.name",
  "node.comments.edges.node.bodyText",
  "node.comments.edges.node.createdAt",
  "node.comments.edges.node.author.avatarUrl",
  "node.comments.edges.node.author.login",
  "node.comments.edges.node.author.resourcepath",
  "node.comments.edges.node.author.url"
];

const client = new graphql.GraphQLClient("https://api.github.com/graphql", {
  headers: {
    Authorization: `Bearer ${argv.token}`
  }
});

// console.log(argv);

const query = `{
  repository(owner: "${argv.owner}", name: "${argv.repo}") {
    issues(last: 100, states: OPEN) {
      edges {
        node {
          title
          number
          state
          author {
            login
          }
          bodyText
          url
          milestone {
            id
          }
          labels(first: 10) {
            edges {
              node {
                name
              }
            }
          }
          comments(last: 3) {
            edges {
              node {
                author {
                  avatarUrl
                  login
                  resourcePath
                  url
                }
                bodyText
                createdAt
              }
            }
          }
        }
      }
    }
  }
}`;

client
  .request(query)
  .then(data => {
    const json2csvConfig = {
      data: data.repository.issues.edges,
      fields: fields,
      includeEmptyRows: true,
      unwindPath: ["node.labels.edges", "node.comments.edges"]
    };
    const csv = json2csv(json2csvConfig);

    fs.writeFile(fileName, csv, function(err) {
      if (err) throw err;
      console.log(`${fileName} file saved`);
    });
  })
  .catch(error => console.error(error));
