import { ObjectType } from "@/Engine/GameObjects/ObjectType";
import { ObjectTypeManager } from "@/Engine/GameObjects/ObjectTypeManager";
import { IniSection } from "@/Resources/IniSection";
import { Color } from "@/Resources/Color";
import { LandType } from "@/Engine/Map/LandType";

export class OverlayType extends ObjectType {
  private _land: LandType;
  private _wall: boolean;
  private _tiberium: boolean;
  private _crate: boolean;
  private _crateTrigger: boolean;
  private _explodes: boolean;
  private _overrides: boolean;
  private _damageLevels: number;
  private _radarColor: Color;
  private _noUseLandTileType: boolean;
  private _isVeinholeMonster: boolean;
  private _isVeins: boolean;
  private _chainReaction: boolean;
  private _drawFlat: boolean;
  private _isARock: boolean;
  private _isRubble: boolean;

  constructor(internalName: string, ini: IniSection, otm: ObjectTypeManager) {
    super(internalName, ini, otm);

    this._land = ini.readEnum('LandType', LandType, LandType.Clear);
    this._wall = ini.readBool('Wall');
    this._tiberium = ini.readBool('Tiberium');
    this._crate = ini.readBool('Crate');
    this._crateTrigger = ini.readBool('CrateTrigger');
    this._overrides = ini.readBool('Overrides');
    this._damageLevels = ini.readInt('DamageLevels', 1);
    this._radarColor = ini.readColor('RadarColor');
    this._noUseLandTileType = ini.readBool('NoUseLandTileType', true);
    this._isVeinholeMonster = ini.readBool('IsVeinholeMonster');
    this._isVeins = ini.readBool('IsVeins', true);
    this._chainReaction = ini.readBool('ChainReaction', true);
    this._drawFlat = ini.readBool('DrawFlat', true);
    this._isARock = ini.readBool('IsARock', true);
    this._isRubble = ini.readBool('IsRubble', true);
  }
}