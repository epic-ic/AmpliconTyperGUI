<script lang="ts">
    import * as ansi_up from "ansi_up";
    import throttle from "throttleit";
    import { X, Check } from "@lucide/svelte";
    import { Button } from "$lib/shadcn/ui/button";
    import { Spinner } from "$lib/shadcn/ui/spinner";
    import { ampliconTyperAPI } from "$lib/ampliconTyperAPI.svelte";
    import { runParameters } from "$lib/store.svelte";

    let logEl;
    const ansi = new ansi_up.AnsiUp();

    const borderColour = $derived(
        ampliconTyperAPI.running
            ? "border-orange-300"
            : ampliconTyperAPI.error
                ? "border-red-600"
                : "border-green-600",
    );

    const scrollLogToEnd = throttle(() => {
        if (logEl) {
            logEl.scrollTop = logEl.scrollHeight;
        }
    }, 300);

    $effect(() => {
        if (ampliconTyperAPI.log.length) {
            scrollLogToEnd();
        }
    });

    const clearRun = (): void => {
        ampliconTyperAPI.clearRun();
    };
</script>

<h2 data-testid="run-progress">Run Progress</h2>
<div class="space-y-2">
    <div class="bg-white mt-2 p-4 border {borderColour}">
        <div class="flex">
            <div>
                {#if ampliconTyperAPI.running}
                    <Spinner class="text-orange-300" data-testid="run-progress-spinner"
                    ></Spinner>
                {:else if ampliconTyperAPI.error}
                    <X class="text-red-600" data-testid="run-progress-x"></X>
                {:else if ampliconTyperAPI.success}
                    <Check class="text-green-600" data-testid="run-progress-check"
                    ></Check>
                {/if}
            </div>
            <div class="pl-2">
                Running classify for:
            </div>
        </div>
        <div class="h-[2rem] flex items-center">
            BAM folder:
            <span class="font-bold">{runParameters.bamDir}</span>
        </div>
        <div class="h-[2rem] flex items-center">
            <div>
                Model:
                <span class="font-bold">{runParameters.modelFile}</span>
            </div>
        </div>
        <div class="h-[2rem] flex items-center space-x-2">
           Output report file:
            <span class="font-bold">{runParameters.outputReportFile}</span>
            {#if ampliconTyperAPI.success}
                <Button
                    data-testid="open-report"
                    onclick={async () => await ampliconTyperAPI.openRunReport(runParameters.outputReportFile)}
                >Open report</Button
                >
            {/if}
        </div>
        <code class="amplicontyper-logs mt-2" data-testid="logs" bind:this={logEl}>
            {#each ampliconTyperAPI.log as logentry, index (index)}
                <!-- eslint-disable  svelte/no-at-html-tags -->
                {@html ansi.ansi_to_html(logentry)}<br />
            {/each}
        </code>
    </div>
    {#if !ampliconTyperAPI.running}
        <Button class="action float-end" data-testid="new-run" onclick={clearRun}>
            New Run
        </Button>
    {/if}
</div>
