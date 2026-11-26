<script lang="ts">
    import { ampliconTyperAPI } from "$lib/ampliconTyperAPI.svelte";
    import RunParameters from "./RunParameters.svelte";
    import RunProgress from "./RunProgress.svelte";
</script>
<div class="container mx-auto p-4">
    {#if !ampliconTyperAPI.running && !ampliconTyperAPI.log.length}
        <RunParameters />
    {:else}
        <RunProgress />
    {/if}
</div>