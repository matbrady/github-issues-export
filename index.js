const graphql = require("graphql-request");
const json2csv = require("json2csv");
const fs = require("fs");
const argv = require("minimist")(process.argv.slice(2));
const fileName = argv.filename || "issues.csv";

const fields = [
  {
    value: "node.title",
    label: "title"
  },
  {
    value: "node.number",
    label: "number"
  },
  {
    value: "node.state",
    label: "state"
  },
  {
    value: "node.author.login",
    label: "author"
  },
  {
    value: "node.bodyText",
    label: "body"
  },
  {
    value: "node.url",
    label: "url"
  },
  {
    value: "node.milestone.id",
    label: "milestone"
  },
  {
    value: "node.labels.edges.node.name",
    label: "label"
  },
  {
    value: "node.comments",
    label: "comments"
  }
  // {
  //   value: "node.comments.edges.node.createdAt",
  //   label: "comment_createdAt"
  // },
  // {
  //   value: "node.comments.edges.node.author.avatarUrl",
  //   label: ""
  // },
  // {
  //   value: "node.comments.edges.node.author.login",
  //   label: "comment_author"
  // },
  // {
  //   value: "node.comments.edges.node.author.resourcepath",
  //   label: "comment_author_resource_path"
  // },
  // {
  //   value: "node.comments.edges.node.author.url",
  //   label: "comment_author_url"
  // }
];

const client = new graphql.GraphQLClient("https://api.github.com/graphql", {
  headers: {
    Authorization: `Bearer ${argv.token}`,
    Accept: `application/vnd.github.v${
      argv.apiVersion ? argv.apiVersion : "4"
    }+json`
  }
});

const query = `{
  repository(owner: "${argv.owner}", name: "${argv.repo}") {
    issues(last: 10, states: OPEN, orderBy: { field: UPDATED_AT, direction: DESC } ) {
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
          comments(first: 100) {
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

function writeCsvFile(csv) {
  fs.writeFile(fileName, csv, function(err) {
    if (err) throw err;
    console.log(`${fileName} file saved`);
  });
}

client
  .request(query)
  .then(data => {
    // For each issue
    data.repository.issues.edges.forEach(issue => {
      let commentsString = "";
      // For each comment
      issue.node.comments.edges.forEach(comment => {
        // Build a string of relevant field values
        commentsString += `${comment.node.author.login} - ${
          comment.node.bodyText
        } | `;
      });
      // replace the comments object with the new string
      issue.node.comments = commentsString;
    });

    const json2csvConfig = {
      data: data.repository.issues.edges,
      fields: fields,
      includeEmptyRows: true
      // unwindPath: ["node.labels.edges", "node.comments.edges"]
    };

    json2csv(json2csvConfig, (err, csvString) => {
      writeCsvFile(csvString.replace(/[‘’]/g, `'`).replace(/[“”]/g, '"'));
    });
  })
  .catch(error => console.error(error));
