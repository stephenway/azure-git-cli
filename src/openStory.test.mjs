import open from "open";
import { describe, it, expect, vi, beforeEach } from "vitest";

import openStory from "./openStory.mjs";
import fetchAssignedStories from "./lib/queries/stories.mjs";

// Mock external modules
vi.mock("open", () => ({
  default: vi.fn().mockResolvedValue("mocked open"),
}));

vi.mock("./lib/queries/stories.mjs", () => ({
  default: vi.fn(() => Promise.resolve(["12345"])),
}));

vi.mock("./lib/queries/workItems.mjs", () => ({
  fetchWorkItemsDetails: vi
    .fn()
    .mockResolvedValue([{ id: "12345", title: "Test Story" }]),
}));

vi.mock("./lib/azureConfig.mjs", () => ({
  default: { organization: "testOrg", project: "testProject" },
}));

vi.mock("./lib/selectors/stories.mjs", () => ({
  selectStory: vi.fn().mockResolvedValue("12345"),
}));

vi.mock("./lib/selectors/iterations.mjs", () => ({
  selectIteration: vi.fn().mockResolvedValue("CurrentIteration"),
}));

beforeEach(() => {
  // Reset all mocks to their initial mocked state
  vi.resetModules();

  // Spy on console.log before each test
  vi.spyOn(console, "log").mockImplementation(() => {});
});

// Test suite
describe("openStory script", () => {
  it("should open a story with a specified number", async () => {
    process.argv = ["node", "script.mjs", "--number=12345"];
    await openStory();

    expect(open).toHaveBeenCalledWith(expect.stringContaining("12345"));
  });

  it("should select the current iteration when no story number is provided", async () => {
    process.argv = ["node", "script.mjs"];
    await openStory();

    expect(fetchAssignedStories).toHaveBeenCalledWith("@CurrentIteration");
  });

  it("should handle the absence of assigned stories gracefully", async () => {
    vi.mocked(fetchAssignedStories).mockResolvedValueOnce([]);

    process.argv = ["node", "script.mjs"];
    await openStory();

    expect(console.log).toHaveBeenCalledWith("No assigned stories found.");
  });
});
