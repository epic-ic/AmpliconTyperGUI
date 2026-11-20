import {
    _electron as electron,
    ElectronApplication,
    Page,
} from "@playwright/test";
import pkg from "../../package.json" with { type: "json" };

export const ampliconTyperGUIVersion = () => pkg.version;

// Point Playwright at the built main scripts, not the src ts file. Do not use sandbox - this causes
// permission-related failures on CI.
export const launchApp = async (): Promise<ElectronApplication> => {
    const app = await electron.launch({
        args: ["out/main/index.js", "--no-sandbox", "--disable-gpu"],
        env: {
            ...process.env,
        },
    });
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