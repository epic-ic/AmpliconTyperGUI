import {
    _electron as electron,
    ElectronApplication,
    Page,
} from "@playwright/test";

// Point Playwright at the built main scripts, not the src ts file. Do not use sandbox - this causes
// permission-related failures on CI.
export const launchApp = async (): Promise<ElectronApplication> => {
    console.log("launching")
    const app = await electron.launch({args: ["out/main/index.js", "--no-sandbox"]});
    console.log("launched")
    return app;
};

export const getWindow = async (app: ElectronApplication): Promise<Page> => {
    return await app.firstWindow();
};

export const initialiseTest = async (): Promise<ElectronApplication> => {
    const electronApp = await launchApp();
    await getWindow(electronApp); // wait for window to be available
    return electronApp;
};