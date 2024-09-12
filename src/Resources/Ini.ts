import { IniSection } from "@/Resources/IniSection";
import ini from 'ini';

export class Ini {
  private _sections: Record<string, Record<string, string>> = {};

  public static fromArray(data: Uint8Array): Ini {
    const result = new Ini();
    const decoder = new TextDecoder('utf-8');
    const file = decoder.decode(data);
    result._sections = ini.parse(file.replaceAll(/([\t ])*;(.*)$/gm, ''));
    return result;
  }

  public static fromRecords(data: Record<string, Record<string, string>>): Ini {
    const ini = new Ini();
    ini._sections = data;
    return ini;
  }

  public getSection(section: string): IniSection {
    return new IniSection(this._sections[section]);
  }

  public sectionExists(section:string): boolean {
    return this._sections[section] !== undefined;
  }
}