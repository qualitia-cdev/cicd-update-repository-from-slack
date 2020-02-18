const Octokit = require("@octokit/rest");
const octokit = new Octokit({ auth: process.env.GITHUB_API_TOKEN });

const OWNER = "qualitia-cdev";
const COMMIT_MESSAGE = "Auto commit";

const main = async ({ ref = "master", repo, target_file_path, commit_sha }) => {
  const repoName = repo.slice(repo.indexOf("/") + 1);
  const refToProd = target_file_path.replace("develop", "prod");
  const cm = `:robot:ci(${refToProd}):${COMMIT_MESSAGE}`;

  const contents = await octokit.repos
    .getContents({
      owner: OWNER,
      repo: repoName,
      path: target_file_path,
      ref: commit_sha
    })
    .catch(e => {
      console.log(e);
      throw "Error";
    });

  const prodContents = await octokit.repos
    .getContents({
      owner: OWNER,
      repo: repoName,
      path: refToProd,
      ref: commit_sha
    })
    .catch(e => {
      console.log(e);
      throw "Error";
    });

  if (prodContents) {
    await octokit.repos
      .createOrUpdateFile({
        owner: OWNER,
        repo: repoName,
        ref,
        message: cm,
        path: refToProd,
        content: contents.data.content,
        sha: prodContents.data.sha
      })
      .catch(e => {
        console.log(e);
        throw "Error";
      });
  } else {
    await octokit.repos
      .createOrUpdateFile({
        owner: OWNER,
        repo: repoName,
        ref,
        message: cm,
        path: refToProd,
        content: contents.data.content
      })
      .catch(e => {
        console.log(e);
        throw "Error";
      });
  }
};

exports.handler = async event => {
  await main({ ...event }).catch(() => {
    return {
      statusCode: 400,
      body: "Fail to deploy.."
    };
  });

  return {
    statusCode: 200,
    body: "Starting deploy to production!"
  };
};
