import { VirtualFileSystem } from "@/Resources/VirtualFileSystem";

interface ConstructFromArray<T> {
  fromArray(data: Uint8Array): T;
}

export class ResourceLoader {
  private cache: Record<string, any> = {};

  constructor(private resourceManager: VirtualFileSystem) {
  }

  resourceExists(name: string): boolean {
    return this.resourceManager.hasFile(name);
  }

  getResource<T>(name: string, type: ConstructFromArray<T>): T {
    if (this.cache[name] === undefined) {
      const data = this.resourceManager.getFile(name);
      if (data === null) {
        throw new Error(`Could not find "${name}"`);
      }
      this.cache[name] = type.fromArray(data);
    }
    return this.cache[name];
  }

  getResources<T>(names: string[], type: ConstructFromArray<T>): T[] {
    return names.map((name) => this.getResource(name, type));
  }
}