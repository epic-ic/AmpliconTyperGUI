import type { AppState, AmpliconTyperRunParameters } from "../../../shared/types";

export const routerHelper = $state({
    // Whether we've initialised the router to default route "/" - we need to do this because the router in electron
    // mode defaults to window.location.pathname, which is the local file location...
    initialNavigationDone: false,
});


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

