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
    settings: AmpliconTyperRunSettings
}

export interface AppState {
    doneInitialSubmit: boolean;
    doneInitialValidate: boolean;
}


