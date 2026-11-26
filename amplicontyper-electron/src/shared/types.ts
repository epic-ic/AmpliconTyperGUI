// TODO: add AT version
export interface AmpliconTyperVersions {
  ampliconTyperGUI: string;
}

export interface MetadataFileParameters {
  filePath: string;
  delimiter: string;
  descriptionColumn: string;
};

// Parameters which are shared between both run parameters types
export interface BaseRunParameters {
  modelFile: string;
  outputReportFile: string;
  metadataFile?: MetadataFileParameters;
}

export enum SampleFileType {
  BAM = "BAM",
  FASTQ = "FASTQ"
}

export interface BAMRunParameters extends BaseRunParameters {
  sampleFileType: SampleFileType.BAM;
  bamDir: string;
}

export interface FASTQRunParameters extends BaseRunParameters {
  sampleFileType: SampleFileType.FASTQ;
  fastqDir: string;
  outputBamDir: string;
}

export type AmpliconTyperRunParameters = BAMRunParameters | FASTQRunParameters;

export interface AmpliconTyperSettings {
  // TODO: These settings change more rarely than the run parameters
}

export interface AmpliconTyperRunOptions {
  parameters: AmpliconTyperRunParameters;
  settings: AmpliconTyperSettings;
}

export interface AppState {
  doneInitialSubmit: boolean;
  doneInitialValidate: boolean;
}

export interface SaveFileDialogOptions {
  title: string;
  defaultPath: string;
  filters?: {
    name: string;
    extensions: string[];
  }[];
}

export interface OpenFileDialogOptions extends SaveFileDialogOptions {
  selectFolder: boolean;
}
