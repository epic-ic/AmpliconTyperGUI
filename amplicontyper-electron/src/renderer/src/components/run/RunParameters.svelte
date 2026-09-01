<script lang="ts">
    import { Button } from "$lib/shadcn/ui/button";
    import { Input } from "$lib/shadcn/ui/input";
    import FormField from "../forms/FormField.svelte";
    import { ampliconTyperAPI } from "$lib/ampliconTyperAPI.svelte";
    import { runParameters, appState } from "$lib/store.svelte";
    import FileSelect from "../forms/FileSelect.svelte";
    import { runParametersSchema } from "./RunFormSchema";

    let errors = $state<Record<string, string[]>>({});

    function validate(): boolean {
        const result = runParametersSchema().safeParse({
            runParameters
        });
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

<div data-testid="new-run-title">{m.newSequencingRun()}</div>
<form onsubmit={onSubmit}>
    <div
            id="scrolling-container"
            class="max-h-[calc(100vh-10rem)] overflow-y-auto px-2"
    >
        <FormField
                label="BAM folder"
                help="TODO: help for BAM folder"
                error={errors.bamDir}
                labelFor="bam-dir-field"
        >
            <FileSelect
                    id="bam-dir-field"
                    title="BAM folder"
                    selectFolder={true}
                    onchange={onChange}
                    bind:value={runParameters.bamDir}
            ></FileSelect>
        </FormField>
        <FormField
                label="Model"
                help="TODO: help for Model"
                error={errors.model}
                labelFor="model-field"
        >
            <FileSelect
                    id="model-field"
                    title="Model"
                    selectFolder={false}
                    onchange={onChange}
                    bind:value={runParameters.model}
            ></FileSelect>
        </FormField>
        <FormField
                label="Output report file"
                help="TODO: help for Output report file"
                error={errors.model}
                labelFor="output-report-file-field"
        >
            <FileSelect
                    id="output-report-file-field"
                    title="Output report file"
                    selectFolder={false}
                    onchange={onChange}
                    bind:value={runParameters.outputReport}
            ></FileSelect>
        </FormField>
    </div>
    <Button class="action float-end mt-2" onclick={onSubmit} data-testid="run"
    >
        Start run
    </Button>
</form>
