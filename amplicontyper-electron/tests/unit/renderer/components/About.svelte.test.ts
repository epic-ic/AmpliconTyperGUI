import { describe, expect, test } from "vitest";
import { screen, render, waitFor } from "@testing-library/svelte";
import About from "../../../../src/renderer/src/components/About.svelte";

describe("About", () => {
    test("renders as expected", async () => {
        window.api = {
            ampliconTyperVersions: () => ({ampliconTyperGUI: "0.1.0-test"})
        };
        render(About);
        expect(screen.getByText("About AmpliconTyper")).toBeVisible();
        await waitFor(() => {
            expect(screen.getByText("AmpliconTyperGUI v0.1.0-test")).toBeVisible();
        });
    });
});