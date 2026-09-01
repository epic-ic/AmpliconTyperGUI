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
    runAmpliconTyper: () => {
        return ipcRenderer.invoke("run-amplicontyper");
    },
    showFileDialog: (options: FileDialogOptions) =>
        ipcRenderer.invoke("show-file-dialog", options),
    onChunk: (callback) =>
        ipcRenderer.on("stream-chunk", (_event, value) => callback(value)),
    onEnd: (callback) => ipcRenderer.on("stream-end", (_event) => callback()),
    onError: (callback) =>
        ipcRenderer.on("error", (_event, error, detail) => callback(error, detail)),
}