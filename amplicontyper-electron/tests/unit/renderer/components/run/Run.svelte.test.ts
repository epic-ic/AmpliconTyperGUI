import { describe, expect, test, beforeAll } from "vitest";
import RunRelatedComponentInTestContext from "./RunRelatedComponentInTestContext.svelte";
import { screen, render } from "@testing-library/svelte";
import { mockAmpliconTyperAPI } from "../../../MockAmpliconTyperAPI.svelte";

describe("Run", () => {
  test("renders as expected when AmpliconTyper has not started running", async () => {
    await mockAmpliconTyperAPI({ running: false });
    render(RunRelatedComponentInTestContext, {
      props: {
        componentName: "Run"
      }
    });
    expect(screen.getByTestId("new-run-title")).toHaveTextContent("New Run");
    expect(screen.queryByTestId("logs")).toBeNull();
  });

  test("render as expected when AmpliconTyper has started running", async () => {
    await mockAmpliconTyperAPI({
      running: true,
      log: ["log entry 1", "log entry 2"]
    });
    render(RunRelatedComponentInTestContext, {
      props: {
        componentName: "Run"
      }
    });
    expect(screen.getByTestId("logs")).toHaveTextContent(/log entry 1log entry 2/);
    expect(screen.queryByTestId("new-run-title")).toBeNull();
  });
});
