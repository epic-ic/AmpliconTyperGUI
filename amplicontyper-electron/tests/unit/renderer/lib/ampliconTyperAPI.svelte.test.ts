import { describe, expect, test, vi, beforeEach } from "vitest";
import { AmpliconTyperAPI } from "../../../../src/renderer/src/lib/ampliconTyperAPI.svelte";
import { AmpliconTyperRunParameters } from "../../../../src/shared/types";

describe("AmpliconTyperAPI", () => {
  let sut;
  const params = { fake: "param" } as AmpliconTyperRunParameters;
  const versions = { ampliconTyperGUI: "0.1.0" };

  beforeEach(() => {
    window.api = {
      onChunk: vi.fn(),
      onEnd: vi.fn(),
      onSuccess: vi.fn(),
      onError: vi.fn(),
      runAmpliconTyper: vi.fn(),
      ampliconTyperVersions: vi.fn(async () => versions),
      openRunReport: vi.fn()
    };
    sut = new AmpliconTyperAPI();
  });

  test("handles onChunk", () => {
    const onChunk = window.api.onChunk.mock.calls[0][0];
    const encoder = new TextEncoder("utf-8");
    // Should split on newlines
    const chunkLog = ["line 1", "\rline 2\rline 3", "line 4"];
    onChunk(encoder.encode(chunkLog.join("\n")));

    // Expect lines to be split by \r as well as \n, but \r's to be retained
    expect(sut.log).toStrictEqual(["line 1", "\rline 2", "\rline 3", "line 4"]);
  });

  test("handles onEnd", async () => {
    const onEnd = window.api.onEnd.mock.calls[0][0];
    // set running flag to true
    await sut.runAmpliconTyper();
    expect(sut.running).toBe(true);

    // onEnd adds message to log and resets running flag
    onEnd();
    expect(sut.running).toBe(false);
    expect(sut.log).toStrictEqual(["AmpliconTyper Run Finished"]);
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
    expect(sut.error).toStrictEqual({ message: "AmpliconTyper Error", detail: "oh no" });
    expect(sut.log).toStrictEqual(["\x1b[1;31mAmpliconTyper Error: oh no"]);
  });

  test("runAmpliconTyper calls window api, clears log and sets running flag", async () => {
    // add something to log so we can check it gets cleared
    sut.log.push("test msg");
    await sut.runAmpliconTyper(params);
    expect(window.api.runAmpliconTyper).toHaveBeenCalledWith({ parameters: params, settings: {} });
    expect(sut.log).toStrictEqual([]);
    expect(sut.running).toBe(true);
  });

  test("runAmpliconTyper throws error if already running", async () => {
    await sut.runAmpliconTyper(params);
    await expect(sut.runAmpliconTyper(params)).rejects.toThrow("AmpliconTyper is already running");
  });

  test("clearRun resets all properties", async () => {
    // Get into an artificial situation where all properties are set
    await sut.runAmpliconTyper(params);
    const onSuccess = window.api.onSuccess.mock.calls[0][0];
    onSuccess();
    const onError = window.api.onError.mock.calls[0][0];
    onError("AmpliconTyper Error", "oh no");
    expect(sut.running).toBe(true);
    expect(sut.log.length).toBeGreaterThan(0);
    expect(sut.success).toBe(true);
    expect(sut.error).not.toBe(null);

    sut.clearRun();

    expect(sut.running).toBe(false);
    expect(sut.log.length).toBe(0);
    expect(sut.success).toBe(false);
    expect(sut.error).toBe(null);
  });

  test("ampliconTyperVersions calls window api", async () => {
    expect(await sut.ampliconTyperVersions()).toBe(versions);
  });

  test("openRunReport calls window api", async () => {
    const filePath = "/test.html";
    await sut.openRunReport(filePath);
    expect(window.api.openRunReport).toHaveBeenCalledWith(filePath);
  });
});
