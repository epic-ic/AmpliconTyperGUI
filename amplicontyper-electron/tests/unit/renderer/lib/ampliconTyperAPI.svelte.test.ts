import { describe, expect, test, vi, beforeEach } from "vitest";
import {AmpliconTyperAPI} from "../../../../src/renderer/src/lib/ampliconTyperAPI.svelte";

describe("AmpliconTyperAPI", () => {
    let sut;

    beforeEach(() => {
        window.api = {
            onChunk: vi.fn(),
            onEnd: vi.fn(),
            onSuccess: vi.fn(),
            onError: vi.fn(),
            runAmpliconTyper: vi.fn(),
            ampliconTyperVersions: vi.fn(),
            openRunReport: vi.fn(),
        };
        sut = new AmpliconTyperAPI();
    });

    test("handles onChunk", () => {
        const onChunk = window.api.onChunk.mock.calls[0][0];
        const encoder = new TextEncoder("utf-8");
        // Should split on newlines
        const chunkLog = [
            "line 1",
            "\rline 2\rline 3",
            "line 4"
        ];
        onChunk(encoder.encode(chunkLog.join("\n")));

        // Expect lines to be split by \r as well as \n, but \r's to be retained
        expect(sut.log).toStrictEqual([
            "line 1",
            "\rline 2",
            "\rline 3",
            "line 4"
        ]);
    });

    test("handles onEnd", async () => {
        const onEnd = window.api.onEnd.mock.calls[0][0];
        // set running flag to true
        await sut.runAmpliconTyper();
        expect(sut.running).toBe(true);

        // onEnd adds message to log and resets running flag
        onEnd();
        expect(sut.running).toBe(false);
        expect(sut.log).toStrictEqual([
            "AmpliconTyper Run Finished"
        ]);
    });

    test("handles onSuccess", () => {
        const onSuccess = window.api.onSuccess.mock.calls[0][0];
        expect(sut.success).toBe(false); // sanity check
        onSuccess();
        expect(sut.success).toBe(true);
    });

    test("handles onError", () => {
        const onError = window.api.onError.mock.calls[0][0];
        onError("AmpliconTyper Error", "oh no");
        expect(sut.error).toStrictEqual({message: "AmpliconTyper Error", detail: "oh no"});
        expect(sut.log).toStrictEqual(["\x1b[1;31mAmpliconTyper Error: oh no"]);
    });
});