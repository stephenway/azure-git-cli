import fetchAssignedStories from "./lib/queries/stories.mjs";
import { fetchWorkItemsDetails } from "./lib/queries/workItems.mjs";
import config from "./lib/azureConfig.mjs";
import { renderStatus } from "./lib/meta/status.mjs";

const status = async () => {
  const storyIds = await fetchAssignedStories("@CurrentIteration");
  if (storyIds.length === 0) {
    console.log("No assigned stories found.");
    return;
  }

  const stories = await fetchWorkItemsDetails(storyIds);
  // Check if stories were successfully fetched
  if (stories.length === 0) {
    console.log("No details found for the assigned stories.");
    return;
  }

  console.log(`Working on ${config.project} with ${config.teamName}`);
  console.log("");

  // Separate stories by status
  const readyStories = stories
    .filter((story) => story.state === "Ready")
    .map((story) => story.id);
  const developmentStories = stories
    .filter((story) => story.state === "Development")
    .map((story) => story.id);
  const qaStories = stories
    .filter((story) => story.state === "Quality Assurance")
    .map((story) => story.id);
  const blockedStories = stories
    .filter((story) => story.state === "Blocked")
    .map((story) => story.id);

  // Output IDs of stories by status
  console.log("Assigned Stories by Status:");
  if (readyStories.length > 0) {
    console.log(`  ${renderStatus("Ready")}:`, readyStories.join(", "));
  }
  if (developmentStories.length > 0) {
    console.log(
      `  ${renderStatus("Development")}:`,
      developmentStories.join(", ")
    );
  }
  if (qaStories.length > 0) {
    console.log(
      `  ${renderStatus("Quality Assurance")}:`,
      qaStories.join(", ")
    );
  }
  if (blockedStories.length > 0) {
    console.log(`  ${renderStatus("Blocked")}:`, blockedStories.join(", "));
  }
};

export default status;
