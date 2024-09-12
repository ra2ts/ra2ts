import { Coordinate, ObjectType, ObjectTypeManager, Theater, TheaterConfig, TileCollection } from "@/Engine";
import { RA2Config } from "@/Games";
import { SpriteMaterial } from "@/Graphics";
import { Ini, Map, Palette, ResourceLoader, Shp, TileDirection, VirtualFileSystem } from "@/Resources";

(() => {
  const canvas = <HTMLCanvasElement>document.getElementById('map');
  const ctx = canvas.getContext('2d');
  const gameConfig = RA2Config;
  const vfs = new VirtualFileSystem(gameConfig);
  const loader = new ResourceLoader(vfs);
  const queryParams = new URLSearchParams(window.location.search);
  const tileIndexToSet: number[] = [];
  const tileSetToIndex: number[] = [];
  const tileCollection: TileCollection = new TileCollection(loader);

  vfs.onReady(() => renderMap(queryParams.get('map') ?? 'tn04t2'));

  function isoToScreen(x: number, y: number) {
    return {
      x: canvas.width / 2 + ((x - y) * 30),
      y: ((x + y) * 15) - canvas.height / 2,
    };
  }

  function screenToIso(x: number, y: number) {
    x -= canvas.width / 2;
    y += canvas.height / 2;
    return {
      x: Math.floor(y / 30 + x / 60),
      y: Math.floor(y / 30 - x / 60),
    }
  }

  function renderMap(mapName: string) {
    const rules = loader.getResource('rules.ini', Ini);
    const otm = new ObjectTypeManager(loader, rules);
    const map = loader.getResource(`${mapName}.map`, Map);
    const theaterConfig = gameConfig.enabledTheaters[map.theater];

    if (theaterConfig === undefined) {
      throw new Error(`Cannot load theater "${map.theater}", as it's unknown`);
    }

    const overlayPalette = loader.getResource(theaterConfig.overlayPalette, Palette);
    const palette = loader.getResource(theaterConfig.isoPalette, Palette);
    const theater = loader.getResource(theaterConfig.iniFile, Theater);
    loadTilesets(theater, theaterConfig, palette);
    fixTiles(map, theater);
    drawTiles(map);
    drawOverlays(otm, map, overlayPalette);
    drawTerrain(otm, map, palette);

    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const screenX = (e.clientX - rect.left) * scaleX;
      const screenY = (e.clientY - rect.top) * scaleY;
      const { x, y } = screenToIso(screenX, screenY);
      const tile = map.getTile(x, y);
    });
  }

  function loadTilesets(theater: Theater, theaterConfig: TheaterConfig, palette: Palette) {
    tileCollection.loadTilesets(theater, theaterConfig, palette);
  }

  function getRandomArrayItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  } 

  function drawTiles(map: Map) {
    canvas.width = map.maxTileCoords.x * 30;
    canvas.height = map.maxTileCoords.y * 15;
    if (ctx === null) {
      throw new Error('Unable to get rendering context when drawing map tiles');
    }
    for (const tile of map.tiles) {
      if (!tileCollection.tileExists(tile.index, tile.subIndex)) {
        console.error(`Unknown tile ${tile.index}`);
        continue;
      }
      const terrain = tileCollection.getTerrain(tile.index);
      const terrainCell = terrain.tiles[tile.subIndex];
      const halfTileHeight = terrain.blockImageHeight / 2;
      const halfTileWidth = terrain.blockImageWidth / 2;
      const {x, y} = isoToScreen(tile.x, tile.y);
      const tileImage = tileCollection.getTile(tile.index, tile.subIndex);
      const rect = tileCollection.getTileBounds(tile.index, tile.subIndex);
      if (tileImage && rect) {
        ctx.drawImage(tileImage, x - rect.tileXOffset, y - rect.tileYOffset/*  - (tile.level * halfTileHeight) */);
      }
    }

    if (queryParams.get('showLocalSize') !== null) {
      const left = Math.max((map.localSize.topLeft.x + 1) * 60, 0);
			const top = Math.max(map.localSize.topLeft.y - 3, 0) * 45;
			const right = (map.localSize.topLeft.x + map.localSize.bottomRight.x) * 60;
			const bottom = 2 * (map.localSize.topLeft.y - 3 + map.localHeight + 5) * 15;

      ctx.strokeStyle = 'orange';
      ctx.lineWidth = 5;
      ctx.strokeRect(left, top, right, bottom);
    }
  }

  function drawOverlays(otm: ObjectTypeManager, map: Map, palette: Palette) {
    for (const mapOverlay of map.overlays) {
      const overlayType = otm.overlays[mapOverlay.overlayId];
      drawObject(overlayType, map, palette, { x: mapOverlay.tile.x, y: mapOverlay.tile.y }, mapOverlay.overlayValue);
    }
  }

  function drawTerrain(otm: ObjectTypeManager, map: Map, palette: Palette) {
    for (const terrain of map.terrain) {
      const terrainType = otm.terrain(terrain.name);
      drawObject(terrainType, map, palette, { x: terrain.tile.x, y: terrain.tile.y });
    }
  }

  function drawObject(objectType: ObjectType, map: Map, palette: Palette, coordinate: Coordinate, frameOffset: number = 0) {
    const theaterConfig = gameConfig.enabledTheaters[map.theater];
    const extension = theaterConfig?.fileExtension;
    const filename = `${objectType.image}.${extension}`;

    if (!loader.resourceExists(filename)) {
      throw new Error(`Couldn't find ${filename} for (${coordinate.x}, ${coordinate.y})`);
    }
    if (ctx === null) {
      throw new Error('Unable to get rendering context when drawing map tiles');
    }

    const shp = loader.getResource(filename, Shp);
    const sprite = new SpriteMaterial(shp, palette);
    sprite.onReady.then(() => {
      const frame = sprite.frames[frameOffset];
      if (frame?.map !== null) {
        const {x, y} = isoToScreen(coordinate.x, coordinate.y);
        
        if (!objectType.noShadow) {
          const shadowOffset = sprite.frames.length / 2;
          const shadowFrame = sprite.frames[frameOffset + shadowOffset];
          if (shadowFrame !== undefined && shadowFrame.map !== null) {
            ctx.drawImage(shadowFrame.map?.source.data, x, y);
          }
        }

        ctx.drawImage(frame.map.source.data, x - (sprite.frameWidth(frameOffset) / 2), y - (sprite.frameHeight(frameOffset) / 2));
      }
    });
  }

  function fixTiles(map: Map, theater: Theater) {
    for (const tile of map.tiles) {
      if (theater.isCLAT(tileIndexToSet[tile.index])) {
        const latSetNumber = theater.getLAT(tileIndexToSet[tile.index]);
        if (latSetNumber !== null) {
          tile.index = tileSetToIndex[latSetNumber];
        }
      }

      let transitionTile = 0;
      const tileTopRight = map.getNeighbourTile(tile, TileDirection.TopRight);
      const tileBottomRight = map.getNeighbourTile(tile, TileDirection.BottomRight);
      const tileBottomLeft = map.getNeighbourTile(tile, TileDirection.BottomLeft);
      const tileTopLeft = map.getNeighbourTile(tile, TileDirection.TopLeft);

      // Find out setnums of adjacent cells
      if (tileTopRight != null && theater.tilesAreConnected(tileIndexToSet[tile.index], tileIndexToSet[tileTopRight.index]))
        transitionTile += 1;

      if (tileBottomRight != null && theater.tilesAreConnected(tileIndexToSet[tile.index], tileIndexToSet[tileBottomRight.index]))
        transitionTile += 2;

      if (tileBottomLeft != null && theater.tilesAreConnected(tileIndexToSet[tile.index], tileIndexToSet[tileBottomLeft.index]))
        transitionTile += 4;

      if (tileTopLeft != null && theater.tilesAreConnected(tileIndexToSet[tile.index], tileIndexToSet[tileTopLeft.index]))
        transitionTile += 8;

      // Crystal LAT tile connects to specific tiles in CrystalCliff
      if (theater.isCrystalLAT(tileIndexToSet[tile.index])) {
        if (
          tileTopRight != null &&
          theater.isCrystalCliff(tileIndexToSet[tileTopRight.index]) &&
          tileTopRight.index == (tileSetToIndex[tileIndexToSet[tileTopRight.index]] + 1)
        ) {
            transitionTile = 0;
        }
        if (
          tileBottomRight != null &&
          theater.isCrystalCliff(tileIndexToSet[tileBottomRight.index]) &&
          tileBottomRight.index == (tileSetToIndex[tileIndexToSet[tileBottomRight.index]] + 4)
        ) {
          transitionTile = 0;
        }
        if (
          tileBottomLeft != null &&
          theater.isCrystalCliff(tileIndexToSet[tileBottomLeft.index]) &&
          tileBottomLeft.index == tileSetToIndex[tileIndexToSet[tileBottomLeft.index]]
        ) {
          transitionTile = 0;
        }
        if (
          tileTopLeft != null &&
          theater.isCrystalCliff(tileIndexToSet[tileTopLeft.index]) &&
          tileTopLeft.index == (tileSetToIndex[tileIndexToSet[tileTopLeft.index]] + 5)
        ) {
          transitionTile = 0;
        }
      }

      // Swamp has TilesInSet=9 instead of 1 for LAT tilesets
      // which doubles as a normal set for remaining tiles.
      if (theater.isSwampLAT(tileIndexToSet[tile.index]) && tile.index > tileSetToIndex[tileIndexToSet[tile.index]]) {
        transitionTile = 0;
      }

      if (transitionTile > 0) {
        // Find Tileset that contains the connecting pieces
        const clatSet = theater.getCLATSet(tileIndexToSet[tile.index]);
        if (clatSet !== null) {
          tile.index = tileSetToIndex[clatSet] + transitionTile;
        }
      }
    }
  }

})();