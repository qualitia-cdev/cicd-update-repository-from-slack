const Octokit = require("@octokit/rest");
const auth = "a2d20841fd526f2206bc43ae141ad62cfc246b12";
const octokit = new Octokit({ auth });
// const octokit = new Octokit({ auth: process.env.GITHUB_API_TOKEN });

// const owner = "qualitia-cdev";
// const repo = "githubapi-test";
// const commit_sha = "1ec9d4fc14455349766f4fac4de953949747caee";
// const a = async () => {
//   const b = await octokit.git.getCommit({
//     owner,
//     repo,
//     commit_sha
//   });
//   console.log(12, b);
//   // const data = new Buffer.from(b.data.content, b.data.encoding).toString();
//   // console.log(data);

//   const contents = await octokit.repos.getContents({
//     owner,
//     repo,
//     path: targetPath,
//     ref: commit_sha
//   });

//   const content = new Buffer.from(
//     contents.data.content,
//     contents.data.encoding
//   ).toString();

//   console.log(data);
// };
// // a();

// const b = async () => {
//   const content = await octokit.repos.getContents({
//     owner,
//     repo,
//     ref: "heads/master", // さっき作ったブランチの情報をとってくる
//     path: "README.md" // ファイルパス
//   });

//   console.log(content);

//   // とってきたデータをデコードする
//   const data = new Buffer.from(
//     content.data.content,
//     content.data.encoding
//   ).toString();

//   console.log(data);
// };

// const c = async () => {
//   const tree = await octokit.git.getTree({
//     owner,
//     repo,
//     tree_sha: "4a8716b8420c7bec9edb1ce15a4a9e549182dc8b"
//   });

//   console.log(tree.data.tree);
//   console.log(tree.data.tree[0].sha);

//   const blob = await octokit.git.getBlob({
//     owner,
//     repo,
//     file_sha: "a3f9db31ee042ed4cd4ac305c5b7f37a8f4488ba"
//   });

//   console.log("blob", blob);
//   console.log("blob", blob.data.content);

//   const data = new Buffer.from(
//     blob.data.content,
//     blob.data.encoding
//   ).toString();
//   console.log(1222, data);
// };
// c();
// b();
// a();
// c();
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
  ref = "master",
  repo,
  target_file_path,
  commit_sha
}) => {
  const cm = `:robot:ci(${target_file_path}):${commitMessage}`;
  const repoName = repo.slice(repo.indexOf("/") + 1);
  console.log(1111111, repoName);

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

  // const content = new Buffer.from(
  //   contents.data.content,
  //   contents.data.encoding
  // ).toString();

  // const contents = await octokit.repos
  //   .getContents({
  //     owner,
  //     repo,
  //     ref,
  //     path: target_file_Path
  //   })
  //   .catch(e => {
  //     console.log(e);
  //   });
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

// main({
//   repo: "githubapi-test",
//   ref: "master",
//   targetFilePath: "ssssREAME.md",
//   content: "123"
// });

exports.handler = async event => {
  // if (!event.param)
  //   return {
  //     statusCode: 400,
  //     body: "Parameter is nessesary"
  //   };

  await main({ ...event });
  const response = {
    statusCode: 200,
    body: "Starting deploy to production!"
  };
  return response;
};
