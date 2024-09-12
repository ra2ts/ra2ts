import { parseIni } from "@/Resources/parseIni";
import { Map } from "@/Resources/Map";
import { Scenario } from "@/Engine/Campaign/Scenario";
import type { VirtualFileSystem } from "@/Resources/VirtualFileSystem";
import type { GameConfig } from "@/Engine/GameConfig";
import type { Internationalization } from "@/Engine/Internationalization";

export class Campaign {
  private _scenarios: Scenario[] = [];

  public constructor(resourceManager: VirtualFileSystem, config: GameConfig, i18n: Internationalization) {
    const campaignData = resourceManager.getFile(config.campaignIni);
    if (campaignData === null) {
      throw new Error(`Unable to load campaign settings from "${config.campaignIni}"`);
    }
    const ini = parseIni(campaignData);
    for (const scenario of Object.values(ini.Battles)) {
      const mapFile = resourceManager.getFile(ini[scenario].Scenario);
      if (mapFile !== null) {
        this._scenarios.push(new Scenario(Map.fromArray(mapFile), i18n.getString(ini[scenario].Description)));
      }
    }
  }

  public get scenarios(): Scenario[] {
    return this._scenarios;
  }
}