import { EnabledTheaters } from "@/Engine";
import { ScreenConstructable } from "@/Graphics";

export interface GameConfig {
  enabledTheaters: EnabledTheaters;
  baseMixes: string[];
  optionalMixes: string[];
  expandedMixes: string[];
  campaignIni: string;
  rulesIni: string;
  artIni: string;
  localizationFile: string;
  fractions: string[];
  startScreen: ScreenConstructable;
}