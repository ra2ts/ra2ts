import { AbstractType } from "@/Engine/GameObjects/AbstractType";
import { ObjectTypeManager } from "@/Engine/GameObjects/ObjectTypeManager";
import { Side } from "@/Engine/GameObjects/Side";
import { IniSection } from "@/Resources/IniSection";

export class Country extends AbstractType {
  private _suffix: string;
  private _prefx: string;
  private _color: string;
  private _multiplayer: boolean;
  private _smartAI: boolean;
  private _side: Side;

  constructor(ini: IniSection, otm: ObjectTypeManager) {
    super(ini, otm);

    this._suffix = ini.readString('Suffix');
    this._prefx = ini.readString('Prefix');
    this._color = ini.readString('Color');
    this._multiplayer = ini.readBool('Multiplayer');
    this._smartAI = ini.readBool('SmartAI');
    this._side = ini.readEnum('side', Side, Side.Civilian);
  }
}