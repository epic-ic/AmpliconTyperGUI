import * as fs from "fs";
import * as path from "path";

export default async (context) => {
    const platform = context.electronPlatformName;
    const perms = 0o755;

    // Only set execute permissions on Linux and macOS
    if (platform === 'linux' || platform === 'mac') {
        const resourcesPath = path.join(context.appOutDir, "resources", "AmpliconTyper");
        const execPath = path.join(resourcesPath, "amplicontyper_classify");
        if (fs.existsSync(execPath)) {
            fs.chmodSync(execPath, perms);
            console.log(`Set executable permission on ${execPath}`);
        }

        // Also make any other bundled executables (like minimap2) executable
        const internalBinPath = path.join(resourcesPath, "amplicontyper", "_internal");
        const files = fs.readdirSync(internalBinPath);
        files.forEach(file => {
            const filePath = path.join(internalBinPath, file);
            if (fs.statSync(filePath).isFile()) {
                fs.chmodSync(filePath, perms);
                console.log(`Set executable permission on ${filePath}`);
            }
        });
    }
};
