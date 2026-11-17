<script lang="ts">
    import { Button } from "$lib/shadcn/ui/button";
    import { Label } from "$lib/shadcn/ui/label";
    import * as RadioGroup from "$lib/shadcn/ui/radio-group";
    import * as Select from "$lib/shadcn/ui/select";
    import * as Accordion from "$lib/shadcn/ui/accordion";
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
        metadataFile: {
            label: "Metadata file",
            help: "Pickle (.pkl) file containing pre-trained model. Model must be trained on same reference."
        },
        metadataFileDelimiter: {
            label: "Metadata file delimiter",
            help: "Pickle (.pkl) file containing pre-trained model. Model must be trained on same reference."
        },
        descriptionColumnName: {
            label: "Description column",
            help: "Help for description"
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
        <div class="space-y-2 py-3">
            <Label for="sample-file-type">Sample File Type</Label>
            <RadioGroup.Root id="sample-file-type" value="bam">
                <div class="flex items-center gap-3">
                    <RadioGroup.Item value="fastq" id="fastq" />
                    <Label for="option-one">FASTQ</Label>
                </div>
                <div class="flex items-center gap-3">
                    <RadioGroup.Item value="bam" id="bam" />
                    <Label for="bam">BAM</Label>
                </div>
            </RadioGroup.Root>
        </div>
        <FormField
                label={labels.bamDir.label}
                help={labels.bamDir.help}
                error={errors.bamDir}
                labelFor="bam-dir-field"
        >
            <FileSelect
                    id="bam-dir-field"
                    title={labels.bamDir.label}
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
                    title={labels.modelFile.label}
                    save={false}
                    selectFolder={false}
                    filters={[{name: "Pickle Files", extensions: ["pkl"]}]}
                    onchange={onChange}
                    bind:value={runParameters.modelFile}
            ></FileSelect>
        </FormField>
        <FormField
                label={labels.metadataFile.label}
                help={labels.metadataFile.help}
                error={errors.metadataFile}
                labelFor="metadata-file-field"
        >
            <FileSelect
                    id="metadata-file-field"
                    title={labels.metadataFile.label}
                    save={false}
                    selectFolder={false}
                    filters={[{name: "TSV Files", extensions: ["tsv"]}, {name: "CSV Files", extensions: ["csv"]}]}
                    onchange={onChange}
                    bind:value={runParameters.metadataFile}
            ></FileSelect>
        </FormField>
        <div class="flex space-x-5 gap-5">
        <FormField
                label={labels.metadataFileDelimiter.label}
                help={labels.metadataFileDelimiter.help}
                error={errors.metadataFileDelimiter}
                labelFor="metadata-file-delimiter-field"
        >
            <Select.Root type="single" name="metadata-file-delimiter" items={["TAB"]} bind:value={runParameters.metadataFileDelimiter}>
                <Select.Trigger class="w-full max-w-48">
                    <Select.Value placeholder="Metadata file delimiter" />
                </Select.Trigger>
                <Select.Content>
                    <Select.Group>
                            <Select.Item value="TAB" label="TAB">
                                TAB
                            </Select.Item>
                    </Select.Group>
                </Select.Content>
            </Select.Root>
        </FormField>
        <FormField
                label={labels.descriptionColumnName.label}
                help={labels.descriptionColumnName.help}
                error={errors.descriptionColumnName}
                labelFor="metadata-description-column-name-field"
        >
            <Select.Root type="single" name="metadata-description-column-name-field" items={["Description"]} bind:value={runParameters.metadataDescriptionColumn}>
                <Select.Trigger class="w-full max-w-48">
                    <Select.Value placeholder="Description column" />
                </Select.Trigger>
                <Select.Content>
                    <Select.Group>
                        <Select.Item value="Description" label="Description">
                            Description
                        </Select.Item>
                    </Select.Group>
                </Select.Content>
            </Select.Root>
        </FormField>
        </div>
        <FormField
                label={labels.outputReportFile.label}
                help={labels.outputReportFile.help}
                error={errors.outputReportFile}
                labelFor="output-report-file-field"
        >
            <FileSelect
                    id="output-report-file-field"
                    title={labels.outputReportFile.label}
                    save={true}
                    selectFolder={false}
                    filters={[{name: "HTML Files", extensions: ["html"]}]}
                    onchange={onChange}
                    bind:value={runParameters.outputReportFile}
            ></FileSelect>
        </FormField>
        <Accordion.Root class="px-2" style="background-color:#eeeeee">
            <Accordion.Item value="advanced">
                <Accordion.Trigger>Advanced options</Accordion.Trigger>
                <Accordion.Content></Accordion.Content>
            </Accordion.Item>
        </Accordion.Root>
        <Button class="action my-5">
            More settings...
        </Button>
    </div>

    <Button class="action float-end" onclick={onSubmit} data-testid="run"
    >
        Start run
    </Button>
</form>
