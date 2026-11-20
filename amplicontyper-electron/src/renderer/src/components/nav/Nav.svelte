<script lang="ts">
    import { onMount, tick } from "svelte";
    import { useTinyRouter } from "svelte-tiny-router";
    import * as NavigationMenu from "$lib/shadcn/ui/navigation-menu";
    import NavLink from "./NavLink.svelte";

    const router = useTinyRouter();

    onMount(async () => {
        await tick(); // necessary on Windows installation
        // Navigate to "/" on load
        router.navigate("/");
    });
</script>

<NavigationMenu.Root
        class="nav bg-primary text-primary-foreground max-w-full justify-between text-2xl"
>
    <NavigationMenu.List>
        <NavigationMenu.Item>
            <div class="font-bold at-title">AmpliconTyper</div>
        </NavigationMenu.Item>
    </NavigationMenu.List>
    <NavigationMenu.List>
        <NavLink route="/" data-testid="nav-run" text="Run" key="run" {router} />
        <NavLink route="/about" data-testid="nav-about" text="About" key="about" {router} />
    </NavigationMenu.List>
</NavigationMenu.Root>

