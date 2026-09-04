export default {
    appId: "org.epic-ic.amplicontypergui",
    productName: "AmpliconTyperGUI",
    files: ["out/**/*", "node_modules/**/*", "package.json"],
    afterPack: "./scripts/installer-after-pack.js",
    extraResources: [
        {
            from: "../amplicontyper-installer/dist",
            to: "AmpliconTyper",
            filter: ["**/*"]
        }
    ],
    linux: {
        target: ["AppImage", "deb"],
        category: "Utility"
    },
    nsis: {
        oneClick: false,
        allowToChangeInstallationDirectory: true,
        createDesktopShortcut: true,
        createStartMenuShortcut: true,
        shortcutName: "AmpliconTyperGUI",
        artifactName: "${productName} Setup ${version}-${os}.${ext}",
    },
};
