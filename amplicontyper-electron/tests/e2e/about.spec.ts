import { expect, test } from "@playwright/test";
import { initialiseTest, getWindow, ampliconTyperGUIVersion } from "./utils";

let electronApp;

test.beforeEach(async () => {
  electronApp = await initialiseTest();
});

test.afterEach(async () => {
  if (electronApp) {
    await electronApp.close();
  }
});

test("can navigate to About screen and back", async () => {
  const win = await getWindow(electronApp);
  const aboutLink = win.getByTestId("nav-about");
  await aboutLink.click();

  await expect(await win.getByText("About AmpliconTyper")).toBeVisible();
  const expectedATGVersion = ampliconTyperGUIVersion();
  expect(expectedATGVersion.length).toBeGreaterThan(4); //sanity check
  const expectedVersionText = `AmpliconTyperGUI v${expectedATGVersion}`;
  await expect(await win.getByText(expectedVersionText)).toBeVisible();

  const runLink = win.getByTestId("nav-run");
  await runLink.click();
  await expect(await win.getByText(/New Run/)).toBeVisible();
});
