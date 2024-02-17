import inquirer from "inquirer";
import { renderStatus } from "../meta/status.mjs";

export function renderStory(story, maxIdLength = 100) {
  const terminalWidth = process.stdout.columns - 50;
  const minTitleLength = 70;
  const maxTitleLength =
    minTitleLength < terminalWidth ? terminalWidth : minTitleLength;

  const coloredState = renderStatus(story.state);
  // Truncate title if longer than maxTitleLength
  const truncatedTitle =
    story.title.length > maxTitleLength
      ? story.title.substring(0, maxTitleLength - 3) + "..."
      : story.title;

  // Format ID and title with padding
  const idStr = story.id.toString().padEnd(maxIdLength, " ");
  const titleStr = truncatedTitle.padEnd(maxTitleLength, " ");

  return `#${idStr} ${titleStr} ${coloredState}`;
}

export function renderStories(stories) {
  // Calculate maximum lengths of each field
  const maxIdLength = Math.max(
    ...stories.map((story) => story.id.toString().length)
  );

  return stories.map((story) => ({
    name: renderStory(story, maxIdLength),
    value: story.id,
  }));
}

export async function selectStory(stories) {
  const choices = renderStories(stories);

  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "selectedStoryId",
      message: "Select a story to create a git branch for:",
      choices,
    },
  ]);

  return answer.selectedStoryId;
}
