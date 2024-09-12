import { SpriteMaterial } from "@/Graphics";
import { AbstractType } from "@/Engine/GameObjects/AbstractType";
import { ArmorType } from "@/Engine/GameObjects/ArmorType";
import { ObjectTypeManager } from "@/Engine/GameObjects/ObjectTypeManager";
import { Sound } from "@/Engine/GameObjects/Sound";
import { Color } from "@/Resources/Color";
import { IniSection } from "@/Resources/IniSection";
import { ResourceLoader } from "@/Resources/ResourceLoader";

export class ObjectType extends AbstractType {
  private _iconMaterial: SpriteMaterial | null;
  private _altIconMaterial: SpriteMaterial | null;
  private _spriteMaterial: SpriteMaterial | null;
  private _image: string;
  private _crushSound: Sound;
  private _crushable: boolean;
  private _bombable: boolean;
  private _noSpawnAlt: boolean;
  private _alternateArticArt: boolean;
  private _radarInvisible: boolean;
  private _selectable: boolean;
  private _legalTarget: boolean;
  private _armor: ArmorType;
  private _strength: number;
  private _immune: boolean;
  private _insignificant: boolean;
  private _hasRadialIndicator: boolean;
  private _radialColor: Color;
  private _noShadow: boolean;

  constructor(internalName: string, ini: IniSection, otm: ObjectTypeManager, loader: ResourceLoader) {
    super(internalName, ini, otm);
    this._iconMaterial = null;
    this._altIconMaterial = null;
    this._spriteMaterial = null;
    this._crushable = ini.readBool('Crushable');
    this._bombable = ini.readBool('Bombable', true);
    this._noSpawnAlt = ini.readBool('NoSpawnAlt');
    this._alternateArticArt = ini.readBool('AlternateArticArt');
    this._radarInvisible = ini.readBool('RadarInvisible');
    this._selectable = ini.readBool('Selectable', true);
    this._armor = ini.readEnum('Armor', ArmorType, ArmorType.None);
    this._strength = ini.readInt('Strength', 0);
    this._immune = ini.readBool('Immune');
    this._insignificant = ini.readBool('Insignificant');
    this._hasRadialIndicator = ini.readBool('HasRadialIndicator');
    this._radialColor = ini.readColor('RadialColor');
    this._image = ini.readString('Image');
    this._noShadow = ini.readBool('NoShadow', false);
  }

  public get image(): string {
    return this._image !== '' ? this._image : this._internalName;
  }

  public get noShadow(): boolean {
    return this._noShadow;
  }
}