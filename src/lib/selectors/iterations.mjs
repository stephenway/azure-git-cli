import inquirer from "inquirer";
import fetchIterations from "../queries/iterations.mjs";

export async function selectIteration() {
  const iterations = await fetchIterations(true);
  const choices = iterations.map((iteration) => ({
    name: `${iteration.name}${
      iteration.timeFrame === "current" ? " (current)" : ""
    }`,
    value: iteration.path,
  }));

  // Optionally sort or manipulate the list to identify the current iteration
  // For simplicity, we're assuming the first one is the current iteration
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "selectedIterationPath",
      message: "Select an iteration:",
      choices,
      // Assuming the first iteration is the current one
      default: choices.find((c) => c.name.includes("current")).value,
    },
  ]);

  return answer.selectedIterationPath;
}
