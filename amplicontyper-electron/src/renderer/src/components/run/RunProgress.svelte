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
        : "border-green-600"
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

  const shouldDisplayLogEntry = (logEntryIndex: number): boolean => {
    // AmpliconTyper logs include tqdm progress logging where log entries
    // starting with \r overwrite the previous line (so you don't get multiple
    // lines showing each stage of the progress bar). Replicate this here,
    // by omitting any log entries which are followed by an entry starting with /r
    return (
      logEntryIndex >= ampliconTyperAPI.log.length - 1 ||
      !ampliconTyperAPI.log[logEntryIndex + 1].startsWith("\r")
    );
  };

  const clearRun = (): void => {
    ampliconTyperAPI.clearRun();
  };
</script>

<h2 data-testid="run-progress">Run Progress</h2>
<div class="space-y-2">
  <div class="bg-white mt-2 p-4 border {borderColour}">
    <div class="flex">
      {#if ampliconTyperAPI.running}
        <div>
          <Spinner class="text-orange-300" data-testid="run-progress-spinner"></Spinner>
        </div>
        <div class="pl-2" data-testid="running-for">Running classify for:</div>
      {:else if ampliconTyperAPI.error}
        <div>
          <X class="text-red-600" data-testid="run-progress-x"></X>
        </div>
        <div class="text-red-600" data-testid="run-error">
          Run error. {ampliconTyperAPI.error.message}: {ampliconTyperAPI.error.detail}
        </div>
      {:else if ampliconTyperAPI.success}
        <div>
          <Check class="text-green-600" data-testid="run-progress-check"></Check>
        </div>
        <div class="pl-2" data-testid="run-complete">Run complete</div>
      {/if}
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
        {#if shouldDisplayLogEntry(index)}
          <!-- eslint-disable  svelte/no-at-html-tags -->
          {@html ansi.ansi_to_html(logentry)}<br />
        {/if}
      {/each}
    </code>
  </div>
  {#if !ampliconTyperAPI.running}
    <Button class="action float-end" data-testid="new-run" onclick={clearRun}>New Run</Button>
  {/if}
</div>
