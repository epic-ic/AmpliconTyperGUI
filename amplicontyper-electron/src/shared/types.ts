// TODO: add AT version
export interface AmpliconTyperVersions {
    ampliconTyperGUI: string
}

export interface AmpliconTyperRunParameters{
    bamDir: string,
    modelFile: string,
    outputReportFile: string
}

export interface AmpliconTyperSettings {
    // TODO: These settings change more rarely than the run parameters
}

export interface AmpliconTyperRunOptions {
    parameters: AmpliconTyperRunParameters,
    settings: AmpliconTyperSettings
}

export interface AppState {
    doneInitialSubmit: boolean;
    doneInitialValidate: boolean;
}

export interface SaveFileDialogOptions {
    title: string;
    defaultPath: string;
    filters?: {
        name: string;
        extensions: string[];
    }[];
}

export interface OpenFileDialogOptions extends SaveFileDialogOptions{
    selectFolder: boolean;
}



