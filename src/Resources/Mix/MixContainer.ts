import { ResourceContainer } from "./ResourceContainer";
import { hashEntryName } from "./hashEntryName";
import { MixFile } from "./MixFile";

export class MixContainer implements ResourceContainer {
  private flags?: number;
  private headerIsEncrypted: boolean = false;
  private checksumPresent: boolean = false;
  private _files: MixFile[] = [];
  private size: number;

  public setHeaderIsEncrypted(headerIsEncrypted: boolean) {
    this.headerIsEncrypted = headerIsEncrypted;
  }
  public isEncrypted(): boolean {
    return this.headerIsEncrypted;
  }

  public setChecksumPresent(checksumPresent: boolean) {
    this.checksumPresent = checksumPresent;
  }

  public setSize(size: number) {
    this.size = size;
  }

  public addFile(file: MixFile) {
    this._files.push(file);
  }

  public get files(): MixFile[] {
    return this._files;
  }

  public fileFromId(id: number): null | MixFile {
    for (const f of this._files) {
      if (f.id === id) {
        return f;
      }
    }
    return null;
  }

  public fileFromName(filename: string): null | MixFile {
    const id = hashEntryName(filename);
    return this.fileFromId(id);
  }
}