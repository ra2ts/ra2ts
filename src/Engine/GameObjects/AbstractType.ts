import { ObjectTypeManager } from "@/Engine";
import { ResourceLoader } from "@/Resources/ResourceLoader";
import { IniSection } from "@/Resources/IniSection";

export class AbstractType {
  protected _internalName: string;
  protected _uiName: string | null;
  protected _name: string;

  constructor(internalName: string, ini: IniSection, otm: ObjectTypeManager) {
    this._internalName = internalName;
    this._name = ini.readString('Name');
    this._uiName = ini.readString('UIName') ?? null;
  }

  public get uiName() {
    return this._uiName;
  }

  public get name() {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get internalName() {
    return this._internalName;
  }
}