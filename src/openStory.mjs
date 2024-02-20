#!/usr/bin/env node
import open from "open";
import fetchAssignedStories from "./lib/queries/stories.mjs";
import { fetchWorkItemsDetails } from "./lib/queries/workItems.mjs";
import config from "./lib/azureConfig.mjs";

import { selectStory } from "./lib/selectors/stories.mjs";
import { selectIteration } from "./lib/selectors/iterations.mjs";

const args = process.argv.slice(2); // Remove the first two elements

// Check for flags and remove them to isolate the story number
const storyNumber = args.find(
  (arg) => arg.startsWith("-n=") || arg.startsWith("--number=")
);
const statusUpdateArg = args.find(
  (arg) => arg.startsWith("-s=") || arg.startsWith("--status-update=")
);
const statusUpdateValue = statusUpdateArg
  ? statusUpdateArg.split("=")[1]
  : null;

const openStory = async () => {
  // Check if the current branch is a story branch before proceeding
  // const onStoryBranch = await checkIfOnStoryBranch();
  // if (onStoryBranch) return;

  // Directly use "@CurrentIteration" if no story number is provided and the flag is not present
  let selectedIterationPath = "@CurrentIteration";
  const shouldSelectIteration =
    args.includes("-i") || args.includes("--iteration");

  // Only prompt for iteration selection if the iteration flag is present and no story number is provided
  if (shouldSelectIteration && !storyNumber) {
    selectedIterationPath = `'${await selectIteration()}'`;
  }

  let selectedStoryId = storyNumber;
  if (!storyNumber) {
    // Fetch stories and prompt for selection if no story number is provided
    const storyIds = await fetchAssignedStories(selectedIterationPath);
    if (storyIds.length === 0) {
      console.log("No assigned stories found.");
      return;
    }
    const stories = await fetchWorkItemsDetails(storyIds);
    selectedStoryId = await selectStory(stories);
  }

  const url = `https://dev.azure.com/${config.organization}/${config.project}/_workitems/edit/${selectedStoryId}`;
  open(url)
    .then(() => console.log(`Opened ${url} in the default browser.`))
    .catch((err) => console.error(`Failed to open ${url}:`, err));
  // Proceed with creating a branch and updating the work item status
  // createGitBranch(selectedStoryId);

  // Update the work item status if the --status-update flag was provided with a value
  // if (statusUpdateValue) {
  //   await updateWorkItemStatus(selectedStoryId, statusUpdateValue);
  // }
};

export default openStory;
