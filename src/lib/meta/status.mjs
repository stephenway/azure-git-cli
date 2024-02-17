import chalk from "chalk";

// Mapping of states to their respective chalk color methods
const stateColorMap = {
  New: chalk.hex("#808080"), // Grey
  Ready: chalk.hex("#808080"), // Grey
  Removed: chalk.hex("#808080"), // Grey
  "In Requirements": chalk.hex("#FFD700"), // Yellow
  "Quality Assurance": chalk.hex("#FFD700"), // Yellow
  Groomed: chalk.hex("#800080"), // Purple
  "PM Reviewed": chalk.hex("#FFC0CB"), // Pink
  "Refinement Needed": chalk.hex("#FFC0CB"), // Pink
  Development: chalk.hex("#00FFFF"), // Cyan
  Accepted: chalk.hex("#008000"), // Green
  "Release Candidate": chalk.hex("#008000"), // Green
  Done: chalk.hex("#008000"), // Green
  Blocked: chalk.hex("#FF0000"), // Red
};

export function renderStatus(status) {
  const colorFunc = stateColorMap[status] || chalk.white;
  return colorFunc("●") + ` ${status}`;
}
