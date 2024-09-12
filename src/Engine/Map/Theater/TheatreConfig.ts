export enum TheaterType {
  Generic = 'generic',
  Urban = 'urban',
  Snow = 'snow',
  Temperate = 'temperate',
}

export type EnabledTheaters = {
  [T in TheaterType]?: TheaterConfig
}

export interface TheaterConfig {
  fileExtension: string;
  marbleMadnessExtension: string;
  mixFiles: string[];
  newTheatreLetter: string;
  iniFile: string;
  isoPalette: string;
  overlayPalette: string;
}