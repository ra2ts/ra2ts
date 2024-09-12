import { expect, test, vi } from 'vitest';
import { TerrainTileMaterial } from '@/Graphics/TerrainTileMatieral';
import { Terrain } from '@/Resources/Terrain';
import { Palette } from '@/Resources/Palette';

vi.mock('@/Resources/Terrain', () => {
  const Terrain = vi.fn();
  Terrain.prototype.tiles = [];

  return { Terrain };
});

vi.mock('@/Resources/Palette', () => {
  const Palette = vi.fn();
  Palette.prototype.getColorAt = vi.fn();

  return { Palette };
})

test('test TerrainTileMaterial', () => {
  const terrain = new Terrain();
  const palette = new Palette();

  const material = new TerrainTileMaterial(terrain, palette);
  expect(palette.getColorAt).toBeCalledTimes(0);
  expect(material.frames.length).toBe(0);
});
