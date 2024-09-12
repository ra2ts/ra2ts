import { Csf, VirtualFileSystem } from "@/Resources";
import { GameConfig } from "./GameConfig";

export class Internationalization {
  private _csf: Csf;
  constructor(resourceManager: VirtualFileSystem, config: GameConfig) {
    const data = resourceManager.getFile(config.localizationFile);
    if (data) {
      this._csf = Csf.fromArray(data);
    } else {
      this._csf = new Csf();
    }
  }

  public getString(key: string): string {
    return this._csf.getString(key) ?? key;
  }
}