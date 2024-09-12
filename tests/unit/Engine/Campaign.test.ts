import { expect, test, vi } from 'vitest';
import { Campaign } from '@/Engine/Campaign/Campaign';
import { VirtualFileSystem } from "@/Resources/VirtualFileSystem";
import { Internationalization } from "@/Engine/Internationalization";

vi.mock('@/Resources/VirtualFileSystem', () => {
  const VirtualFileSystem = vi.fn();

  const iniContent = {
    'test.ini': `
[Battles]
1=TUT1
2=TUT2

[TUT1]
CD=0
Scenario=trn01t.MAP
FinalMovie=
Description=DESC:TUT1

[TUT2]
CD=0
Scenario=trn02t.MAP
FinalMovie=
Description=DESC:TUT2`,
    'trn01t.MAP': `
[Map]
Theater=URBAN
Size=0,0,1,1
LocalSize=2,6,46,52
    `,
    'trn02t.MAP': `
[Map]
Theater=URBAN
Size=0,0,1,1
LocalSize=2,6,46,52
    `,
  };
  VirtualFileSystem.prototype.getFile = vi.fn((file) => (new TextEncoder()).encode(iniContent[file]));

  return { VirtualFileSystem };
});

vi.mock('@/Engine/Internationalization', () => {
  const Internationalization = vi.fn();
  
  Internationalization.prototype.getString = vi.fn(() => '');

  return { Internationalization };
});

vi.mock('@/Resources/Map', () => {
  const Map = {
    fromArray: vi.fn(),
  };
  return { Map };
});

test('test Campaign', () => {
  const vfs = new VirtualFileSystem();
  const gameConfig = {
    enabledTheaters: [],
    baseMixes: ['test'],
    optionalMixes: [],
    expandedMixes: [],
    campaignIni: 'test.ini',
    rulesIni: 'rules.ini',
    artIni: 'art.ini',
    localizationFile: '',
    fractions: [],
    startScreen: {},
  };
  const i18n = new Internationalization();

  const campaign = new Campaign(vfs, gameConfig, i18n);

  expect(vfs.getFile).toBeCalledWith('test.ini');
  expect(vfs.getFile).toBeCalledWith('trn02t.MAP');
  expect(vfs.getFile).toBeCalledWith('trn01t.MAP');
  expect(campaign.scenarios.length).toBe(2);
});
