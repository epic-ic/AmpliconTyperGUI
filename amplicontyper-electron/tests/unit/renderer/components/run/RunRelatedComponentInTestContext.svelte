<script>
  import * as Tooltip from "$lib/shadcn/ui/tooltip";
  import Run from "../../../../../src/renderer/src/components/run/Run.svelte";
  import RunParameters from "../../../../../src/renderer/src/components/run/RunParameters.svelte";

  let { componentName } = $props();
</script>

<Tooltip.Provider>
  {#if componentName === "Run"}
    <Run></Run>
  {/if}
  {#if componentName === "RunParameters"}
    <RunParameters></RunParameters>
  {/if}
</Tooltip.Provider>
