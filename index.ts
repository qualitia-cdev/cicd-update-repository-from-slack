const Octokit = require("@octokit/rest");
const octokit = new Octokit({ auth: process.env.GITHUB_API_TOKEN });

const OWNER = "qualitia-cdev";
const COMMIT_MESSAGE = "Auto commit";

const main = async ({ ref = "master", repo, target_file_path, commit_sha, stage = "develop", next_stage = "prod" }) => {
  const repoName = repo.slice(repo.indexOf("/") + 1);
  const refToProd = target_file_path.replace(stage, next_stage);
  const short_sha = commit_sha.slice(0, 8);
  const cm = `${COMMIT_MESSAGE} ${stage}:${short_sha}→${next_stage}`;

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
      // ref: commit_sha
      ref: ref
    })
    .catch(e => {
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
  return {
    statusCode: 200,
    body: cm
  };
};

exports.handler = async event => {
  console.log(event);
  const ret = await main({ ...event }).catch(() => {
    return {
      statusCode: 400,
      body: "Fail to deploy.."
    };
  });

  return ret;
};
