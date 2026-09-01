import type { AmpliconTyperRunParameters, AmpliconTyperRunOptions, AmpliconTyperVersions } from "../../../shared/types";

export interface AmpliconTyperError {
    messageKey: string;
    detail: string;
}

export class AmpliconTyperAPI {
    #running = $state(false);
    #error: AmpliconTyperError | null = $state(null);
    #log: string[] = $state([]);
    #decoder = new TextDecoder("utf-8");

    constructor() {
        window.api?.onChunk((chunk) => {
            const textChunk = this.#decoder.decode(chunk, { stream: true });
            const lines = textChunk.split("\n");
            this.#log.push(...lines);
        });
        window.api?.onEnd(async () => {
            this.#log.push("AmpliconTyper Run Finished");
            this.#running = false;
        });
        window.api?.onError((messageKey, detail) => {
            this.#error = { messageKey, detail };
            // Add error to log, including ansi sequence to show in Red
            this.#addErrorToLog(`${m[messageKey]()}: ${detail}`);
        });
    }

    get running(): boolean {
        return this.#running;
    }

    get error(): AmpliconTyperError {
        return this.#error;
    }

    get log(): string[] {
        return this.#log;
    }

    #addErrorToLog(error: string): void {
        this.#log.push(`\x1b[1;31m${error}`);
    }

    async runAmpliconTyper(parameters: AmpliconTyperRunParameters): void {
        if (this.#running) {
            throw new Error(m.apiErrorAlreadyRunning());
        }
        this.#log = [];
        await window.api.runAmpliconTyper({parameters, settings: {}});
        this.#running = true;
    }

    clearRun(): void {
        this.#log = [];
        this.#error = null;
    }

    async ampliconTyperVersions(): Promise<AmpliconTyperVersions> {
        return await window.api.ampliconTyperVersions();
    }
}

export const ampliconTyperAPI = new AmpliconTyperAPI();
