import azureClient from "./lib/azureClient.mjs";
import { getCurrentGitBranch } from "./lib/gitBranch.mjs";
import {
  getCurrentRepositoryName,
  fetchRepositoryId,
} from "./repositoryUtils.mjs"; // Assume these are implemented

const args = process.argv.slice(2); // Skip the first two elements (node and script path)
const storyIdArg = args.find(
  (arg) => arg.startsWith("-n=") || arg.startsWith("--number=")
);
let storyId = storyIdArg ? storyIdArg.split("=")[1] : "";

async function createPullRequestForStory(
  storyId,
  sourceBranch,
  targetBranch,
  repositoryName
) {
  const repositoryId = await fetchRepositoryId(repositoryName);
  if (!repositoryId) {
    console.log(`Repository ${repositoryName} not found.`);
    return;
  }

  const prTitle = `PR for Story ${storyId}`;
  const prDescription = `Automatically created PR for story ${storyId}.`;

  try {
    const { data: pr } = await azureClient("project").post(
      `_apis/git/repositories/${repositoryId}/pullrequests?api-version=6.0`,
      {
        sourceRefName: `refs/heads/${sourceBranch}`,
        targetRefName: `refs/heads/${targetBranch}`,
        title: prTitle,
        description: prDescription,
        reviewers: [], // Optional: Add reviewer IDs here
      }
    );

    console.log(`Pull Request created: ${pr.url}`);
  } catch (error) {
    console.error("Failed to create Pull Request:", error.message);
  }
}

async function createPR() {
  if (!storyId) {
    const branchName = await getCurrentGitBranch();
    // Assuming story branches are named with just a numeric ID
    if (/^\d+$/.test(branchName)) {
      storyId = branchName;
    } else {
      console.log("The current branch does not appear to be a story branch.");
      return;
    }
  }

  const repositoryName = await getCurrentRepositoryName(); // Dynamically get the repository name
  if (!repositoryName) {
    console.log("Could not determine the repository name.");
    return;
  }

  // Example usage with dynamically determined source branch and hardcoded target branch
  const sourceBranch = storyId;
  const targetBranch = "main"; // Adjust as necessary

  await createPullRequestForStory(
    storyId,
    sourceBranch,
    targetBranch,
    repositoryName
  );
}

export default createPR;
