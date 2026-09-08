<script lang="ts">
    import { Router, Route } from "svelte-tiny-router";
    import * as Tooltip from "$lib/shadcn/ui/tooltip";
    import Nav from "./components/nav/Nav.svelte";
    import Run from "./components/run/Run.svelte";
    import About from "./components/About.svelte";
</script>

<Router>
    <Tooltip.Provider>
        <Nav></Nav>
            <Route path="/" component={Run} />
            <Route path="/about" component={About} />
    </Tooltip.Provider>
</Router>

