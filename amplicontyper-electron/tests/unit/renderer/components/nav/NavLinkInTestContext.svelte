<script>
    import * as NavigationMenu from "$lib/shadcn/ui/navigation-menu";
    import NavLink from "../../../../../src/renderer/src/components/nav/NavLink.svelte";

    let { router, route, text, key } = $props();
</script>

<NavigationMenu.Root>
    <NavigationMenu.List>
        <NavLink
            router={router}
            route={route}
            text={text}
            key={key}
        ></NavLink>
    </NavigationMenu.List>
</NavigationMenu.Root>
