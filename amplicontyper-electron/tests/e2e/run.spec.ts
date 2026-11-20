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
            if (options.title === "Output report file") {
                return join(repoRoot, "test_output", "test.html");
            }
        });
    });
};

test.beforeEach(async () => {
    electronApp = await initialiseTest();
    console.log("initialised test")
    await initialiseFileDialogHandlers();
});

test.afterEach(async () => {
    if (electronApp) {
        await electronApp.close();
    }
});

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

const fillRunParameters = async (win: Page): Promise<void> => {
    const bamFolderButton = await getBAMFolderButton(win);
    await bamFolderButton.click();

    const modelFileButton = await getModelFileButton(win);
    await modelFileButton.click();

    const outputReportFileButton = await getOutputReportFileButton(win);
    await outputReportFileButton.click();
};

test("can see fill in run parameters form and run AmpliconTyper", async () => {
    console.log("starting test")
    const win = await getWindow(electronApp);
    console.log("got win")
    await fillRunParameters(win);

    // Check can see tooltip text
    const tooltipTrigger = await win
        .locator("button[data-slot='tooltip-trigger']")
        .nth(0);
    await tooltipTrigger.hover();
    await expect(
        await win.locator("div[data-bits-floating-content-wrapper]"),
    ).toHaveText(/Folder which contains either input BAM files, or an individual BAM and corresponding BAM index files/);

    // A wait seems to necessary here to allow updates before submitting run
    await win.waitForTimeout(2000);
    const runButton = await getRunButton(win);
    await runButton.click();

    // See progress spinner
    await expect(await win.getByTestId("run-progress-spinner")).toBeVisible();

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

// TODO: test validation errors.