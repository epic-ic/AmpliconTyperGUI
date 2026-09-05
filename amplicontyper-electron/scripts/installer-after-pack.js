import * as fs from "fs";
import * as path from "path";

export default async (context) => {
    const platform = context.electronPlatformName;

    // Only set execute permissions on Linux and macOS
    if (platform === 'linux' || platform === 'mac') {
        const resourcesPath = path.join(context.appOutDir, "resources", "AmpliconTyper");
        const execPath = path.join(resourcesPath, "amplicontyper_classify");
        if (fs.existsSync(execPath)) {
            fs.chmodSync(execPath, 0o755);
            console.log(`✓ Set executable permission on ${execPath}`);
        }
    }
};
