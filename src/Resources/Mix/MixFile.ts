export class MixFile {
  constructor(
    private _id: number,
    private _name: string | null,
    private _offset: number,
    private _size: number,
    private _data: Uint8Array,
  ) {

  }

  public get name(): string | null {
    return this._name;
  }

  public set name(newName: string) {
    this._name = newName;
  }

  public get id(): number {
    return this._id;
  }

  public get offset(): number {
    return this._offset;
  }

  public get size(): number {
    return this._size;
  }

  public get data(): Uint8Array {
    return this._data;
  }
}