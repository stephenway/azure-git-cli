import azureClient from "../azureClient.mjs";

export async function fetchAssigneesOfChildTasks(workItemId) {
  const client = azureClient("project"); // Use the project-level client
  try {
    // Fetch work item relations
    const { data: workItem } = await client.get(
      `_apis/wit/workitems/${workItemId}?$expand=relations&api-version=6.0`
    );
    const childLinks = workItem.relations?.filter(
      (relation) => relation.rel === "System.LinkTypes.Hierarchy-Forward"
    );

    if (!childLinks || childLinks.length === 0) {
      console.log("No child tasks found.");
      return [];
    }

    // Extract child task IDs from the URL
    const childTaskIds = childLinks
      .map((link) => {
        const match = link.url.match(/\/(\d+)$/); // Extract the ID from the URL
        return match ? match[1] : null;
      })
      .filter((id) => id !== null);

    // Fetch details for each child task
    const childTasksResponses = await Promise.all(
      childTaskIds.map((id) =>
        client.get(`_apis/wit/workitems/${id}?api-version=6.0`)
      )
    );
    const childTasks = childTasksResponses.map((response) => response.data);

    // Extract assignee information
    const assignees = childTasks
      .map((task) => task.fields["System.AssignedTo"])
      .filter((assignee) => assignee !== undefined);

    return assignees;
  } catch (error) {
    console.error("Failed to fetch assignees of child tasks:", error.message);
    return [];
  }
}

export async function fetchWorkItemsDetails(ids) {
  if (!ids.length) return []; // Return early if there are no IDs
  const detailsUrl = `_apis/wit/workitems?ids=${ids.join(",")}&api-version=6.0`;
  try {
    const response = await azureClient().get(detailsUrl);
    // console.log(JSON.stringify(response.data.value));
    return response.data.value.map((item) => ({
      id: item.id,
      title: item.fields["System.Title"],
      state: item.fields["System.State"],
      storyPoints: item.fields["Microsoft.VSTS.Scheduling.StoryPoints"],
    }));
  } catch (error) {
    console.error("Failed to fetch work item details:", error.message);
    process.exit(1);
  }
}

export async function updateWorkItemStatus(workItemId, newState) {
  const updateUrl = `_apis/wit/workitems/${workItemId}?suppressNotifications=true&api-version=7.1-preview.3`;

  const updateBody = [
    {
      op: "add",
      path: "/fields/System.State",
      value: newState,
    },
  ];

  try {
    const response = await azureClient().patch(updateUrl, updateBody, {
      headers: {
        "Content-Type": "application/json-patch+json",
      },
    });

    console.log(`Work item ${workItemId} updated to state: ${newState}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to update work item ${workItemId}:`, error.message);
    process.exit(1);
  }
}
