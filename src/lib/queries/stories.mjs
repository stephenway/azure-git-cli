import azureClient from "../azureClient.mjs";
import config from "../azureConfig.mjs";

async function fetchAssignedStories(selectedIterationPath) {
  const wiqlUrl = `_apis/wit/wiql?api-version=7.1-preview.2`;
  try {
    const response = await azureClient("team").post(wiqlUrl, {
      // https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/wiql/query-by-wiql?view=azure-devops-rest-6.0&tabs=HTTP
      query: `SELECT [System.Id], [System.Title], [System.State] FROM WorkItems WHERE [System.AssignedTo] = '${config.userEmail}' AND [System.IterationPath] = ${selectedIterationPath} AND [System.WorkItemType] <> 'Task' AND [State] <> 'Closed' AND [State] <> 'Removed' ORDER BY [Microsoft.VSTS.Common.Priority] ASC, [System.CreatedDate] DESC`,
    });
    return response.data.workItems.map((wi) => wi.id);
  } catch (error) {
    console.error("Failed to fetch stories:", error.message);
    process.exit(1);
  }
}

export default fetchAssignedStories;
