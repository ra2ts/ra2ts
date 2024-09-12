

export class Infantry extends TechnoType {
  private _notHuman: boolean;
  private _category: InfantryCategory;
  private _primaryWeapon: Weapon;
  private _secondaryWeapon: Weapon;
  private _leadershipRating: number;
  private _c4: boolean;
  private _assaulter: boolean;
  private _tiberiumProof: boolean;
  private _techLevel: number;
  private _pip: string; //change
  private _sight: number;
  private _speed: number;
  private _allowedToStartInMultiplayer: boolean;
  private _cost: number;
  private _soylent: number;
  private _points: number;
  private _fraidycat: boolean;
  private _civilian: boolean;
  private _nominal: boolean;
  private _isSelectableCombatant: boolean;
  private _voiceSelect: Sound[];
  private _voiceMove: Sound[];
  private _voiceAttack: Sound[];
  private _voiceFeedback: Sound[];
  private _voiceSpecialAttack: Sound[];
  private _dieSound: Sound[];
  private _createSound: Sound[];
  private _enterWaterSound: Sound[];
  private _leaveWaterSound: Sound[];
  private _movementZone: MovementZone;
  private _threatPosed: number;
  private _specialThreatValue: number;
  private _immuneToVeins: boolean;
  private _veteranAbilities: InfantryAbility[];
  private _eliteAbilities: InfantryAbility[];
  private _size: number;
  private _detectDisguise: boolean;
  private _elitePrimary: Weapon;
  private _ifvMode: number;
}