import { Ini, parseIni, ResourceLoader, VirtualFileSystem } from "@/Resources";
import { GameConfig, ObjectTypeManager } from "@/Engine";

export class GameRules {
  private _objectTypeManager: ObjectTypeManager;
  private _sides: Side[];

  constructor(private _loader: ResourceLoader, private _config: GameConfig) {
    const rules = this._loader.getResource(_config.rulesIni, Ini);
    this._objectTypeManager = new ObjectTypeManager(_loader, rules);

    //this._sides = Object.entries(rules.Sides).map(([name, countries]) => ({ name, countries: countries.split(',')}));
  }

  public get sides(): Side[] {
    return this._sides;
  }
}

interface Side {
  name: string;
  countries: string[];
}