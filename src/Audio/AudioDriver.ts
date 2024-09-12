import { AudioType, MessageBus, MessageType } from "@/MessageBus";
import { decodeImaAdpcm } from 'ima-adpcm-decoder';

export class AudioDriver {
  private context: AudioContext;
  private masterVolume: GainNode;
  private gameVolume: GainNode;
  private themeVolume: GainNode;

  constructor(bus: MessageBus) {
    this.context = new AudioContext();
    this.masterVolume = this.context.createGain();
    this.masterVolume.gain.setValueAtTime(0.8, this.context.currentTime);
    this.masterVolume.connect(this.context.destination);

    this.gameVolume = this.context.createGain();
    this.gameVolume.gain.setValueAtTime(0.8, this.context.currentTime);
    this.gameVolume.connect(this.masterVolume);

    this.themeVolume = this.context.createGain();
    this.themeVolume.gain.setValueAtTime(0.8, this.context.currentTime);
    this.themeVolume.connect(this.masterVolume);

    bus.on(MessageType.PLAY_AUDIO, (({ id, data, volume, loop, type }) => {
      const audioBuffer = decodeImaAdpcm(this.context, data.buffer);
      const src = this.context.createBufferSource();
      const gainNode = this.context.createGain();
      gainNode.gain.setValueAtTime(volume / 100, this.context.currentTime);
      gainNode.connect(type === AudioType.Game ? this.gameVolume : this.themeVolume);
      src.buffer = audioBuffer;
      src.connect(gainNode);
      src.start(0);
      src.loop = loop;
      src.onended = () => {
        bus.sendMessage(MessageType.AUDIO_FINISHED, id);
        gainNode.disconnect();
        src.disconnect();
      };
    }));
  }
}