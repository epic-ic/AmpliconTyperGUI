import { vi } from "vitest";
import { AmpliconTyperVersions } from "../../src/shared/types";
import {
  ampliconTyperAPI,
  AmpliconTyperError
} from "../../src/renderer/src/lib/ampliconTyperAPI.svelte";

export interface APIMock {
  running: boolean;
  error: AmpliconTyperError | null;
  success: boolean;
  log: string[];
  versions: AmpliconTyperVersions;
}

const defaultAPIMock: APIMock = {
  running: false,
  error: null,
  success: false,
  log: [],
  versions: {
    ampliconTyperGUI: "0.1.0-test"
  }
};

let running = $state(false);
let error = $state(null);
let success = $state(false);
let log = $state([]);

export const mockAmpliconTyperAPI = async (values: Partial<APIMock>): void => {
  running = values.running || defaultAPIMock.running;
  error = values.error || defaultAPIMock.error;
  success = values.success || defaultAPIMock.success;
  log = values.log || defaultAPIMock.log;
  const versions = values.versions || defaultAPIMock.versions;

  const spyOnAPIProp = (propName: string, value: unknown): void => {
    vi.spyOn(ampliconTyperAPI, propName, "get").mockImplementation(() => value);
  };
  const spyOnAPIMethod = (methodName: string, implementation): void => {
    if (!implementation) {
      implementation = () => {};
    }
    vi.spyOn(ampliconTyperAPI, methodName).mockImplementation(implementation);
  };
  spyOnAPIProp("running", running);
  spyOnAPIProp("error", error);
  spyOnAPIProp("success", success);
  spyOnAPIProp("log", log);

  spyOnAPIMethod("runAmpliconTyper");
  spyOnAPIMethod("clearRun");
  spyOnAPIMethod("openRunReport");
  spyOnAPIMethod("ampliconTyperVersions", () => versions);

  return ampliconTyperAPI;
};
