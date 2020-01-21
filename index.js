const Octokit = require("@octokit/rest");

// const octokit = new Octokit({ auth });
const octokit = new Octokit({ auth: process.env.GITHUB_API_TOKEN });

// async function update({
//   owner = "qualitia-cdev",
//   repo,
//   ref,
//   targetFilePath,
//   context
// }) {
//   const content = await octokit.repos.getContents({
//     owner,
//     repo,
//     ref,
//     path: targetFilePath
//   });

//   console.log(content);

//   await octokit.repos
//     .createOrUpdateFile({
//       owner,
//       repo,
//       message: ":tada:docs(README)",
//       path: "README.md",
//       content: new Buffer.from(context).toString("base64"),
//       sha: content.data.sha
//     })
//     .catch(e => {
//       console.log(e);
//     });
// }

// update({
//   owner: "qualitia-cdev",
//   repo: "githubapi-test",
//   ref: "heads/master",
//   targetFilePath: "README.md",
//   context: "123"
// });

// const getContent = ({ owner, repo, ref, targetFilePath }) => {
//   return octokit.repos.getContents({
//     owner,
//     repo,
//     ref,
//     path: targetFilePath
//   });
// };

// const createOrUpdate = ({
//   owner,
//   repo,
//   ref,
//   targetFilePath,
//   commitMessage,
//   sha
// }) => {
//   return octokit.repos.createOrUpdateFile({
//     owner,
//     repo,
//     ref,
//     message: commitMessage,
//     path: targetFilePath,
//     content: new Buffer.from(content).toString("base64"),
//     sha
//   });
// };

const main = async ({
  commitMessage = "auto commit",
  owner = "qualitia-cdev",
  repo,
  ref,
  targetFilePath,
  content
}) => {
  const cm = `:robot:ci(${targetFilePath}):${commitMessage}`;
  const contents = await octokit.repos
    .getContents({
      owner,
      repo,
      ref,
      path: targetFilePath
    })
    .catch(e => {
      console.log(e);
    });

  const sha = contents ? contents.data.sha : "";

  await octokit.repos
    .createOrUpdateFile({
      owner,
      repo,
      ref,
      message: cm,
      path: targetFilePath,
      content: new Buffer.from(content).toString("base64"),
      sha
    })
    .catch(e => {
      console.log(e);
    });
};

main({
  repo: "githubapi-test",
  ref: "master",
  targetFilePath: "ssssREAME.md",
  content: "123"
});

exports.handler = async event => {
  if (!event.param)
    return {
      statusCode: 400,
      body: "Parameter is nessesary"
    };

  await main({ ...event });
  const response = {
    statusCode: 200,
    body: "Starting deploy to production!"
  };
  return response;
};
