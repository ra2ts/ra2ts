import { AudioType, MessageBus, MessageType } from "@/MessageBus";
import { parseIni, VirtualFileSystem } from "@/Resources";
import { Theme } from "@/Audio";

export enum SoundEventControls {
  Loop = 'loop',
  Predelay = 'predelay',
  Random = 'random',
  Attach = 'attach',
  Decay = 'decay',
  All = 'all',
  Ambient = 'ambient',
}

export interface AudioOptions {
  volume?: number;
  loop?: boolean;
  type?: AudioType;
}

export class AudioManager {
  private settings: Record<string, Record<string, string | undefined> | undefined>;
  private currentSounds: Record<string, () => void> = {};

  constructor(private resourceManager: VirtualFileSystem, private bus: MessageBus) {
    const soundIniFile = this.resourceManager.getFile('sound.ini');
    if (soundIniFile === null) {
      throw new Error('Could not load sound.ini');
    }
    this.settings = parseIni(soundIniFile);

    bus.on(MessageType.AUDIO_FINISHED, (id) => {
      if (this.currentSounds[id] !== undefined) {
        this.currentSounds[id]();
        delete this.currentSounds[id];
      }
    });
    new Theme(resourceManager, this);
  }

  playSound(sound: string): Promise<void> {
    let soundSettings = this.settings[sound];
    if (soundSettings === undefined) {
      return Promise.resolve();
    }

    soundSettings = {...this.settings.Defaults ?? {}, ...soundSettings};
    if (soundSettings.Sounds === undefined) {
      return Promise.resolve();
    }

    const sounds = soundSettings.Sounds.split(' ');
    const controls = soundSettings.Control?.split(' ').map((val) => val.toLowerCase()) ?? [];
    let selectedSound = sounds[0];
    if (controls.includes(SoundEventControls.Random)) {
      selectedSound = sounds[Math.floor(Math.random() * sounds.length)];
    }

    return this.playFile(`${selectedSound}.wav`, { volume: parseInt(soundSettings.Volume ?? '80'), loop: false, type: AudioType.Game });
  }

  playFile(filename: string, {volume = 80, loop = false, type = AudioType.Game}: AudioOptions): Promise<void> {
    const wav = this.resourceManager.getFile(filename);
    if (wav !== null) {
      return this.playRawWav(wav, {volume, loop, type});
    }
    return Promise.reject();
  }

  private playRawWav(data: Uint8Array, {volume = 80, loop = false, type = AudioType.Game}: AudioOptions): Promise<void> {
    return new Promise((resolve) => {
      const id = crypto.randomUUID();
      this.bus.sendMessage(MessageType.PLAY_AUDIO, { id, data, volume, loop, type });
      this.currentSounds[id] = resolve;
    });
  }
}