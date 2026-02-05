export interface DamageOutcome {
  damage: number;
  probability: number;
  cumulativeProb: number; // Probability of dealing at least this much damage
  isDestroyed?: boolean;  // Flag for instant destruction effects
}

export interface TacticalModifiers {
  deadlyStrike: boolean;
  shieldsOfValor: boolean;
  counterStrike: boolean;
  orcBattleCryAura: boolean;
  hasAutoShields: boolean;
  autoShields: number;
  oneShieldDefense: boolean;
  stealthDodge: boolean;
  chainAxe: boolean;
  rerollOneDefense: boolean;
  magneticDeflectorShield: boolean;
  d20IgnoreWounds: boolean;
  d20Threshold: number;
  maul: boolean;
  lethalSting: boolean;
  hypnosis: boolean;
  hasAutoSkulls: boolean;
  autoSkulls: number;
  heroicDefenseAura: boolean;
  paralyzingStare: boolean;
  paralyzingStareThreshold: number;
  netTrip: boolean;
  netTripThreshold: number;
  poisonWeapons: boolean;
  poisonWeaponsThreshold: number;
  venomRay: boolean;
  giftOfTheEmpressAura: boolean;
  headbutt: boolean;
}

export interface CalculationResult {
  outcomes: DamageOutcome[];
  counterOutcomes: DamageOutcome[];
  expectedDamage: number;
  expectedCounterDamage: number;
  hitChance: number; // Probability of dealing > 0 damage to defender
  counterChance: number; // Probability of attacker taking > 0 damage
  headbuttChance: number; // Probability of Headbutt triggering
}