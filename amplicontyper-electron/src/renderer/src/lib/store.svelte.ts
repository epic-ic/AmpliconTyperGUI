import type { AppState, AmpliconTyperRunParameters } from "../../../shared/types";

export const appState: AppState = $state({
    doneInitialValidate: false,
    doneInitialSubmit: false,
});

const defaultRunParameters = (): AmpliconTyperRunParameters => ({
    bamDir: "",
    modelFile: "",
    outputReportFile: ""
});

export const runParameters: AmpliconTyperRunParameters = $state(
    defaultRunParameters(),
);

