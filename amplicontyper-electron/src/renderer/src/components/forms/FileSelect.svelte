<script lang="ts">
    import { Button } from "$lib/shadcn/ui/button";

    let {
        title,
        id,
        save, // set to true if selecting an output file to be created, rather than an existing file or folder
        selectFolder,
        filters,
        onchange,
        value = $bindable(),
    } = $props();

    const showDialog = async (): Promise<void> => {
        let selected;
        if (save) {
            selected = await window.api.showSaveFileDialog({
                title,
                filters,
                defaultPath: value,
            });
        } else {
            selected = await window.api.showOpenFileDialog({
                title,
                selectFolder,
                filters,
                defaultPath: value,
            });
        }
        if (selected !== null) {
            value = selected;
            if (onchange) {
                onchange();
            }
        }
    };

    let placeholder = $derived(
        selectFolder ? "No folder chosen" : "No file chosen",
    );
</script>

<div id={`${id}-container`} class="flex">
    <Button {id} class="rounded-r-none border-0" onclick={showDialog}
    >{selectFolder ? "Choose folder" : "Choose file"}</Button
    >
    <div
            data-testid={`${id}-value`}
            class="inline-block border border-input rounded-lg px-2.5 py-1 text-base w-full min-w-0 rounded-l-none border-l-0 text-sm font-light"
    >
        {value || placeholder}
    </div>
</div>
