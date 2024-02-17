import inquirer from "inquirer";

import { updateWorkItemStatus } from "./lib/queries/workItems.mjs";
import { getCurrentGitBranch } from "./lib/gitBranch.mjs";

const args = process.argv.slice(2); // Skip the first two elements (node and script path)
const storyIdArg = args.find(
  (arg) => arg.startsWith("-n=") || arg.startsWith("--number=")
);
let storyId = storyIdArg ? storyIdArg.split("=")[1] : "";
const statusArg = args.find(
  (arg) => arg.startsWith("-s=") || arg.startsWith("--status=")
);
let status = statusArg ? statusArg.split("=")[1] : "";

const validStatuses = [
  "New",
  "Ready",
  "Removed",
  "In Requirements",
  "Quality Assurance",
  "Groomed",
  "PM Reviewed",
  "Refinement Needed",
  "Development",
  "Accepted",
  "Release Candidate",
  "Done",
  "Blocked",
];

const promptForStatus = async () => {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "status",
      message: "Choose a status for the story:",
      choices: validStatuses,
    },
  ]);
  return answers.status;
};

const changeStatus = async () => {
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

  if (!status || !validStatuses.includes(status)) {
    console.log("Status not provided or invalid. Please choose a status.");
    status = await promptForStatus();
  }

  try {
    // Assuming updateWorkItemStatus is a function you have that updates the story's status
    await updateWorkItemStatus(storyId, status);
  } catch (error) {
    console.error("Failed to update story status:", error.message);
  }
};

export default changeStatus;
