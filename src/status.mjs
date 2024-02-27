import fetchAssignedStories from "./lib/queries/stories.mjs";
import { fetchWorkItemsDetails } from "./lib/queries/workItems.mjs";
import config from "./lib/azureConfig.mjs";
import { renderStatus } from "./lib/meta/status.mjs";

const status = async () => {
  const statuses = [
    "New",
    "Ready",
    "In Requirements",
    "Groomed",
    "PM Reviewed",
    "Refinement Needed",
    "Development",
    "Quality Assurance",
    "Accepted",
    "Release Candidate",
    "Blocked",
    "Done",
    "Removed",
  ];

  const iterationPathArg = process.argv
    .find((arg) => arg.startsWith("-i=") || arg.startsWith("--iteration="))
    .split("=")[1];
  // Example "@CurrentIteration + 1"
  const iteration = iterationPathArg || "@CurrentIteration";
  console.log({ iteration });

  const storyIds = await fetchAssignedStories(iteration);
  if (storyIds.length === 0) {
    console.log("No assigned stories found.");
    return;
  }

  const stories = await fetchWorkItemsDetails(storyIds);
  if (stories.length === 0) {
    console.log("No details found for the assigned stories.");
    return;
  }

  console.log(`Working on ${config.project} with ${config.teamName}`);
  console.log("");

  console.log("Assigned Stories by Status:");
  statuses.forEach((status) => {
    const filteredStories = stories
      .filter((story) => story.state === status)
      .map((story) => story.id);
    if (filteredStories.length > 0) {
      console.log(`  ${renderStatus(status)}:`, filteredStories.join(", "));
    }
  });
};

export default status;
