import {
    _electron as electron,
    ElectronApplication,
    Page,
} from "@playwright/test";

// Point Playwright at the built main scripts, not the src ts file. Do not use sandbox - this causes
// permission-related failures on CI.
export const launchApp = async (): Promise<ElectronApplication> => {
    console.log("launching")
    const app = await electron.launch({
        args: ["out/main/index.js", "--no-sandbox", "--disable-gpu"],
        env: {
            ...process.env,
            ELECTRON_ENABLE_LOGGING: '1', // Chromium/Electron internal logs to stderr
            DEBUG: 'pw:electron',         // Playwright's own protocol logs (optional)
        },
    });
    console.log("launched")

    const proc = app.process();
    proc.stdout?.on('data', d => console.log('[main stdout]', d.toString()));
    proc.stderr?.on('data', d => console.error('[main stderr]', d.toString()));
    proc.on('exit', (code, signal) => console.log('main exited', code, signal));
    return app;
};

export const getWindow = async (app: ElectronApplication): Promise<Page> => {
    return await app.firstWindow();
};

export const initialiseTest = async (): Promise<ElectronApplication> => {
    const electronApp = await launchApp();
    await getWindow(electronApp); // wait for window to be available
    console.log("got window")
    return electronApp;
};