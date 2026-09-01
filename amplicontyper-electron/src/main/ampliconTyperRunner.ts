import {spawn} from "child_process";
import {AmpliconTyperRunOptions} from "../shared/types";

export class AmpliconTyperRunner {
  private readonly exePath: string;
  private readonly internalBinPath: string;
  constructor(exePath: string, internalBinPath) {
      this.exePath = exePath;
      this.internalBinPath = internalBinPath;
  }

  public async runAmpliconTyper(options: AmpliconTyperRunOptions,
                                outputStream: NodeJS.WritableStream = process.stdout): Promise<void> {

      const {parameters} = options;
      const args = ['-b', parameters.bamDir, '-m', parameters.modelFile, '-o', parameters.outputReportFile];

      return new Promise((resolve, reject) => {
          // We need to add the installer's internal bin folder to the subprocess path so that AT's classify
          // script can find minimap2
          const env = {
              ...process.env,
              PATH: `${process.env.PATH};${this.internalBinPath}`
          };

          const proc = spawn(this.exePath, args, { env });

          // Pipe both stdout and stderr to the output stream
          proc.stdout.pipe(outputStream);
          proc.stderr.pipe(outputStream);

          proc.on('close', (code) => {
              if (code === 0) {
                  resolve();
              } else {
                  reject(new Error(`Process exited with code ${code}`));
              }
          });

          proc.on('error', (err) => {
              reject(err);
          });
      });
  }
}