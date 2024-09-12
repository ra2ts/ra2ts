import { SpriteMaterial } from '@/Graphics';
import { Palette} from '@/Resources/Palette';
import { Shp } from '@/Resources/Shp';
import { Ini } from '@/Resources/Ini';
import { AbstractType } from '@/Engine/GameObjects/AbstractType';
import { IniSection } from '@/Resources/IniSection';
import { ResourceLoader } from '@/Resources/ResourceLoader';
import { OverlayType } from '@/Engine/GameObjects/OverlayType';
import { TerrainType } from '@/Engine/GameObjects/TerrainType';

interface ConstructFromIni<T> {
  new(name: string, resources: IniSection, otm: ObjectTypeManager): T;
}

export class ObjectTypeManager {
  //private infantryTypes: Record<string, Techno> = {};
  //private countries: Record<string, Country> = {};
  //private weapons: Record<string, Weapon> = {};
  private _overlays: OverlayType[] = [];
  private _terrain: TerrainType[] = [];
  private _art: Ini;

  constructor(private _loader: ResourceLoader, private _rules: Ini) {
    this.parseRules();
  }

  get<T extends AbstractType>(type: ConstructFromIni<T>, name: string): T {
    const object = new type(name, this._rules.getSection(name), this);
    if (object.name === '') {
      object.name = name;
    }
    return object;
  }

  public get overlays(): OverlayType[] {
    return this._overlays;
  }

  public terrain(key: string): TerrainType {
    const result = this._terrain.find((t) => t.internalName === key);
    if (result === undefined) {
      throw new Error(`Could no find terrain: "${key}"`);
    }
    return result;
  }

  parseRules(): void {
    this._art = this._loader.getResource('art.ini', Ini);
    this._overlays = this.loadSection(OverlayType, 'OverlayTypes');
    this._terrain = this.loadSection(TerrainType, 'TerrainTypes');
  }

  private loadSection<T extends AbstractType>(type: ConstructFromIni<T>, sectionName: string): T[] {
    const section = this._rules.getSection(sectionName);
    return section.asArray().map(({ value }) => this.get(type, value));
  }

  private getSprite(imageName: string, palette: Palette, key?: string): SpriteMaterial | null {
    const art: IniSection = this._art.getSection(imageName);
    if (art === undefined) {
      return null;
    }
    const shpFileName = (key && this._art.sectionExists(key) !== false) ? art[key] : imageName;
    if (art !== undefined && (key === undefined || this._art.sectionExists(key) !== undefined)) {
      const shp = this._loader.getResource(`${shpFileName.toLowerCase()}.shp`, Shp);
      return new SpriteMaterial(shp, palette);
    }
    return null;
  }
}