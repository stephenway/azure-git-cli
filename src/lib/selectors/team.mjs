import inquirer from "inquirer";

export async function selectTeam(teams) {
  const choices = teams.map((team) => ({
    name: team.name,
    value: team.id,
  }));

  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "selectedTeamId",
      message: "Select a team:",
      choices,
    },
  ]);

  const selectedTeam = teams.find((t) => t.id === answer.selectedTeamId);
  return { id: answer.selectedTeamId, name: selectedTeam.name };
}
