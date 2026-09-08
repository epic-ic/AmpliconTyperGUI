import type { AmpliconTyperRunParameters, AmpliconTyperRunOptions, AmpliconTyperVersions } from "../../../shared/types";

export interface AmpliconTyperError {
    message: string;
    detail: string;
}

export class AmpliconTyperAPI {
    #running = $state(false);
    #error: AmpliconTyperError | null = $state(null);
    #success = $state(false);
    #log: string[] = $state([]);
    #decoder = new TextDecoder("utf-8");

    constructor() {
        window.api?.onChunk((chunk) => {
            const textChunk = this.#decoder.decode(chunk, { stream: true });
            let lines = textChunk.split("\n");
            // Also split by carriage return "\r" but retain those at the starts of lines. These indicate that  this
            // line should overwrite the previous line. RunProgress component handles the display part.
            lines = lines.flatMap((l) => l
                .split("\r") // do the split
                .map((rl, index) => index > 0 ? `\r${rl}` : rl) // retain the `\r`s
                .filter((rl, index, arr) => arr.length == 1 || index !== 0 || rl.length !== 0) // remove rogue starting empty string if whole line started with \r
            );
            this.#log.push(...lines);
        });
        window.api?.onEnd(() => {
            // Stream has ended
            this.#running = false;
            this.#log.push("AmpliconTyper Run Finished");
        });
        window.api?.onSuccess(() => {
            this.#success = true;
        }),
        window.api?.onError((message, detail) => {
            this.#error = { message, detail };
            // Add error to log, including ansi sequence to show in Red
            this.#addErrorToLog(`${message}: ${detail}`);
        });
    }

    get running(): boolean {
        return this.#running;
    }

    get error(): AmpliconTyperError {
        return this.#error;
    }

    get success(): boolean {
        return this.#success;
    }

    get log(): string[] {
        return this.#log;
    }

    #addErrorToLog(error: string): void {
        this.#log.push(`\x1b[1;31m${error}`);
    }

    async runAmpliconTyper(parameters: AmpliconTyperRunParameters): Promise<void> {
        if (this.#running) {
            throw new Error("AmpliconTyper is already running");
        }
        this.#log = [];
        this.#running = true;
        await window.api.runAmpliconTyper({parameters: {...parameters}, settings: {}});

    }

    clearRun(): void {
        this.#log = [];
        this.#error = null;
        this.#running = false;
        this.#success = false;
    }

    async ampliconTyperVersions(): Promise<AmpliconTyperVersions> {
        return await window.api.ampliconTyperVersions();
    }

    async openRunReport(reportFilePath): Promise<void> {
        await window.api.openRunReport(
            reportFilePath
        );
    }
}

export const ampliconTyperAPI = new AmpliconTyperAPI();
