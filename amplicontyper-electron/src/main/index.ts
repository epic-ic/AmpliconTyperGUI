import { app, shell, BrowserWindow, ipcMain, dialog } from "electron";
import * as path from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import pkg from "../../package.json" with { type: "json" };
import icon from "../../resources/icon.png?asset";
import { AmpliconTyperRunner } from "./ampliconTyperRunner";
import { Writable } from "node:stream";
import {
    FileDialogOptions,
    AmpliconTyperRunOptions,
    AmpliconTyperVersions,
} from "../shared/types";

// TODO: specify AmpliconTyper version. This should be the version we use when we build the PyInstaller
const ampliconTyperGUIVersion = pkg.version;
const ampliconTyperExePath = process.env["AMPLICON_TYPER_EXE_PATH"];
const ampliconTyperInternalBinPath = process.env["AMPLICON_TYPER_INTERNAL_BIN_PATH"];

if (!ampliconTyperExePath || !ampliconTyperInternalBinPath) {
    throw Error("AMPLICON_TYPER_EXE_PATH and AMPLICON_TYPER_INTERNAL_BIN_PATH env vars must be provided");
}

console.log(`Running with AmpliconTyper exe path ${ampliconTyperExePath} and internal bin path ${ampliconTyperInternalBinPath}`);

const runner = new AmpliconTyperRunner(ampliconTyperExePath, ampliconTyperInternalBinPath);

function createWindow(): void {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 900,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === "linux" ? { icon } : {}),
        webPreferences: {
            preload: path.join(__dirname, "../preload/index.js"),
            sandbox: false,
        },
    });

    mainWindow.webContents.once("did-finish-load", async () => {
        mainWindow.maximize();
        mainWindow.show();
    });

    // Check for renderer process crashes
    mainWindow.webContents.on("render-process-gone", (_event, details) => {
        console.error(`Renderer process crashed: ${details.reason}`);
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
        // Open links in browser
        shell.openExternal(details.url);
        return { action: "deny" };
    });

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
        mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    } else {
        mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
    }

    /**
     * Get the current versions of AmpliconTyperGUI and (TODO) AmpliconTyper
     */
    ipcMain.handle("amplicontyper-versions", (_event): AmpliconTyperVersions => {
        return {
            ampliconTyperGUI: ampliconTyperGUIVersion
        };
    });

    /**
     * Display a native file dialog and return selection to renderer
     */
    ipcMain.handle(
        "show-file-dialog",
        async (_event, options: FileDialogOptions) => {
            const openType = options.selectFolder ? "openDirectory" : "openFile";
            const result = await dialog.showOpenDialog(mainWindow, {
                title: options.title,
                defaultPath: options.defaultPath,
                properties: [openType],
                filters: options.filters || [],
            });
            return result.filePaths.length ? result.filePaths[0] : null;
        },
    );

    /**
     * Handles request from renderer to run AmpliconTyper and stream logs back to the main window
     */
    ipcMain.handle("run-amplicontyper", async (_event, options: AmpliconTyperRunOptions) => {
        console.log("running amplicon typer from main")
        const writable = new Writable({
            write(chunk, _, callback) {
                // Send each chunk to the renderer
                mainWindow.webContents.send("stream-chunk", chunk);
                callback();
            },
            final(callback) {
                mainWindow.webContents.send("stream-end");
                callback();
            },
        });

        try {
            await runner
                .runAmpliconTyper(options, writable);
            console.log("sending success")
            mainWindow.webContents.send("success");

        } catch(e) {
            console.log("Sending error")
            mainWindow.webContents.send(
                "error",
                "Run error",
                (e as Error).message,
            );
        }
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
    // Set app user model id for windows
    electronApp.setAppUserModelId("com.electron");

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on("browser-window-created", (_, window) => {
        optimizer.watchWindowShortcuts(window);
    });

    createWindow();

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
