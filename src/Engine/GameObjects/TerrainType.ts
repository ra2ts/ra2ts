import { ObjectType } from "@/Engine/GameObjects/ObjectType";
import { ObjectTypeManager } from "@/Engine/GameObjects/ObjectTypeManager";
import { Color } from "@/Resources/Color";
import { IniSection } from "@/Resources/IniSection";

export class TerrainType extends ObjectType {
  private _isVeinHole: boolean;
  private _waterBound: boolean;
  private _spawnsTiberium: boolean;
  private _isFlammable: boolean;
  private _radarColor: Color;
  private _isAnimated: boolean;
  private _animationRate: number;
  private _animationProbability: number;
  private _temperateOccupationBits: number;
  private _snowOccupationBits: number;
  private _yDrawFudge: number;

  constructor(internalName: string, ini: IniSection, otm: ObjectTypeManager) {
    super(internalName, ini, otm);
    
    this._isVeinHole = ini.readBool('IsVeinHole');
    this._waterBound = ini.readBool('WaterBound');
    this._spawnsTiberium = ini.readBool('SpawnsTiberium');
    this._isFlammable = ini.readBool('IsFlammable');
    this._radarColor = ini.readColor('RadarColor');
    this._isAnimated = ini.readBool('IsAnimated');
    this._animationRate = ini.readInt('AnimationRate');
    this._animationProbability = ini.readFloat('AnimationProbability');
    this._temperateOccupationBits = ini.readInt('TemperateOccupationBits', 7);
    this._snowOccupationBits = ini.readInt('SnowOccupationBits', 7);
    this._yDrawFudge = ini.readInt('YDrawFudge');
  }
}