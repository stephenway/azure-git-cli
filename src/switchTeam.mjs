import config, { writeConfigToFile } from "./lib/azureConfig.mjs";
import fetchTeams from "./lib/queries/teams.mjs";
import { selectTeam } from "./lib/selectors/team.mjs";

async function switchTeam() {
  const teams = await fetchTeams();
  const selectedTeam = await selectTeam(teams);

  // Update the config with the selected team ID
  writeConfigToFile({
    ...config,
    teamId: selectedTeam.id,
    teamName: selectedTeam.name,
  });

  console.log("Configuration saved successfully.");
}

export default switchTeam;
