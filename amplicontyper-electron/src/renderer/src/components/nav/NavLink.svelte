<script lang="ts">
    import * as NavigationMenu from "$lib/shadcn/ui/navigation-menu";

    let { route, text, key, router } = $props();
    const navigate = (route: string): void => {
        router.navigate(route);
    };

    const isCurrentRoute = (route): boolean => route == router.path;
</script>

<NavigationMenu.Item>
    <NavigationMenu.Link
            class="nav-link rounded-none {isCurrentRoute(route)
      ? 'current-nav-route'
      : ''}"
            data-testid={`nav-${key}`}
            onSelect={() => navigate(route)}>{text}</NavigationMenu.Link
    >
</NavigationMenu.Item>