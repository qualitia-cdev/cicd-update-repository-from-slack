const Octokit = require("@octokit/rest");
const octokit = new Octokit({ auth: process.env.GITHUB_API_TOKEN });

const main = async ({
  commitMessage = "auto commit",
  owner = "qualitia-cdev",
  ref = "master",
  repo,
  target_file_path,
  commit_sha
}) => {
  const cm = `:robot:ci(${target_file_path}):${commitMessage}`;
  const repoName = repo.slice(repo.indexOf("/") + 1);

  const contents = await octokit.repos
    .getContents({
      owner,
      repo: repoName,
      path: target_file_path,
      ref: commit_sha
    })
    .catch(e => {
      console.log(e);
    });

  const sha = contents ? contents.data.sha : "";
  const refToProd = ref.replace("develop", "prod");

  await octokit.repos
    .createOrUpdateFile({
      owner,
      repo: repoName,
      ref,
      message: cm,
      path: refToProd,
      content: contents.data.content,
      sha
    })
    .catch(e => {
      console.log(e);
    });
};

exports.handler = async event => {
  await main({ ...event });
  const response = {
    statusCode: 200,
    body: "Starting deploy to production!"
  };
  return response;
};
