import { test, expect, Locator, Page } from "@playwright/test";
import { initialiseTest, getWindow } from "./utils";
let electronApp;

const initialiseFileDialogHandlers = async (): Promise<void> => {
  await electronApp.evaluate(({ app, ipcMain }) => {
    const join = (...args): string => {
      return args.join("/");
    };
    const currentDir = app.getAppPath();
    const repoRoot = join(...currentDir.split("/").slice(0, -3));
    ipcMain.removeHandler("show-open-file-dialog");
    ipcMain.handle("show-open-file-dialog", async (_event, options) => {
      const testDataDir = join(repoRoot, "test_data");
      if (options.title === "BAM folder") {
        return join(testDataDir, "bams");
      }
      if (options.title === "Model file") {
        return join(testDataDir, "models", "typhi_v8.pkl");
      }
      throw new Error("unknown title");
    });
    ipcMain.removeHandler("show-save-file-dialog");
    ipcMain.handle("show-save-file-dialog", async (_event, options) => {
      if (options.title === "Output report file name") {
        return join(repoRoot, "test_output", "test.html");
      }
    });
  });
};

test.beforeEach(async () => {
  electronApp = await initialiseTest();
  await initialiseFileDialogHandlers();
});

test.afterEach(async () => {
  if (electronApp) {
    await electronApp.close();
  }
});

const getFieldFromDialogButton = (buttonElement: Locator): Locator => buttonElement.locator("..");

const getBAMFolderButton = async (win: Page): Promise<Locator> =>
  await win.getByLabel(/BAM folder/);
const getModelFileButton = async (win: Page): Promise<Locator> =>
  await win.getByLabel(/Model file/);
const getOutputReportFileButton = async (win: Page): Promise<Locator> =>
  await win.getByLabel(/Output report file/);
const getRunButton = async (win: Page): Promise<Locator> =>
  await win.getByRole("button", { name: /Start run/ });
const getOpenReportButton = async (win: Page): Promise<Locator> =>
  await win.getByRole("button", { name: /Open report/ });
const getNewRunButton = async (win: Page): Promise<Locator> =>
  await win.getByRole("button", { name: "New Run" });
const getRunProgressSpinner = async (win: Page): Promise<Locator> =>
  await win.getByTestId("run-progress-spinner");

const fillRunParameters = async (win: Page): Promise<void> => {
  const bamFolderButton = await getBAMFolderButton(win);
  await bamFolderButton.click();

  const modelFileButton = await getModelFileButton(win);
  await modelFileButton.click();

  const outputReportFileButton = await getOutputReportFileButton(win);
  await outputReportFileButton.click();
};

const expectErrorMessage = async (
  fieldElement: Locator,
  expectError = true,
  expectedErrorMsg = "Required value"
): Promise<void> => {
  // error is in <p> following field
  const errorEl = fieldElement.locator("//following-sibling::p");
  if (expectError) {
    await expect(errorEl).toHaveText(expectedErrorMsg);
  } else {
    await expect(errorEl).not.toBeVisible();
  }
};

test("can see fill in run parameters form and run AmpliconTyper", async () => {
  const win = await getWindow(electronApp);
  await fillRunParameters(win);

  // Check can see tooltip text
  const tooltipTrigger = await win.locator("button[data-slot='tooltip-trigger']").nth(0);
  await tooltipTrigger.hover();
  await expect(await win.locator("div[data-bits-floating-content-wrapper]")).toHaveText(
    /Folder which contains either input BAM files, or an individual BAM and corresponding BAM index files/
  );

  // A wait seems to necessary here to allow updates before submitting run
  await win.waitForTimeout(2000);
  const runButton = await getRunButton(win);
  await runButton.click();

  // See progress spinner
  await expect(await getRunProgressSpinner(win)).toBeVisible();

  // Open output buttons are not visible yet
  await expect(await getOpenReportButton(win)).toHaveCount(0);
  const newRunButton = await getNewRunButton(win);
  await expect(newRunButton).toHaveCount(0);

  // See expected start run text in log
  const log = await win.getByTestId("logs");
  await expect(log).toHaveText(/Processing data/, { timeout: 15_000 });
  await expect(log).toHaveText(/Done/, { timeout: 30_000 });
  await expect(log).toHaveText(/AmpliconTyper Run Finished/, { timeout: 30_000 });

  await expect(await getOpenReportButton(win)).toBeEnabled();
  await expect(await getNewRunButton(win)).toBeEnabled();
  await expect(await win.getByTestId("run-progress-check")).toBeVisible();

  await newRunButton.click();
  await expect(await getBAMFolderButton(win)).toBeVisible();
});

test("can see validation errors when submit run with missing values", async () => {
  const win = await getWindow(electronApp);

  const bamBtn = await getBAMFolderButton(win);
  const bamField = await getFieldFromDialogButton(bamBtn);
  const modelFileBtn = await getModelFileButton(win);
  const modelFileField = await getFieldFromDialogButton(modelFileBtn);
  const outputFileBtn = await getOutputReportFileButton(win);
  const outputFileField = await getFieldFromDialogButton(outputFileBtn);

  const runBtn = await getRunButton(win);

  // Initially no errors on any field, until click Run
  await expectErrorMessage(bamField, false);
  await expectErrorMessage(modelFileField, false);
  await expectErrorMessage(outputFileField, false);

  // Errors appear when first submit run, and are removed when fields are filled
  await runBtn.click();
  await expectErrorMessage(bamField, true);
  await expectErrorMessage(modelFileField, true);
  await expectErrorMessage(outputFileField, true);

  // fill in bam
  await bamBtn.click();
  await expectErrorMessage(bamField, false);
  await expectErrorMessage(modelFileField, true);
  await expectErrorMessage(outputFileField, true);

  // fill in model
  await modelFileBtn.click();
  await expectErrorMessage(bamField, false);
  await expectErrorMessage(modelFileField, false);
  await expectErrorMessage(outputFileField, true);

  // fill in output
  await outputFileBtn.click();
  await expectErrorMessage(bamField, false);
  await expectErrorMessage(modelFileField, false);
  await expectErrorMessage(outputFileField, false);

  // errors all cleared, can run and see progress
  await runBtn.click();
  await expect(await getRunProgressSpinner(win)).toBeVisible();
});
