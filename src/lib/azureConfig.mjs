import fs from "fs";
import path from "path";
import os from "os";

// Define the path to the configuration file
export const configFilePath = path.join(os.homedir(), ".azurerc");

export function writeConfigToFile(config) {
  fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), "utf8");
}

// Read and parse the configuration file
let config = {};
try {
  const configFileContent = fs.readFileSync(configFilePath, "utf8");
  config = JSON.parse(configFileContent);
} catch (error) {
  console.error("Failed to read the configuration file:", error.message);
  // Handle error appropriately - maybe throw an error or exit if the config is essential
}

export default config;
