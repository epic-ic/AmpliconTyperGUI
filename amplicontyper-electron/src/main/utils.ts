import { platform } from "os";
import { exec } from "child_process";
import { promisify } from "util";

export const isWindows = () => platform() === "win32";

const execAsync = promisify(exec);
export const isWSLInstalled = async (): Promise<boolean> => {
    try {
        await execAsync("wsl --version", { shell: "powershell.exe" });
        return true;
    } catch (error) {
        return false;
    }
};