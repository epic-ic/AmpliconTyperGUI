import { spawn } from "child_process";
import path from "node:path";
import { AmpliconTyperRunOptions } from "../shared/types";

const pathDelimiter = path.delimiter;

export class AmpliconTyperRunner {
  private readonly exePath: string;
  private readonly internalBinPath: string;
  constructor(exePath: string, internalBinPath: string) {
    this.exePath = exePath;
    this.internalBinPath = internalBinPath;
  }

  public async runAmpliconTyper(
    options: AmpliconTyperRunOptions,
    outputStream: NodeJS.WritableStream = process.stdout
  ): Promise<void> {
    const { parameters } = options;

    // common args
    const args = [
      "-m",
      parameters.modelFile,
      "-o",
      parameters.outputReportFile
    ];

    if (parameters.metadataFile) {
        args.push(
            "-d",
            parameters.metadataFile.filePath,
            "-column_separator",
            parameters.metadataFile.delimiter,
            "-description_column",
            parameters.metadataFile.descriptionColumn
        );
    }

    if (parameters.sampleFileType === SampleFileType.BAM) {
        args.push(
            "-b",
            parameters.bamDir
        );
    }

    if (parameters.sampleFileType === SampleFileType.FASTQ) {
        args.push(
            "-f",
            parameters.fastqDir,
            "-b",
            parameters.outputBamDir
        );
    }

    return new Promise((resolve, reject) => {
      // We need to add the installer's internal bin folder to the subprocess path so that AT's classify
      // script can find minimap2
      const env = {
        ...process.env,
        PATH: `${process.env.PATH}${pathDelimiter}${this.internalBinPath}`
      };

      const proc = spawn(this.exePath, args, { env });

      // Pipe both stdout and stderr to the output stream
      proc.stdout.pipe(outputStream);
      proc.stderr.pipe(outputStream);

      proc.on("close", (code) => {
        outputStream.end();
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Process exited with code ${code}`));
        }
      });

      proc.on("error", (err) => {
        reject(err);
      });
    });
  }
}
