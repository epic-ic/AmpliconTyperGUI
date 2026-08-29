export default {
    appId: "org.epic-ic.amplicontypergui",
    productName: "AmpliconTyperGUI",
    files: ["out/**/*", "node_modules/**/*", "package.json"], // TODO: also include AT Pyinstaller executable
    nsis: {
        oneClick: false,
        allowToChangeInstallationDirectory: true,
        createDesktopShortcut: true,
        createStartMenuShortcut: true,
        shortcutName: "AmpliconTyperGUI",
        artifactName: "${productName} Setup ${version}-${os}.${ext}",
    },
};
