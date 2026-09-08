<script lang="ts">
    import { onMount } from "svelte";
    import type { AmpliconTyperVersions } from "../../../shared/types";
    import { ampliconTyperAPI } from "$lib/ampliconTyperAPI.svelte";

    let versions: AmpliconTyperVersions | null = $state(null);

    onMount(async () => {
        versions = await ampliconTyperAPI.ampliconTyperVersions();
    });
</script>
<div class="container mx-auto">
    <div
            id="scrolling-container"
            class="max-h-[calc(100vh-10rem)] overflow-y-auto p-4 space-y-4"
    >
        <h1 class="mb-4" data-testid="about-header">About AmpliconTyper</h1>
        <div data-testid="versions" class="text-xl">
            <p>AmpliconTyperGUI v{versions?.ampliconTyperGUI}</p>
        </div>
        <div>Placeholder for About screen content</div>
    </div>
</div>

