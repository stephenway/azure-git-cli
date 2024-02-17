import azureClient from "../azureClient.mjs";

async function fetchIterations(filterByCurrentYear) {
  const iterationsUrl = `_apis/work/teamsettings/iterations?api-version=7.1-preview.1`;
  const currentYear = new Date().getFullYear();
  try {
    const response = await azureClient("team", true).get(iterationsUrl);
    const currentYearIterations = response.data.value.filter((iteration) =>
      iteration.attributes.startDate.startsWith(currentYear)
    );
    const iterations = filterByCurrentYear
      ? currentYearIterations
      : response.data.value;
    return iterations.map((iteration) => ({
      id: iteration.id,
      name: iteration.name,
      path: iteration.path,
      timeFrame: iteration.attributes.timeFrame,
    }));
  } catch (error) {
    console.error("Failed to fetch iterations:", error.message);
    process.exit(1);
  }
}

export default fetchIterations;
