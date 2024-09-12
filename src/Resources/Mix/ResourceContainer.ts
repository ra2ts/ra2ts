import { MixFile } from "./MixFile";

export interface ResourceContainer {
  files: MixFile[];
  
  fileFromName(filename: string): null | MixFile;
  isEncrypted(): boolean;
}