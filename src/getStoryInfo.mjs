#!/usr/bin/env node
import { exec } from "child_process";
import { htmlToText } from "html-to-text";
import azureClient from "./lib/azureClient.mjs";
import { renderStatus } from "./lib/meta/status.mjs";
import { fetchAssigneesOfChildTasks } from "./lib/queries/workItems.mjs";

async function getCurrentGitBranch() {
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

function isStoryNumber(branchName) {
  // Adjust the regex pattern according to your story number format
  const pattern = /^\d+$/i;
  return pattern.test(branchName);
}

async function queryAzureDevOps(workItemId) {
  // https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/work-items/get-work-item?view=azure-devops-rest-6.0&tabs=HTTP
  const url = `_apis/wit/workitems/${workItemId}?api-version=7.1-preview.2`;
  try {
    const response = await azureClient().get(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch story:", error.message);
    process.exit(1);
  }
}

async function getStoryInfo() {
  try {
    // Parse command line arguments to look for the --id= flag
    const idArg = process.argv.find((arg) => arg.startsWith("--id="));
    let workItemId;

    if (idArg) {
      // Extract the ID value from the --id= flag
      workItemId = idArg.split("=")[1];
    } else {
      // Fallback to using the current git branch as the story number if no --id= flag is provided
      const currentBranch = await getCurrentGitBranch();
      if (!isStoryNumber(currentBranch)) {
        console.log("The current branch name is not a story number.");
        return;
      }
      // Extract the numeric part of the story number from the branch name
      workItemId = currentBranch.match(/\d+/)[0];
    }
    const workItemDetails = await queryAzureDevOps(workItemId);
    const coAssigneesRes = await fetchAssigneesOfChildTasks(workItemId);
    const coAssignees =
      coAssigneesRes.length > 0
        ? coAssigneesRes
            .map((assignee) => assignee.displayName.split("<")[0])
            .filter((item, index, self) => {
              return self.indexOf(item) === index;
            })
        : null;

    const workItemType =
      workItemDetails.fields["System.WorkItemType"].toUpperCase();

    // Convert HTML fields to text
    const title = workItemDetails.fields["System.Title"];
    const state = workItemDetails.fields["System.State"];
    let description = htmlToText(workItemDetails.fields["System.Description"], {
      wordwrap: 130,
    });

    // Handle Repro Steps for Bugs, assuming the field is "Microsoft.VSTS.TCM.ReproSteps"
    let reproSteps = workItemDetails.fields["Microsoft.VSTS.TCM.ReproSteps"]
      ? htmlToText(workItemDetails.fields["Microsoft.VSTS.TCM.ReproSteps"], {
          wordwrap: 130,
        })
      : null;

    let systemInfo = htmlToText(workItemDetails.fields["System.SystemInfo"], {
      wordwrap: 130,
    });
    let acceptanceCriteria = htmlToText(
      workItemDetails.fields["Microsoft.VSTS.Common.AcceptanceCriteria"],
      {
        wordwrap: 130,
      }
    );
    const cleanText = (text) => text.replace(/\n\s*\n\s*\n/g, "\n\n").trim();

    // Strip extra new lines
    description = cleanText(description);
    acceptanceCriteria = cleanText(acceptanceCriteria);
    reproSteps = cleanText(reproSteps);

    const bold = (text) => `\x1b[1m\x1b[34m${text}\x1b[0m`;

    // Display the information
    console.log(`${bold(`${workItemType} ${workItemDetails.id}`)}: ${title}`);
    console.log(`${bold("State")}: ${renderStatus(state)}`);
    if (description) console.log(`${bold("Description")}:\n${description}`);
    if (reproSteps) console.log(`${bold("Repro Steps")}:\n${reproSteps}`);
    if (systemInfo) console.log(`${bold("System Info")}:\n${systemInfo}`);
    if (acceptanceCriteria)
      console.log(`${bold("Acceptance Criteria")}:\n${acceptanceCriteria}`);
    if (coAssignees)
      console.log(`${bold("Co-Assignees")}: ${coAssignees.join(", ")}`);
  } catch (error) {
    console.error("Failed to display work item details:", error);
  }
}

export default getStoryInfo;
