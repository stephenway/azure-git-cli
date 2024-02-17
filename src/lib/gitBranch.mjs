import { exec } from "child_process";

export async function getCurrentGitBranch() {
  return new Promise((resolve, reject) => {
    exec("git rev-parse --abbrev-ref HEAD", (error, stdout, stderr) => {
      if (error) {
        console.error("Failed to get current Git branch:", error.message);
        reject(error);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

export async function checkIfOnStoryBranch() {
  const currentBranch = await getCurrentGitBranch();
  // Assuming story branches are named with the pattern "<ID>" or just "<ID>"
  const isStoryBranch = /^\d+$|^\d+$/.test(currentBranch);
  if (isStoryBranch) {
    console.log(`You are already on a story branch: ${currentBranch}`);
    return true;
  }
  return false;
}

export function createGitBranch(branchName) {
  // Check if the branch already exists
  exec(`git rev-parse --verify ${branchName}`, (error, stdout, stderr) => {
    if (!error) {
      // If the command didn't error, the branch exists
      console.log(`Branch '${branchName}' already exists. Switching to it.`);
      exec(`git checkout ${branchName}`, (checkoutError) => {
        if (checkoutError) {
          console.error(`Error switching to branch: ${checkoutError.message}`);
        } else {
          console.log(`Switched to existing branch: ${branchName}`);
        }
      });
    } else {
      // The branch does not exist, create it
      exec(`git checkout -b ${branchName}`, (createError) => {
        if (createError) {
          console.error(`Error creating branch: ${createError.message}`);
        } else {
          console.log(`Created and switched to new branch: ${branchName}`);
        }
      });
    }
  });
}
