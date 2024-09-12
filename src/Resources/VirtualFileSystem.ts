import { MessageBus, MessageType } from '@/MessageBus';
import { openDB, IDBPDatabase } from 'idb';
import { parseContainer, Resource, hashEntryName, Idx, DataReader } from '@/Resources';
import type { GameConfig, TheaterType } from '@/Engine';

const STORE_NAME = 'MIXES';
const SCHEMA_VERSION = 1;

export class VirtualFileSystem {
  private conn: Promise<IDBPDatabase<any>>;
  private files: Resource[] = [];
  private finishedLoadingFiles = false;
  private readyCallbacks: (() => void)[] = [];

  constructor(private config: GameConfig, private bus?: MessageBus) {
    this.hasRequiredMixes().then((hasMixes) => {
      if (!hasMixes && bus !== undefined) {
        bus.sendMessage(MessageType.REQUEST_GAME_FILES);
      } else {
        this.loadRequiredMixes();
      }
    });
    if (bus !== undefined) {
      bus.on(MessageType.GAME_FILES_SELECTED, async (files) => {
        const promises = files.map(async ({filename, data}) => this.saveMix(filename, data));
        await Promise.all(promises);
        await this.loadRequiredMixes();
      });
    }
  }

  get ready(): boolean {
    return this.finishedLoadingFiles;
  }

  public onReady(callback: () => void) {
    this.readyCallbacks.push(callback);
  }

  async hasRequiredMixes(): Promise<boolean> {
    const db = await this.db();
    const keys = await db.getAllKeys(STORE_NAME);
    const missingMixes = this.config.baseMixes.filter((filename) => !keys.includes(filename));
    if (missingMixes.length > 0) {
      console.log(`Missing game files: ${missingMixes.join(',')}`);
    }
    return missingMixes.length === 0;
  }

  getFile(name: string): Uint8Array | null {
    const id = hashEntryName(name);
    if (this.files[id] !== undefined) {
      return this.files[id].data;
    }
    return null;
  }

  hasFile(name: string): boolean {
    const id = hashEntryName(name);
    return this.files[id] !== undefined;
  }

  private async saveMix(name: string, data: Uint8Array) {
    const db = await this.db();
    db.add(STORE_NAME, data, name);
  }

  private async loadRequiredMixes() {
    const db = await this.db();
    let promises = this.config.baseMixes.map(async (filename) => {
      const data = await db.get(STORE_NAME, filename);
      this.loadMix(data);
    });
    await Promise.all(promises);
    promises = this.config.optionalMixes.map(async (filename) => {
      const data = await db.get(STORE_NAME, filename);
      this.loadMix(data);
    });
    await Promise.all(promises);
    this.config.expandedMixes.forEach((filename) => {
      const id = hashEntryName(filename);
      if (this.files[id] === undefined) {
        throw new Error(`${filename} is not present`);
      }
      this.loadMix(this.files[id].data);
      delete this.files[id];
    });

    for (const theater in this.config.enabledTheaters) {
      const t = this.config.enabledTheaters[theater as TheaterType];
      t?.mixFiles.forEach((filename) => {
        const id = hashEntryName(filename);
        if (this.files[id] === undefined) {
          throw new Error(`${filename} is not present`);
        }
        this.loadMix(this.files[id].data);
        delete this.files[id];
      });
    }

    if (this.hasFile('audio.idx') && this.hasFile('audio.bag')) {
      const idxData = this.getFile('audio.idx');
      const bag = this.getFile('audio.bag');
      const idx = Idx.fromArray(<Uint8Array>idxData);
      const reader = new DataReader(<Uint8Array>bag);
      for (const entry of idx.entries) {
        entry.data = reader.readRaw(entry.offset, entry.length);
        entry.name += '.wav';
        this.files[entry.id] = entry;
      }
    }
    this.finishedLoadingFiles = true;
    this.readyCallbacks.forEach((callback) => callback());
  }

  private loadMix(data: Uint8Array) {
    const container = parseContainer(data);
    container.files.forEach((file) => this.files[file.id] = file);
  }

  private async db(): Promise<IDBPDatabase<any>> {
    if (this.conn === undefined) {
      this.conn = openDB(
        STORE_NAME,
        SCHEMA_VERSION,
        {
          upgrade(db) {
            db.createObjectStore(STORE_NAME);
          }
        });
    }

    return this.conn;
  }
}