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
            const lines = textChunk.split("\n");
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
}

export const ampliconTyperAPI = new AmpliconTyperAPI();
