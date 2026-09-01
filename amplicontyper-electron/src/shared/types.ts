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

export interface FileDialogOptions {
    title: string;
    defaultPath: string;
    selectFolder: boolean;
    filters?: {
        name: string;
        extensions: string[];
    }[];
}



