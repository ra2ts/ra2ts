import { AudioType } from "@/MessageBus";
import { parseIni, VirtualFileSystem } from "@/Resources";
import { AudioManager } from "./AudioManager";

export class Theme {
  private settings: Record<string, Record<string, string | undefined> | undefined>;
  private tracks: string[] = [];
  private shouldStop: boolean = false;

  constructor(private resourceManager: VirtualFileSystem, private audio: AudioManager) {
    const themeIniFile = this.resourceManager.getFile('theme.ini');
    if (themeIniFile === null) {
      throw new Error('Could not load theme.ini');
    }
    this.settings = parseIni(themeIniFile);
    for (const key of Object.values(this.settings.Themes ?? {})) {
      if (key !== undefined && key.trim() !== '') {
        const track = this.settings[key];
        if (track !== undefined && track.Sound !== undefined) {
          const trackExists = resourceManager.hasFile(track.Sound + '.wav');
          if (trackExists && track.Normal !== 'no') {
            this.tracks.push(track.Sound);
          }
        }
      }
    }

    this.play();
  }

  public async play() {
    if (this.tracks.length === 0) {
      return;
    }

    let i = 0;
    while (this.shouldStop === false) {
      await this.audio.playFile(this.tracks[i] + '.wav', { type: AudioType.Theme });
      i++;
      if (i >= this.tracks.length) {
        i = 0;
      }
    }
  }
}