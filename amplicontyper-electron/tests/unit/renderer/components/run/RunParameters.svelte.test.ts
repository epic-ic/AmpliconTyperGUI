import { describe, expect, test, beforeEach, beforeAll, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/svelte";
import RunRelatedComponentInTestContext from "./RunRelatedComponentInTestContext.svelte";
import { mockAmpliconTyperAPI } from "../../../MockAmpliconTyperAPI.svelte";
import { screen } from "@testing-library/svelte";
import {
  defaultRunParameters,
  runParameters,
  appState
} from "../../../../../src/renderer/src/lib/store.svelte";

describe("RunParameters", () => {
  const user = userEvent.setup();

  let mockAPI;

  const initialiseParameters = (): void => {
    // reset runParameters in store
    const defaultValues = defaultRunParameters();

    Object.keys(defaultValues).forEach((key) => {
      runParameters[key] = defaultValues[key];
    });
  };

  beforeAll(async () => {
    mockAPI = await mockAmpliconTyperAPI({});
  });

  beforeEach(() => {
    appState.doneInitialSubmit = false;
    initialiseParameters();

    const mockShowOpenFileDialog = vi.fn().mockImplementation((options) => {
      if (options.title == "BAM folder") {
        return "/test/bams";
      }
      if (options.title == "Model file") {
        return "/test/model.pkl";
      }
      throw new Error("unexpected title");
    });

    const mockShowSaveFileDialog = vi.fn().mockImplementation((options) => {
      if (options.title == "Output report file name") {
        return "/test/output.html";
      }
    });

    window.api = {
      showOpenFileDialog: mockShowOpenFileDialog,
      showSaveFileDialog: mockShowSaveFileDialog
    };
  });

  test("renders as expected", async () => {
    render(RunRelatedComponentInTestContext, {
      props: { componentName: "RunParameters" }
    });

    expect(screen.getByLabelText("BAM folder")).toHaveAttribute("id", "bam-dir-field");
    expect(screen.getByLabelText("Model file")).toHaveAttribute("id", "model-field");
    expect(screen.getByLabelText("Output report file name")).toHaveAttribute(
      "id",
      "output-report-file-field"
    );
    expect(screen.getByRole("button", { name: "Start run" })).toBeVisible();
  });

  test("does not validate before Run button pressed, and does not submit Run if form is not valid", async () => {
    render(RunRelatedComponentInTestContext, {
      props: { componentName: "RunParameters" }
    });
    const expectNoErrors = (): void => expect(screen.queryByText(/Required value/)).toBeNull();

    await expectNoErrors();

    // Fill in one value - should see no error message for others
    await user.click(screen.getByLabelText("BAM folder"));
    await expectNoErrors();

    // Press Run button - should see errors
    await user.click(screen.getByTestId("run"));
    expect(screen.getAllByText(/Required value/).length).toBe(2);
    expect(mockAPI.runAmpliconTyper).not.toHaveBeenCalled();
  });

  test("submits run if form is validly completed", async () => {
    render(RunRelatedComponentInTestContext, {
      props: { componentName: "RunParameters" }
    });
    await user.click(screen.getByLabelText("BAM folder"));
    await user.click(screen.getByLabelText("Model file"));
    await user.click(screen.getByLabelText("Output report file name"));
    await user.click(screen.getByTestId("run"));
    expect(mockAPI.runAmpliconTyper).toHaveBeenCalledOnce();
    expect(mockAPI.runAmpliconTyper).toHaveBeenCalledWith({
      bamDir: "/test/bams",
      modelFile: "/test/model.pkl",
      outputReportFile: "/test/output.html"
    });
  });

  test("gets run parameters from store", () => {
    runParameters.bamDir = "/store/bams";
    runParameters.modelFile = "/store/model.pkl";
    runParameters.outputReportFile = "/store/output.html";
    render(RunRelatedComponentInTestContext, {
      props: { componentName: "RunParameters" }
    });
    expect(screen.getByTestId("bam-dir-field-value")).toHaveTextContent("/store/bams");
    expect(screen.getByTestId("model-field-value")).toHaveTextContent("/store/model.pkl");
    expect(screen.getByTestId("output-report-file-field-value")).toHaveTextContent(
      "/store/output.html"
    );
  });

  test("validates on load if initial submit has been done", async () => {
    appState.doneInitialSubmit = true;
    render(RunRelatedComponentInTestContext, {
      props: { componentName: "RunParameters" }
    });
    expect(screen.getAllByText(/Required value/).length).toBe(3);
  });
});
