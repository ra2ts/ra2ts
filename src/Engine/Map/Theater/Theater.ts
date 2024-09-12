import { Ini } from "@/Resources";

interface TileSet {
  setName: string;
  filename: string;
  tilesInSet: number;
  allowTiberium: boolean;
}

export class Theater {
  private _tileSets: TileSet[] = [];
  private _aCliffMMPieces: number | null;
	private _aCliffPieces: number | null;
	private _blackTile: number | null;
	private _blueMoldTile: number | null;
	private _bridgeBottomLeft1: number | null;
	private _bridgeBottomLeft2: number | null;
	private _bridgeBottomRight1: number | null;
	private _bridgeBottomRight2: number | null;
	private _bridgeMiddle1: number | null;
	private _bridgeMiddle2: number | null;
	private _bridgeSet: number | null;
	private _bridgeTopLeft1: number | null;
	private _bridgeTopLeft2: number | null;
	private _bridgeTopRight1: number | null;
	private _bridgeTopRight2: number | null;
	private _clearTile: number | null;
	private _clearToBlueMoldLat: number | null;
	private _clearToCrystalLat: number | null;
	private _clearToGreenLat: number | null;
	private _clearToPaveLat: number | null;
	private _clearToRoughLat: number | null;
	private _clearToSandLat: number | null;
	private _cliffRamps: number | null;
	private _cliffSet: number | null;
	private _crystalCliff: number | null;
	private _crystalTile: number | null;
	private _destroyableCliffs: number | null;
	private _dirtRoadCurve: number | null;
	private _dirtRoadJunction: number | null;
	private _dirtRoadSlopes: number | null;
	private _dirtRoadStraight: number | null;
	private _dirtTrackTunnels: number | null;
	private _dirtTunnels: number | null;
	private _greenTile: number | null;
	private _heightBase: number | null;
	private _ice1Set: number | null;
	private _ice2Set: number | null;
	private _ice3Set: number | null;
	private _iceShoreSet: number | null;
	private _mMRampBase: number | null;
	private _mMWaterCliffAPieces: number | null;
	private _medians: number | null;
	private _miscPaveTile: number | null;
	private _monorailSlopes: number | null;
	private _paveTile: number | null;
	private _pavedRoadEnds: number | null;
	private _pavedRoadSlopes: number | null;
	private _pavedRoads: number | null;
	private _rampBase: number | null;
	private _rampSmooth: number | null;
	private _rocks: number | null;
	private _roughGround: number | null;
	private _roughTile: number | null;
	private _sandTile: number | null;
	private _shorePieces: number | null;
	private _slopeSetPieces: number | null;
	private _slopeSetPieces2: number | null;
	private _swampTile: number | null;
	private _trackTunnels: number | null;
	private _trainBridgeSet: number | null;
	private _tunnels: number | null;
	private _waterBridge: number | null;
	private _waterCaves: number | null;
	private _waterCliffAPieces: number | null;
	private _waterCliffs: number | null;
	private _waterSet: number | null;
	private _waterfallEast: number | null;
	private _waterfallNorth: number | null;
	private _waterfallSouth: number | null;
	private _waterfallWest: number | null;
	private _waterToSwampLat: number | null;
	private _woodBridgeSet: number | null;

  public static fromArray(data: Uint8Array): Theater {
    const theater = new Theater();
    const settings = Ini.fromArray(data);

    let i = 0;
    while (settings.sectionExists(`TileSet${i.toString().padStart(4, '0')}`)) {
      const tileset = settings.getSection(`TileSet${i.toString().padStart(4, '0')}`);
      const tileCount = tileset.readInt('TilesInSet');
      i++;
      theater._tileSets.push({
        setName: tileset.readString('SetName'),
        filename: tileset.readString('FileName'),
        tilesInSet: tileCount,
        allowTiberium: tileset.readBool('AllowTiberium'),
      });
    }

    const generalSettings = settings.getSection('General');
    theater._aCliffMMPieces = generalSettings.readInt('ACliffMMPieces');
    theater._aCliffPieces = generalSettings.readInt('ACliffPieces');
    theater._blackTile = generalSettings.readInt('BlackTile');
    theater._blueMoldTile = generalSettings.readInt('BlueMoldTile');
    theater._bridgeBottomLeft1 = generalSettings.readInt('BridgeBottomLeft1');
    theater._bridgeBottomLeft2 = generalSettings.readInt('BridgeBottomLeft2');
    theater._bridgeBottomRight1 = generalSettings.readInt('BridgeBottomRight1');
    theater._bridgeBottomRight2 = generalSettings.readInt('BridgeBottomRight2');
    theater._bridgeMiddle1 = generalSettings.readInt('BridgeMiddle1');
    theater._bridgeMiddle2 = generalSettings.readInt('BridgeMiddle2');
    theater._bridgeSet = generalSettings.readInt('BridgeSet');
    theater._bridgeTopLeft1 = generalSettings.readInt('BridgeTopLeft1');
    theater._bridgeTopLeft2 = generalSettings.readInt('BridgeTopLeft2');
    theater._bridgeTopRight1 = generalSettings.readInt('BridgeTopRight1');
    theater._bridgeTopRight2 = generalSettings.readInt('BridgeTopRight1');
    theater._clearTile = generalSettings.readInt('ClearTile');
    theater._clearToBlueMoldLat = generalSettings.readInt('ClearToBlueMoldLat');
    theater._clearToCrystalLat = generalSettings.readInt('ClearToCrystalLat');
    theater._clearToGreenLat = generalSettings.readInt('ClearToGreenLat');
    theater._clearToPaveLat = generalSettings.readInt('ClearToPaveLat');
    theater._clearToRoughLat = generalSettings.readInt('ClearToRoughLat');
    theater._clearToSandLat = generalSettings.readInt('ClearToSandLat');
    theater._cliffRamps = generalSettings.readInt('CliffRamps');
    theater._cliffSet = generalSettings.readInt('CliffSet');
    theater._crystalCliff = generalSettings.readInt('CrystalCliff');
    theater._crystalTile = generalSettings.readInt('CrystalTile');
    theater._destroyableCliffs = generalSettings.readInt('DestroyableCliffs');
    theater._dirtRoadCurve = generalSettings.readInt('DirtRoadCurve');
    theater._dirtRoadJunction = generalSettings.readInt('DirtRoadJunction');
    theater._dirtRoadSlopes = generalSettings.readInt('DirtRoadSlopes');
    theater._dirtRoadStraight = generalSettings.readInt('DirtRoadStraight');
    theater._dirtTrackTunnels = generalSettings.readInt('DirtTrackTunnels');
    theater._dirtTunnels = generalSettings.readInt('DirtTunnels');
    theater._greenTile = generalSettings.readInt('GreenTile');
    theater._heightBase = generalSettings.readInt('HeightBase');
    theater._ice1Set = generalSettings.readInt('Ice1Set');
    theater._ice2Set = generalSettings.readInt('Ice2Set');
    theater._ice3Set = generalSettings.readInt('Ice3Set');
    theater._iceShoreSet = generalSettings.readInt('IceShoreSet');
    theater._mMRampBase = generalSettings.readInt('MMRampBase');
    theater._mMWaterCliffAPieces = generalSettings.readInt('MMWaterCliffAPieces');
    theater._medians = generalSettings.readInt('Medians');
    theater._miscPaveTile = generalSettings.readInt('MiscPaveTile');
    theater._monorailSlopes = generalSettings.readInt('MonorailSlopes');
    theater._paveTile = generalSettings.readInt('PaveTile');
    theater._pavedRoadEnds = generalSettings.readInt('PavedRoadEnds');
    theater._pavedRoadSlopes = generalSettings.readInt('PavedRoadSlopes');
    theater._pavedRoads = generalSettings.readInt('PavedRoads');
    theater._rampBase = generalSettings.readInt('RampBase');
    theater._rampSmooth = generalSettings.readInt('RampSmooth');
    theater._rocks = generalSettings.readInt('Rocks');
    theater._roughGround = generalSettings.readInt('RoughGround');
    theater._roughTile = generalSettings.readInt('RoughTile');
    theater._sandTile = generalSettings.readInt('SandTile');
    theater._shorePieces = generalSettings.readInt('ShorePieces');
    theater._slopeSetPieces = generalSettings.readInt('SlopeSetPieces');
    theater._slopeSetPieces2 = generalSettings.readInt('SlopeSetPieces2');
    theater._swampTile = generalSettings.readInt('SwampTile');
    theater._trackTunnels = generalSettings.readInt('TrackTunnels');
    theater._trainBridgeSet = generalSettings.readInt('TrainBridgeSet');
    theater._tunnels = generalSettings.readInt('Tunnels');
    theater._waterBridge = generalSettings.readInt('WaterBridge');
    theater._waterCaves = generalSettings.readInt('WaterCaves');
    theater._waterCliffAPieces = generalSettings.readInt('WaterCliffAPieces');
    theater._waterCliffs = generalSettings.readInt('WaterCliffs');
    theater._waterSet = generalSettings.readInt('WaterSet');
    theater._waterfallEast = generalSettings.readInt('WaterfallEast');
    theater._waterfallNorth = generalSettings.readInt('WaterfallNorth');
    theater._waterfallSouth = generalSettings.readInt('WaterfallSouth');
    theater._waterfallWest = generalSettings.readInt('WaterfallWest');
    theater._waterToSwampLat = generalSettings.readInt('WaterToSwampLat');
    theater._woodBridgeSet = generalSettings.readInt('WoodBridgeSet');

    return theater;
  }

  getTileset(setNumber: number): TileSet | null {
    return this._tileSets[setNumber] ?? null;
  }

  isCLAT(setNumber: number): boolean {
    return (
      setNumber === this._clearToRoughLat ||
      setNumber === this._clearToSandLat ||
      setNumber === this._clearToGreenLat ||
      setNumber === this._clearToPaveLat ||
      setNumber === this._clearToBlueMoldLat ||
      setNumber === this._clearToCrystalLat ||
			setNumber === this._waterToSwampLat
    );
  }
  
  isLAT(setNum: number): boolean {
    return (
      setNum === this._roughTile ||
      setNum === this._sandTile ||
      setNum === this._greenTile ||
      setNum === this._paveTile ||
      setNum === this._blueMoldTile ||
      setNum === this._crystalTile ||
      setNum === this._swampTile
    );
  }

  isCrystalLAT(setNum: number) {
    return (setNum == this._crystalTile);
  }

  isCrystalCliff(setNum: number) {
    return (setNum == this._crystalCliff);
  }

  isSwampLAT(setNum: number) {
    return (setNum == this._swampTile);
  }

  getLAT(clatSetNum: number) {
    if (clatSetNum === this._clearToRoughLat)
      return this._roughTile;
    else if (clatSetNum === this._clearToSandLat)
      return this._sandTile;
    else if (clatSetNum === this._clearToGreenLat)
      return this._greenTile;
    else if (clatSetNum === this._clearToPaveLat)
      return this._paveTile;
    else if (clatSetNum === this._clearToBlueMoldLat)
      return this._blueMoldTile;
    else if (clatSetNum === this._clearToCrystalLat)
      return this._crystalTile;
    else if (clatSetNum === this._waterToSwampLat)
      return this._swampTile;
    else
      return -1;
  }

  getCLATSet(setNum: number) {
    if (setNum === this._roughTile)
      return this._clearToRoughLat;
    else if (setNum === this._sandTile)
      return this._clearToSandLat;
    else if (setNum === this._greenTile)
      return this._clearToGreenLat;
    else if (setNum === this._paveTile)
      return this._clearToPaveLat;
    else if (setNum === this._blueMoldTile)
      return this._clearToBlueMoldLat;
    else if (setNum === this._crystalTile)
      return this._clearToCrystalLat;
    else if (setNum === this._swampTile)
      return this._waterToSwampLat;
    else
      return null;
  }

  tilesAreConnected(setNum1: number, setNum2: number) {
    if (setNum1 == setNum2) {
      return false;
    } else if (setNum1 === this._greenTile && setNum2 == this._shorePieces ||
      (setNum2 == this._greenTile && setNum1 == this._shorePieces)) {
      return false;
    } else if (setNum1 == this._greenTile && setNum2 == this._waterBridge ||
      (setNum2 == this._greenTile && setNum1 == this._waterBridge)) {
      return false;
    } else if (setNum1 == this._paveTile && setNum2 == this._pavedRoads ||
      (setNum2 == this._paveTile && setNum1 == this._pavedRoads)) {
      return false;
    } else if (setNum1 == this._paveTile && setNum2 == this._medians ||
      (setNum2 == this._paveTile && setNum1 == this._medians)) {
      return false;
    } else if (setNum1 == this._paveTile && setNum2 == this._miscPaveTile ||
      (setNum2 == this._paveTile && setNum1 == this._miscPaveTile)) {
      return false;
    }

    return true;
  }
}