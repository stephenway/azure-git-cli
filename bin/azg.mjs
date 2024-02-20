#!/usr/bin/env node
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import setup from "../src/setup.mjs";
import switchTeam from "../src/switchTeam.mjs";
import status from "../src/status.mjs";
import checkoutStory from "../src/checkoutStory.mjs";
import changeStatus from "../src/changeStatus.mjs";
import getStoryInfo from "../src/getStoryInfo.mjs";
import openStory from "../src/openStory.mjs";

yargs(hideBin(process.argv))
  .command(
    "setup",
    "Create a configuration file for using this tool.",
    () => {},
    async () => await setup()
  )
  .command(
    "team",
    "Switch to different team in the same project",
    () => {},
    async () => await switchTeam()
  )
  .command(
    "status",
    "Brief overview of where your project is at",
    () => {},
    async () => await status()
  )
  .command(
    "info",
    "Get info on the current story",
    () => {},
    async () => await getStoryInfo()
  )
  .command(
    "open",
    "Open and view the specified story",
    () => {},
    async () => await openStory()
  )
  .command(
    "checkout",
    "Create and switch to a branch for the specified story",
    () => {},
    async () => await checkoutStory()
  )
  .command(
    "update-story",
    "Update the status of a specified story",
    (yargs) => {
      yargs
        .option("number", {
          describe: "The ID number of the story to update",
          type: "number",
          demandOption: false,
        })
        .option("status", {
          describe: "The new status to set for the story",
          type: "string",
          demandOption: false,
        });
    },
    async (argv) => {
      // Assuming you have a function to handle the story update
      await changeStatus(argv.number, argv.status);
    }
  )
  .help("h")
  .alias("h", "help")
  .showHelpOnFail(true)
  .demandCommand(1, "You must provide a valid command.")
  .example([
    [
      "$0 checkout --number=12345",
      "Create and switch to a branch for story 12345",
    ],
  ])
  .parse();
