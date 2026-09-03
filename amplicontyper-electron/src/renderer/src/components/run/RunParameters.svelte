<script lang="ts">
    import { Button } from "$lib/shadcn/ui/button";
    import FormField from "../forms/FormField.svelte";
    import { ampliconTyperAPI } from "$lib/ampliconTyperAPI.svelte";
    import { runParameters, appState } from "$lib/store.svelte";
    import FileSelect from "../forms/FileSelect.svelte";
    import { runParametersSchema } from "./RunFormSchema";

    let errors = $state<Record<string, string[]>>({});
    const labels = {
        bamDir: {
            label: "BAM folder",
            help: "Folder containing input BAM files, or an individual BAM and corresponding BAM index files (.bai)."
        },
        modelFile: {
            label: "Model file",
            help: "Pickle (.pkl) file containing pre-trained model. Model must be trained on same reference."
        },
        outputReportFile: {
            label: "Output report file",
            help: "Path of output HTML file to store classification results."
        }
    };

    function validate(): boolean {
        const result = runParametersSchema().safeParse({...runParameters});
        if (!result.success) {
            errors = result.error.flatten().fieldErrors;
        } else {
            errors = {};
        }
        appState.doneInitialValidate = true;
        return result.success;
    }

    function onChange(): void {
        // validate after every change after initial failed submit, so user
        // can see when form becomes valid;
        if (appState.doneInitialSubmit) {
            validate();
        }
    }

    async function onSubmit(e: SubmitEvent): Promise<void> {
        e.preventDefault();
        const valid = validate();
        if (valid) {
            await ampliconTyperAPI.runAmpliconTyper(runParameters);
        }
        appState.doneInitialSubmit = true;
    }

    // We may be reloading after a language change - validate in new language if initial submit has been done
    if (appState.doneInitialSubmit) {
        validate();
    }
</script>

<h2 data-testid="new-run-title">New Run</h2>
<form onsubmit={onSubmit}>
    <div
            id="scrolling-container"
            class="max-h-[calc(100vh-10rem)] overflow-y-auto px-2"
    >
        <FormField
                label={labels.bamDir.label}
                help={labels.bamDir.help}
                error={errors.bamDir}
                labelFor="bam-dir-field"
        >
            <FileSelect
                    id="bam-dir-field"
                    title="BAM folder"
                    save={false}
                    selectFolder={true}
                    onchange={onChange}
                    bind:value={runParameters.bamDir}
            ></FileSelect>
        </FormField>
        <FormField
                label={labels.modelFile.label}
                help={labels.modelFile.help}
                error={errors.modelFile}
                labelFor="model-field"
        >
            <FileSelect
                    id="model-field"
                    title="Model"
                    save={false}
                    selectFolder={false}
                    filters={[{name: "Pickle Files", extensions: ["pkl"]}]}
                    onchange={onChange}
                    bind:value={runParameters.modelFile}
            ></FileSelect>
        </FormField>
        <FormField
                label={labels.outputReportFile.label}
                help={labels.outputReportFile.help}
                error={errors.outputReportFile}
                labelFor="output-report-file-field"
        >
            <FileSelect
                    id="output-report-file-field"
                    title="Output report file"
                    save={true}
                    selectFolder={false}
                    filters={[{name: "HTML Files", extensions: ["html"]}]}
                    onchange={onChange}
                    bind:value={runParameters.outputReportFile}
            ></FileSelect>
        </FormField>
    </div>
    <Button class="action float-end mt-2" onclick={onSubmit} data-testid="run"
    >
        Start run
    </Button>
</form>
