import { z, type ZodString, type ZodObject, type ZodRawShape } from "zod";

const requiredString = (): ZodString =>
    z.string().nonempty("Required value");

export const runParametersSchema = (): ZodObject =>
    z.object({
        bamDir: requiredString(),
        modelFile: requiredString(),
        outputReportFile: requiredString()
    });
