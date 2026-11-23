import { describe, expect, test, afterEach, beforeAll, vi } from "vitest";
import { expectTranslations, renderInI18nTestContext } from "../../utils";
import { screen, within, render } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import RunProgress from "../../../../../src/renderer/src/components/run/RunProgress.svelte";
import { runParameters } from "$lib/store.svelte";
import { mockAmpliconTyperAPI} from "../../../MockAmpliconTyperAPI.svelte";

describe("RunProgress", () => {
    const user = userEvent.setup();



    const testNewRunClearsLog = async (piranhaAPI): Promise<void> => {
        renderInI18nTestContext(RunProgress);
        await expectTranslations(
            (text) => {
                expect(screen.getByTestId("new-run")).toHaveTextContent(text);
            },
            {
                en: "New Run",
                fr: "Nouvelle analyse",
                pt: "Nova corrida",
            },
        );
        const button = screen.getByTestId("new-run");
        await user.click(button);
        expect(piranhaAPI.clearRun).toHaveBeenCalled();
    };


        beforeAll(async () => {
            runParameters.bamDir = "/test/bams";
            runParameters.modelFile = "/test/model.pkl";
            runParameters.outputReportFile = "/test/output.html";
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        test("renders as expected", async () => {
            await mockAmpliconTyperAPI({
                log: ["log entry 1 ", "log entry 2"],
                running: true,
            });
            render(RunProgress);

            expect(screen.getByTestId("run-progress")).toHaveTextContent("Run Progress");

            const bamDirDiv = screen.getByText("BAM folder");
            expect(
                within(bamDirDiv).getByText(/\/test\/bams/),
            ).toBeVisible();

            const modelDiv = screen.getByText("Model");
            expect(
                within(modelDiv).getByText(/\/test\/model.pkl/),
            ).toBeVisible();

            const outputReportDiv = screen.getByText("Output report file");
            expect(
                within(outputReportDiv).getByText(/\/test\/output.html/),
            ).toBeVisible();

            expect(screen.getByTestId("logs")).toHaveTextContent(
                /log entry 1 log entry 2/,
            );

            expect(screen.getByTestId("run-progress-spinner")).toBeVisible();
            expect(screen.queryByTestId("run-progress-x")).toBeNull();
            expect(screen.queryByTestId("run-progress-check")).toBeNull();


            expect(screen.queryByTestId("open-report")).toBeNull();
            expect(screen.queryByTestId("new-run")).toBeNull();
        });

        test("see Check and Open Report and New Run buttons when running is complete with no error",  async () => {
            await mockAmpliconTyperAPI({
                log: ["log entry 1 ", "log entry 2"],
                running: false,
                success: true,
            });
            render(RunProgress);
            expect(screen.getByTestId("run-progress-check")).toBeVisible();
            expect(screen.queryByTestId("run-progress-x")).toBeNull();
            expect(screen.queryByTestId("run-progress-spinner")).toBeNull();
            expect(screen.getByTestId("open-report")).toHaveTextContent("Open report");
            expect(screen.getByTestId("new-run")).toHaveTextContent("New Run");
        });

        test("Open report button calls expected method on piranha API", async () => {
            const mockAPI = await mockAmpliconTyperAPI({
                running: false,
                success: true,
            });
            render(RunProgress);

            const button = screen.getByTestId("open-report");
            await user.click(button);
            expect(mockAPI.openRunReport).toHaveBeenCalledWith("/test/output.html");
        });

        // TODO: actually show error on component, and test for it here!
        test("see x when running is complete with error", async () => {
            await mockPiranhaAPI({
                initialized: true,
                log: ["log entry 1 ", "log entry 2"],
                running: false,
                error: { messageKey: "runError", detail: "oh no" },
            });
            renderInI18nTestContext(RunProgress);
            expect(screen.getByTestId("run-progress-x")).toBeVisible();
            await expectTranslations(
                (text) => {
                    expect(screen.getByText(text)).toBeVisible();
                },
                {
                    en: /Piranha Run Error: oh no/,
                    fr: /Erreur d'exécution Piranha: oh no/,
                    pt: /Erro ao Executar o Piranha: oh no/,
                },
            );
            expect(screen.queryByTestId("run-progress-check")).toBeNull();
            expect(screen.queryByTestId("run-progress-spinner")).toBeNull();
            expect(screen.queryByTestId("open-report")).toBeNull();
            expect(screen.queryByTestId("open-output-folder")).toBeNull();
        });

        test("new run clears log", async () => {
            const piranhaAPI = await mockPiranhaAPI({
                initialized: true,
                log: ["log entry 1 ", "log entry 2"],
                running: false,
            });
            await testNewRunClearsLog(piranhaAPI);
        });

        test("updating log triggers scroll to end", async () => {
            // Use fake timers only in this test where we need them, as otherwise they cause userEvent to hang
            vi.useFakeTimers();

            const piranhaAPI = await mockPiranhaAPI({
                initialized: true,
                log: ["log entry 1 ", "log entry 2"],
                running: false,
            });

            const { container } = render(RunProgress);
            const logEl = container.querySelector("code[data-testid='logs']");
            const scrollHeightSpy = vi
                .spyOn(logEl, "scrollHeight", "get")
                .mockImplementation(() => 500);
            let scrollTopToUpdate = 0;
            vi.spyOn(logEl, "scrollTop", "set").mockImplementation(
                (value) => (scrollTopToUpdate = value),
            );

            piranhaAPI.log.push(["more", "log", "content"]);

            // Wait for debounce to trigger update
            await vi.advanceTimersByTimeAsync(300);
            expect(scrollHeightSpy).toHaveBeenCalled();
            expect(scrollTopToUpdate).toBe(500);
        });

});
