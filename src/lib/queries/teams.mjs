import azureClient from "../azureClient.mjs";

async function fetchTeams() {
  try {
    const response = await azureClient("organization").get(
      `_apis/teams?7.1-preview.3`
    );
    return response.data.value;
  } catch (error) {
    console.error("Failed to fetch teams:", error.message);
    process.exit(1);
  }
}

export default fetchTeams;
