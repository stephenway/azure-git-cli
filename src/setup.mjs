#!/usr/bin/env node

import inquirer from "inquirer";

import { writeConfigToFile } from "./lib/azureConfig.mjs";
import switchTeam from "./switchTeam.mjs";

async function promptForConfig() {
  const responses = await inquirer.prompt([
    {
      name: "organization",
      message: "Enter your Azure DevOps organization:",
    },
    {
      name: "project",
      message: "Enter your Azure DevOps project:",
    },
    {
      name: "personalAccessToken",
      message:
        "Enter your Azure DevOps personal access token (converted to base 64):",
      type: "password",
    },
    {
      name: "userEmail",
      message: "Enter your Azure DevOps user email:",
    },
  ]);

  return responses;
}

async function setup() {
  const config = await promptForConfig();
  writeConfigToFile(config);

  await switchTeam();
}

export default setup;
