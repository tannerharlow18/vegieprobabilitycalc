import { CalculationResult, DamageOutcome, TacticalModifiers } from '../types.ts';

/**
 * Computes binomial coefficient (n choose k)
 */
function combinations(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  if (k > n / 2) k = n - k;
  
  let res = 1;
  for (let i = 1; i <= k; i++) {
    res = (res * (n - i + 1)) / i;
  }
  return res;
}

/**
 * Computes probability of getting exactly k successes in n trials
 */
function binomialProb(n: number, k: number, p: number): number {
  return combinations(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

export const calculateHeroscapeProbabilities = (
  attackDice: number,
  defenseDice: number,
  modifiers: TacticalModifiers
): CalculationResult => {
  // Constants for Heroscape dice
  const P_SKULL = modifiers.orcBattleCryAura ? (2/3) : 0.5;
  const P_SHIELD_BASE = modifiers.heroicDefenseAura ? 0.5 : (1/3);

  // Gift of the Empress Aura: Reroll all defense dice that did not show shields
  const P_SHIELD = modifiers.giftOfTheEmpressAura 
    ? (P_SHIELD_BASE + (1 - P_SHIELD_BASE) * P_SHIELD_BASE) 
    : P_SHIELD_BASE;

  let skullProbs: number[] = [];
  for (let k = 0; k <= attackDice; k++) {
    skullProbs[k] = binomialProb(attackDice, k, P_SKULL);
  }

  // Reroll 1 Attack (Chain Axe logic): Reroll 1 non-skull die
  if (modifiers.chainAxe && attackDice > 0) {
    const newSkullProbs = new Array(attackDice + 1).fill(0);
    for (let k = 0; k <= attackDice; k++) {
      const p_k = skullProbs[k];
      if (k < attackDice) {
        newSkullProbs[k + 1] += p_k * P_SKULL;
        newSkullProbs[k] += p_k * (1 - P_SKULL);
      } else {
        newSkullProbs[k] += p_k;
      }
    }
    skullProbs = newSkullProbs;
  }

  const skullMultiplier = modifiers.deadlyStrike ? 2 : 1;
  const shieldMultiplier = modifiers.shieldsOfValor ? 2 : 1;
  const autoShields = modifiers.hasAutoShields ? modifiers.autoShields : 0;
  const attackerAutoSkulls = modifiers.hasAutoSkulls ? modifiers.autoSkulls : 0;
  
  const damageDistribution: Map<number, number> = new Map();
  const counterDistribution: Map<number, number> = new Map();
  let destroyedProbability = 0;
  let headbuttChance = 0;
  
  // D20 Ignore logic parameters
  const d20FailChance = modifiers.d20IgnoreWounds 
    ? (modifiers.d20Threshold - 1) / 20 
    : 1.0;
  const d20PassChance = 1.0 - d20FailChance;

  // Paralyzing Stare logic parameters
  const stareSuccessProb = modifiers.paralyzingStare 
    ? (21 - modifiers.paralyzingStareThreshold) / 20
    : 0;
  
  // Net Trip logic parameters
  const netTripSuccessProb = modifiers.netTrip
    ? (21 - modifiers.netTripThreshold) / 20
    : 0;

  // Poison Weapons logic parameters
  const poisonSuccessProb = modifiers.poisonWeapons
    ? (21 - modifiers.poisonWeaponsThreshold) / 20
    : 0;

  const DISPLAY_MAX_WOUNDS = 12;

  for (let s = 0; s <= attackDice; s++) {
    const skullProb = skullProbs[s];
    
    // Lethal Sting check: If attacker rolls all natural skulls
    if (modifiers.lethalSting && s === attackDice && attackDice > 0) {
      destroyedProbability += skullProb;
      continue; // Skip normal defense resolution for this branch
    }

    // Determine effective defense dice for the FAIL branch (Hypnosis might apply)
    const normalDefenseDice = modifiers.hypnosis 
      ? Math.max(0, defenseDice - s) 
      : defenseDice;

    const scenarioStareSucceeds = { prob: stareSuccessProb, dice: 0, isDebuff: true };
    const scenarioNetTripSucceeds = { 
      prob: (1 - stareSuccessProb) * netTripSuccessProb, 
      dice: 1, 
      isDebuff: true 
    };
    const scenarioBothFail = { 
      prob: (1 - stareSuccessProb) * (1 - netTripSuccessProb),
      dice: normalDefenseDice, 
      isDebuff: false 
    };

    const defenseScenarios = [
      scenarioStareSucceeds,
      scenarioNetTripSucceeds,
      scenarioBothFail
    ].filter(scen => scen.prob > 0);

    for (const scenario of defenseScenarios) {
      const currentProbMultiplier = skullProb * scenario.prob;
      const effectiveDice = scenario.dice;

      let shieldProbs: number[] = [];
      for (let j = 0; j <= effectiveDice; j++) {
        shieldProbs[j] = binomialProb(effectiveDice, j, P_SHIELD);
      }

      // Reroll 1 Defense logic: Reroll 1 non-shield die
      if (modifiers.rerollOneDefense && effectiveDice > 0) {
        const newShieldProbs = new Array(effectiveDice + 1).fill(0);
        for (let k = 0; k <= effectiveDice; k++) {
          const p_k = shieldProbs[k];
          if (k < effectiveDice) {
            newShieldProbs[k + 1] += p_k * P_SHIELD;
            newShieldProbs[k] += p_k * (1 - P_SHIELD);
          } else {
            newShieldProbs[k] += p_k;
          }
        }
        shieldProbs = newShieldProbs;
      }

      for (let d = 0; d <= effectiveDice; d++) {
        const skulls = (s * skullMultiplier) + attackerAutoSkulls;
        
        let modifiedD = d;
        // Magnetic Deflector Shield: Turn one die that did not roll a shield into a shield
        if (modifiers.magneticDeflectorShield && d < effectiveDice) {
          modifiedD = d + 1;
        }

        let shields = (modifiedD * shieldMultiplier) + autoShields;
        
        if (scenario.isDebuff) {
          shields = (modifiedD * shieldMultiplier); 
          if (scenario.dice === 0) shields = 0;
        }

        const prob = currentProbMultiplier * shieldProbs[d];

        if (modifiers.maul && s === attackDice && attackDice > 0) {
          shields = 0;
        }

        // Damage calculation
        let baseDamage = Math.max(0, skulls - shields);
        
        // Headbutt check: If skulls exactly equal shields
        const headbuttTriggers = modifiers.headbutt && skulls === shields;
        
        if (headbuttTriggers) {
          headbuttChance += prob;
          // Per user request: DO NOT add headbutt damage to traditional Wound Distribution table
          baseDamage = 0; 
        }
        
        // Stealth Dodge: One shield blocks all damage
        if (modifiers.stealthDodge && shields >= 1 && !headbuttTriggers) {
          baseDamage = 0;
        }
        
        if (baseDamage > 0) {
          const osdTriggered = modifiers.oneShieldDefense && shields >= 1;
          
          const damageScenarios = [];
          if (osdTriggered) {
            damageScenarios.push({ val: 1, p: 1.0 });
          } else if (poisonSuccessProb > 0) {
            damageScenarios.push({ val: baseDamage + 1, p: poisonSuccessProb });
            damageScenarios.push({ val: baseDamage, p: 1 - poisonSuccessProb });
          } else {
            damageScenarios.push({ val: baseDamage, p: 1.0 });
          }

          for (const ds of damageScenarios) {
            const finalBranchProb = prob * ds.p;
            
            // Branch where wounds are IGNORED
            damageDistribution.set(0, (damageDistribution.get(0) || 0) + (finalBranchProb * d20PassChance));
            
            // Branch where wounds are NOT ignored
            const woundInflictedProb = finalBranchProb * d20FailChance;

            if (modifiers.venomRay && ds.val > 0) {
              // Venom Ray recursion
              let currentP = woundInflictedProb;
              let currentWounds = ds.val;
              for (let i = 0; i < 64; i++) {
                const pStop = currentP * 0.45;    
                const pDestroy = currentP * 0.05; 
                const pContinue = currentP * 0.5; 
                const targetWounds = Math.min(DISPLAY_MAX_WOUNDS, currentWounds);
                damageDistribution.set(targetWounds, (damageDistribution.get(targetWounds) || 0) + pStop);
                destroyedProbability += pDestroy;
                currentP = pContinue;
                if (!osdTriggered) currentWounds += 1;
                if (currentP < 1e-15) break; 
              }
              if (currentP > 0) {
                const targetWounds = Math.min(DISPLAY_MAX_WOUNDS, currentWounds);
                damageDistribution.set(targetWounds, (damageDistribution.get(targetWounds) || 0) + currentP);
              }
            } else {
              const targetWounds = Math.min(DISPLAY_MAX_WOUNDS, ds.val);
              damageDistribution.set(targetWounds, (damageDistribution.get(targetWounds) || 0) + woundInflictedProb);
            }
          }
        } else {
          damageDistribution.set(0, (damageDistribution.get(0) || 0) + prob);
        }

        // Damage to Attacker
        if (headbuttTriggers) {
          // Per user request: Headbutt wounds are only communicated via the special summary box,
          // not the traditional counter-strike distribution or hit chance tables.
          counterDistribution.set(0, (counterDistribution.get(0) || 0) + prob);
        } else if (modifiers.counterStrike && shields > skulls) {
          const counterDamage = shields - skulls;
          counterDistribution.set(counterDamage, (counterDistribution.get(counterDamage) || 0) + prob);
        } else {
          counterDistribution.set(0, (counterDistribution.get(0) || 0) + prob);
        }
      }
    }
  }

  const processDistribution = (dist: Map<number, number>, destProb: number = 0, isDefenderResult: boolean = false) => {
    const sorted = Array.from(dist.keys()).sort((a, b) => a - b);
    let expected = 0;
    let chance = destProb;
    const outcomes: DamageOutcome[] = [];
    const maxWoundsPossible = isDefenderResult ? DISPLAY_MAX_WOUNDS : Math.max(...sorted, 0);

    sorted.forEach(val => {
      const p = dist.get(val) || 0;
      expected += val * p;
      if (val > 0) chance += p;
    });
    expected += maxWoundsPossible * destProb;

    for (let i = 0; i < sorted.length; i++) {
      const val = sorted[i];
      let cumulative = destProb;
      for (let j = i; j < sorted.length; j++) {
        cumulative += dist.get(sorted[j]) || 0;
      }
      outcomes.push({ damage: val, probability: dist.get(val) || 0, cumulativeProb: cumulative });
    }

    if (destProb > 0) {
      outcomes.push({ 
        damage: maxWoundsPossible, 
        probability: destProb, 
        cumulativeProb: destProb, 
        isDestroyed: true 
      });
    }

    return { outcomes, expected, chance };
  };

  const defenderStats = processDistribution(damageDistribution, destroyedProbability, true);
  const attackerStats = processDistribution(counterDistribution);

  return {
    outcomes: defenderStats.outcomes,
    counterOutcomes: attackerStats.outcomes,
    expectedDamage: defenderStats.expected,
    expectedCounterDamage: attackerStats.expected,
    hitChance: defenderStats.chance,
    counterChance: attackerStats.chance,
    headbuttChance: headbuttChance
  };
};