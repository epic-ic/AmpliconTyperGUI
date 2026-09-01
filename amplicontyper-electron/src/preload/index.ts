import { contextBridge, ipcRenderer } from "electron";
import {
    FileDialogOptions,
    AmpliconTyperRunOptions
} from "../shared/types";

// Custom API for renderer
const api = {
    ampliconTyperVersions: () => {
        return ipcRenderer.invoke("amplicontyper-versions");
    },
    runAmpliconTyper: (options: AmpliconTyperRunOptions) => {
        return ipcRenderer.invoke("run-amplicontyper", options);
    },
    showFileDialog: (options: FileDialogOptions) =>
        ipcRenderer.invoke("show-file-dialog", options),
    onChunk: (callback) =>
        ipcRenderer.on("stream-chunk", (_event, value) => callback(value)),
    onEnd: (callback) => ipcRenderer.on("stream-end", (_event) => callback()),
    onError: (callback) =>
        ipcRenderer.on("error", (_event, error, detail) => callback(error, detail)),
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld("api", api);
    } catch (error) {
        console.error(error);
    }
} else {
    // @ts-ignore (define in dts)
    window.api = api;
}