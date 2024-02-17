import axios from "axios";
import config from "./azureConfig.mjs";

// Define the base URL and authentication headers
const BASE_URL = `https://dev.azure.com/${config.organization}/`;
const authHeaders = {
  Authorization: `Basic ${config.personalAccessToken}`,
  "Content-Type": "application/json",
  Accept: "*/*",
};

// Create the custom Axios instance
const azureClient = (level) => {
  let url = `${BASE_URL}${config.project}/`;
  switch (level) {
    case "organization":
      url = BASE_URL;
      break;
    case "team":
      url = `${BASE_URL}${config.project}/${config.teamId}/`;
      break;
  }

  return axios.create({
    baseURL: url,
    headers: authHeaders,
  });
};

export default azureClient;
