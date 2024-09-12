import { ObjectType} from '@/Engine/GameObjects/ObjectType';
import { ObjectTypeManager } from '@/Engine/GameObjects/ObjectTypeManager';
import { LandTargeting } from '@/Engine/GameObjects/LandTargeting';
import { NavalTargeting } from '@/Engine/GameObjects/NavalTargeting';
import { SpeedCategory } from '@/Engine/GameObjects/SpeedCategory';
import { Weapon } from '@/Engine/GameObjects/Weapon';
import { Country } from '@/Engine/GameObjects/Country';
import { IniSection } from '@/Resources/IniSection';

export class Techno extends ObjectType {
  private _landTargeting: LandTargeting;
  private _navalTargeting: NavalTargeting;
  private _speedType: SpeedCategory;
  private _canBeHidden: boolean;
  private _typeImmune: boolean;
  private _walkRate: number;
  private _moveRate: number;
  private _moveToShroud: boolean;
  private _isTrain: boolean;
  private _doubleOwned: boolean;
  private _guardRange: number;
  private _explodes: boolean;
  private _deathWeapon: Weapon | null;
  private _deathWeaponDamageModifier: number | null;
  private _flightLevel: number;
  private _isDropShip: boolean;
  private _pitchAngle: number;
  private _rollAngle: number;
  private _pitchSpeed: number;
  private _locomotor: string;//{4A582744-9839-11d1-B709-00A024DDAFD1}
  private _cloakingSpeed: number;
  private _threatAvoidanceCoeffecient: number;
  private _slowdownDistance: number;
  private _deaccelerationFactor: number;
  private _accelerationFactor: number;
  private _weight: number;
  private _physicalSize: number;
  private _owner: Country[];

  constructor(ini: IniSection, otm: ObjectTypeManager) {
    super(ini, otm);

    this._landTargeting = ini.readEnum('LandTargeting', LandTargeting, LandTargeting.No);
    this._navalTargeting = ini.readEnum('NavalTargeting', NavalTargeting, NavalTargeting.AllNaval);
    this._speedType = ini.readEnum('SpeedType', SpeedCategory, SpeedCategory.Amphibious);
    this._canBeHidden = ini.readBool('CanBeHidden', );
    this._typeImmune = ini.readBool('TypeImmune');
    this._walkRate = ini.readFloat('WalkRate');
    this._moveRate = ini.readFloat('MoveRate');
    this._moveToShroud = ini.readBool('MoveToShroud');
    this._isTrain = ini.readBool('IsTrain');
    this._doubleOwned = ini.readBool('DoubleOwned');
    this._guardRange = ini.readFloat('GuardRange');
    this._explodes = ini.readBool('Explodes');
    this._deathWeapon = otm.get(Weapon, ini.readString('DeathWeapon'));
    this._deathWeaponDamageModifier = 0;
    this._flightLevel = ini.readInt('FlightLevel', -1);
    this._isDropShip = ini.readBool('IsDropShop');
    this._pitchAngle = ini.readFloat('PitchAngle', 0.349066);
    this._rollAngle = ini.readFloat('RollAngle', 0.523599);
    this._pitchSpeed = ini.readFloat('PitchSpeed', 0.25);
    this._locomotor = ini.readString('Locomotor');
    this._cloakingSpeed = ini.readInt('CloakingSpeed', 7);
    this._threatAvoidanceCoeffecient = ini.readFloat('ThreadAvoidanceCoeffecient', 0);
    this._slowdownDistance = ini.readInt('SlowdownDistance');
    this._deaccelerationFactor = ini.readFloat('DeaccelerationFactor', 0.0);
    this._accelerationFactor = ini.readFloat('DeaccelerationFactor', 0.0);
    this._weight = ini.readInt('Weight', 1);
    this._physicalSize = ini.readInt('PhysicalSize', 1);
    this._owner = [];
  }
}