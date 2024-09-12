import { GameConfig, TheaterType } from "@/Engine";
import { MainMenu } from "./Screens/MainMenu";

export const RA2Config: GameConfig = {
  baseMixes: ['ra2.mix', 'language.mix', 'multi.mix', 'maps01.mix', 'maps01.mix'],
  optionalMixes: ['theme.mix'],
  expandedMixes: ['conquer.mix', 'cameo.mix', 'cache.mix', 'local.mix', 'neutral.mix', 'audio.mix'],
  campaignIni: 'mapsel.ini',
  rulesIni: 'rules.ini',
  artIni: 'art.ini',
  localizationFile: 'ra2.csf',
  fractions: ['gdi', 'nod'],
  startScreen: MainMenu,
  enabledTheaters: {
    [TheaterType.Generic]: {
      fileExtension: '',
      marbleMadnessExtension: '',
      mixFiles: ['generic.mix', 'isogen.mix'],
      newTheatreLetter: 'g',
      iniFile: '',
      isoPalette: '',
      overlayPalette: '',
    },
    [TheaterType.Urban]: {
      fileExtension: 'urb',
      marbleMadnessExtension: 'mmu',
      mixFiles: ['urban.mix', 'urb.mix', 'isourb.mix'],
      newTheatreLetter: 'u',
      iniFile: 'urban.ini',
      isoPalette: 'isourb.pal',
      overlayPalette: 'urban.pal',
    },
    [TheaterType.Snow]: {
      fileExtension: 'sno',
      marbleMadnessExtension: 'mms',
      mixFiles: ['snow.mix', 'isosnow.mix', 'sno.mix'],
      newTheatreLetter: 'a',
      iniFile: 'snow.ini',
      isoPalette: 'isosno.pal',
      overlayPalette: 'snow.pal',
    },
    [TheaterType.Temperate]: {
      fileExtension: 'tem',
      marbleMadnessExtension: 'mmt',
      mixFiles: ['tem.mix', 'isotemp.mix', 'temperat.mix'],
      newTheatreLetter: 't',
      iniFile: 'temperat.ini',
      isoPalette: 'isotem.pal',
      overlayPalette: 'temperat.pal',
    },
  }
}