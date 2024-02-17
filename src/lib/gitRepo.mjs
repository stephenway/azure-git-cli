import { promisify } from "util";
import { exec } from "child_process";
import config from "./azureConfig.mjs";

const execAsync = promisify(exec);

async function getCurrentRepositoryName() {
  try {
    const { stdout } = await execAsync("git config --get remote.origin.url");
    const url = stdout.trim();
    // Extract the repository name from the URL
    const match = url.match(/\/([^\/]+)\.git$/);
    if (match) {
      return match[1]; // The repository name
    }
  } catch (error) {
    console.error("Failed to get current repository name:", error.message);
  }
  return null;
}

export async function getCurrentRepositoryId() {
  try {
    const repositoryName = await getCurrentRepositoryName();
    if (!repositoryName) {
      console.log("Could not determine the repository name.");
      return;
    }

    const repositoryId = await fetchRepositoryId(
      config.project,
      repositoryName
    );
    if (repositoryId) {
      return repositoryId;
    }
  } catch (error) {
    console.error("Failed to get current repository ID:", error.message);
  }
  return null;
}
