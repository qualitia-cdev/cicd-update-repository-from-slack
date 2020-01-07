const Octokit = require("@octokit/rest");

const octokit = new Octokit({ auth: process.env.GITHUB_API_TOKEN });
const owner = "miyauci";
const repo = "simple-git-test";

async function update() {
  octokit.repos.updateFile;
  const content = await octokit.repos.getContents({
    owner,
    repo,
    ref: "heads/master",
    path: "README.md"
  });
  console.log(content);
  const data = new Buffer.alloc(
    16,
    content.data.content,
    content.data.encoding
  ).toString();
  console.log(data);

  await octokit.repos
    .createOrUpdateFile({
      owner,
      repo,
      message: ":tada:docs(README)",
      path: "README.md",
      content: new Buffer.from(`更新したよ`).toString("base64"),
      sha: content.data.sha
      //   sha: content.data.sha
    })
    .catch(e => {
      console.log(e);
    });
}

exports.handler = async event => {
  if (!event.param)
    return {
      statusCode: 400,
      body: "Param is nessesary"
    };
  update();
  const response = {
    statusCode: 200,
    body: JSON.stringify("Starting deploy to production!")
  };
  return response;
};
