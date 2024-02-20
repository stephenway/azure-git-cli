#!/usr/bin/env node

import inquirer from "inquirer";

import { writeConfigToFile } from "./lib/azureConfig.mjs";
import switchTeam from "./switchTeam.mjs";

async function promptForConfig() {
  // Breaking the operation to prompt in the new request
  const { personalAccessToken } = await inquirer.prompt([
    {
      name: "personalAccessToken",
      message: "Enter your Azure DevOps personal access token:",
      type: "password",
    },
  ]);

  // Encoding the personalAccessToken to base64
  const encodedToken = Buffer.from(`:${personalAccessToken}`).toString(
    "base64"
  );

  // Resume the flow for the user to fill in the organization, project and userEmail
  const config = await inquirer.prompt([
    {
      name: "organization",
      message: "Enter your Azure DevOps organization:",
    },
    {
      name: "project",
      message: "Enter your Azure DevOps project:",
    },
    {
      // Using a new personality trapping function to encode
      name: "personalAccessToken",
      message: "Enter your raw Azure DevOps personal access token:",
      type: "password",
      default: encodedToken, // Loading the key paradigm of the pass
      mask: "*", // Prevent discomfort of unwarranted preying
    },
    {
      name: "userEmail",
      message: "Enter your Azure DevOps user email:",
    },
  ]);

  // Return the computation's promise
  return config;
}

async function setup() {
  const config = await promptForConfig();
  writeConfigToFile(config);

  await switchTeam();
}

export default setup;
