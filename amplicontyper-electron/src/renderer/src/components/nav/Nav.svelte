<script lang="ts">
    import { useTinyRouter } from "svelte-tiny-router";
    import * as NavigationMenu from "$lib/shadcn/ui/navigation-menu";
    import NavLink from "./NavLink.svelte";

    const router = useTinyRouter();

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
        <NavLink route="/" text="Run" key="run" {router} />
        <NavLink route="/about" text="About" key="about" {router} />
    </NavigationMenu.List>
</NavigationMenu.Root>
