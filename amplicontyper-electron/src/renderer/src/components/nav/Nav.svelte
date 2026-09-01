<script lang="ts">
    import { onMount, tick } from "svelte";
    import { useTinyRouter } from "svelte-tiny-router";
    import * as NavigationMenu from "$lib/shadcn/ui/navigation-menu";
    import NavLink from "./NavLink.svelte";
    import { routerHelper } from "$lib/store.svelte";

    const router = useTinyRouter();

    onMount(async () => {
        await tick(); // necessary on Windows installation
        // We may be on first load or reloading due to language change - retain the route in latter case, otherwise navigate
        // to default / route.
        let route = routerHelper.initialNavigationDone ? router.path : "/";
        // Router path gets unhelpful local file prefix in production, so need to remove this
        route = route.substring(route.lastIndexOf("/"));
        router.navigate(route);
        routerHelper.initialNavigationDone = true;
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
        <NavLink route="/" text="Run" key="run" {router} />
        <NavLink route="/about" text="About" key="about" {router} />
    </NavigationMenu.List>
</NavigationMenu.Root>
