import React, { useState, useMemo } from 'react';
import DiceInput from './components/DiceInput.tsx';
import { calculateHeroscapeProbabilities } from './services/calculator.ts';
import { CalculationResult, TacticalModifiers } from './types.ts';

const INITIAL_MODIFIERS: TacticalModifiers = {
  deadlyStrike: false,
  shieldsOfValor: false,
  counterStrike: false,
  orcBattleCryAura: false,
  hasAutoShields: false,
  autoShields: 1,
  oneShieldDefense: false,
  stealthDodge: false,
  chainAxe: false,
  rerollOneDefense: false,
  magneticDeflectorShield: false,
  d20IgnoreWounds: false,
  d20Threshold: 15,
  maul: false,
  lethalSting: false,
  hypnosis: false,
  hasAutoSkulls: false,
  autoSkulls: 1,
  heroicDefenseAura: false,
  paralyzingStare: false,
  paralyzingStareThreshold: 16,
  netTrip: false,
  netTripThreshold: 14,
  poisonWeapons: false,
  poisonWeaponsThreshold: 12,
  venomRay: false,
  giftOfTheEmpressAura: false,
  headbutt: false
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [attackDice, setAttackDice] = useState<number>(3);
  const [defenseDice, setDefenseDice] = useState<number>(3);
  const [modifiers, setModifiers] = useState<TacticalModifiers>(INITIAL_MODIFIERS);
  const [isPowersExpanded, setIsPowersExpanded] = useState<boolean>(false);

  const results: CalculationResult = useMemo(() => {
    return calculateHeroscapeProbabilities(attackDice, defenseDice, modifiers);
  }, [attackDice, defenseDice, modifiers]);

  const toggleModifier = (key: keyof TacticalModifiers) => {
    setModifiers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateNumericModifier = (key: 'autoSkulls' | 'autoShields' | 'd20Threshold' | 'paralyzingStareThreshold' | 'netTripThreshold' | 'poisonWeaponsThreshold', val: number) => {
    setModifiers(prev => ({ ...prev, [key]: val }));
  };

  const d20Options = Array.from({ length: 20 }, (_, i) => i + 1);
  const autoOptions = [1, 2, 3];

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen p-4 md:p-8 flex flex-col items-center transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      <header className="w-full max-w-2xl mb-12 relative flex flex-col items-center">
        <div className="flex flex-col items-center text-center px-8">
          <h1 className={`text-4xl md:text-5xl font-bold tracking-tight mb-1 font-sans transition-colors ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>
            Sterilizing Pear 2
          </h1>
          <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-sm md:text-lg font-semibold tracking-tight transition-colors`}>
            Heroscape Probability Calculator
          </p>
        </div>

        <div className="absolute right-0 top-1">
          <button 
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`p-2 rounded-full transition-all duration-200 border ${
              isDark 
                ? 'bg-slate-900 border-slate-700 text-yellow-400 hover:bg-slate-800' 
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 16.243l.707.707M7.757 7.757l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 flex flex-col gap-8">
          <section className={`flex flex-col gap-6 p-6 rounded-2xl border backdrop-blur-md transition-all ${
            isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-xl font-semibold tracking-tight mb-2 border-b pb-2 flex items-center gap-2 ${
              isDark ? 'text-slate-100 border-slate-800' : 'text-slate-900 border-slate-100'
            }`}>
              <svg className={`w-5 h-5 ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <rect x="3" y="9" width="9" height="9" rx="1.5" />
                <rect x="11" y="5" width="9" height="9" rx="1.5" />
              </svg>
              Dice
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <DiceInput 
                label="Attack" 
                value={attackDice} 
                onChange={setAttackDice} 
                max={12} 
                color="red" 
                theme={theme}
              />
              <DiceInput 
                label="Defense" 
                value={defenseDice} 
                onChange={setDefenseDice} 
                max={12} 
                color="blue" 
                theme={theme}
              />
            </div>
          </section>

          <section className={`flex flex-col p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 ${
            isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <button 
              onClick={() => setIsPowersExpanded(!isPowersExpanded)}
              className="w-full flex items-center justify-between group"
            >
              <h2 className={`text-xl font-semibold tracking-tight border-b border-transparent transition-colors flex items-center gap-2 ${
                isDark ? 'text-slate-100 group-hover:text-emerald-400' : 'text-slate-900 group-hover:text-emerald-600'
              }`}>
                <svg className={`w-5 h-5 ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Special Powers
              </h2>
              <div className={`transform transition-transform duration-300 ${isPowersExpanded ? 'rotate-180' : ''}`}>
                <svg className={`w-5 h-5 transition-colors ${
                  isDark ? 'text-slate-500 group-hover:text-emerald-500' : 'text-slate-400 group-hover:text-emerald-600'
                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden transition-all duration-500 ease-in-out ${isPowersExpanded ? 'max-h-[1400px] mt-6 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="space-y-3">
                <span className={`text-[11px] font-bold uppercase tracking-tight block mb-2 ${isDark ? 'text-red-400' : 'text-red-800'}`}>Attacker</span>
                <div className="space-y-4">
                  {[
                    { key: 'deadlyStrike', label: 'Deadly Strike' },
                    { key: 'chainAxe', label: 'Reroll 1 Attack' },
                    { key: 'orcBattleCryAura', label: 'Orc Battle Cry' },
                    { key: 'hypnosis', label: 'Hypnosis' },
                    { key: 'headbutt', label: 'Headbutt', color: 'emerald' },
                  ].map(power => (
                    <label key={power.key} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={modifiers[power.key as keyof TacticalModifiers] as boolean}
                          onChange={() => toggleModifier(power.key as keyof TacticalModifiers)}
                        />
                        <div className={`w-10 h-6 rounded-full transition-colors ${
                          isDark 
                            ? (power.color === 'emerald' ? 'bg-slate-800 peer-checked:bg-emerald-600' : 'bg-slate-800 peer-checked:bg-red-600') 
                            : (power.color === 'emerald' ? 'bg-slate-200 peer-checked:bg-emerald-600' : 'bg-slate-200 peer-checked:bg-red-800')
                        }`}></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition-transform"></div>
                      </div>
                      <span className={`text-xs font-medium transition-colors ${isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>{power.label}</span>
                    </label>
                  ))}

                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={modifiers.hasAutoSkulls}
                          onChange={() => toggleModifier('hasAutoSkulls')}
                        />
                        <div className={`w-10 h-6 rounded-full transition-colors ${isDark ? 'bg-slate-800 peer-checked:bg-red-600' : 'bg-slate-200 peer-checked:bg-red-800'}`}></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition-transform"></div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-medium transition-colors ${isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>Automatic Skull</span>
                        {modifiers.hasAutoSkulls && (
                          <div className="flex items-center gap-1 ml-1" onClick={(e) => e.stopPropagation()}>
                            <select 
                              value={modifiers.autoSkulls}
                              onChange={(e) => updateNumericModifier('autoSkulls', parseInt(e.target.value))}
                              className={`text-[10px] font-bold border rounded px-1 py-0.5 focus:outline-none min-w-[3rem] ${
                                isDark ? 'bg-slate-800 text-red-400 border-slate-700 focus:border-red-500' : 'bg-slate-50 text-red-800 border-slate-200 focus:border-red-800'
                              }`}
                            >
                              {autoOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>

                  {[
                    { key: 'paralyzingStare', thresholdKey: 'paralyzingStareThreshold', label: 'Paralyzing Stare / Whip' },
                    { key: 'netTrip', thresholdKey: 'netTripThreshold', label: 'Net Trip' },
                    { key: 'poisonWeapons', thresholdKey: 'poisonWeaponsThreshold', label: 'Poison Weapons' }
                  ].map(power => (
                    <div key={power.key} className="flex flex-col gap-2">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={modifiers[power.key as keyof TacticalModifiers] as boolean}
                            onChange={() => toggleModifier(power.key as keyof TacticalModifiers)}
                          />
                          <div className={`w-10 h-6 rounded-full transition-colors ${isDark ? 'bg-slate-800 peer-checked:bg-red-600' : 'bg-slate-200 peer-checked:bg-red-800'}`}></div>
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition-transform"></div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-medium transition-colors ${isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>{power.label}</span>
                          {modifiers[power.key as keyof TacticalModifiers] && (
                            <div className="flex items-center gap-1 ml-1" onClick={(e) => e.stopPropagation()}>
                               <span className={`text-[10px] font-bold uppercase tracking-tight ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>On</span>
                               <select 
                                 value={modifiers[power.thresholdKey as keyof TacticalModifiers] as number}
                                 onChange={(e) => updateNumericModifier(power.thresholdKey as any, parseInt(e.target.value))}
                                 className={`text-[10px] font-bold border rounded px-1 py-0.5 focus:outline-none min-w-[3rem] ${
                                   isDark ? 'bg-slate-800 text-red-400 border-slate-700 focus:border-red-500' : 'bg-slate-50 text-red-800 border-slate-200 focus:border-red-800'
                                 }`}
                               >
                                 {d20Options.map(opt => (
                                   <option key={opt} value={opt}>{opt}+</option>
                                 ))}
                               </select>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  ))}

                  {[
                    { key: 'maul', label: 'Maul / Venomous Sting' },
                    { key: 'lethalSting', label: 'All As One / Lethal Sting' },
                    { key: 'venomRay', label: 'Venom Ray / Poison Sting' }
                  ].map(power => (
                    <label key={power.key} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={modifiers[power.key as keyof TacticalModifiers] as boolean}
                          onChange={() => toggleModifier(power.key as keyof TacticalModifiers)}
                        />
                        <div className={`w-10 h-6 rounded-full transition-colors ${isDark ? 'bg-slate-800 peer-checked:bg-red-600' : 'bg-slate-200 peer-checked:bg-red-800'}`}></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition-transform"></div>
                      </div>
                      <span className={`text-xs font-medium transition-colors ${isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>{power.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <span className={`text-[11px] font-bold uppercase tracking-tight block mb-2 ${isDark ? 'text-blue-400' : 'text-blue-800'}`}>Defender</span>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={modifiers.counterStrike}
                        onChange={() => toggleModifier('counterStrike')}
                      />
                      <div className={`w-10 h-6 rounded-full transition-colors ${isDark ? 'bg-slate-800 peer-checked:bg-orange-600' : 'bg-slate-200 peer-checked:bg-amber-600'}`}></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition-transform"></div>
                    </div>
                    <span className={`text-xs font-medium transition-colors ${isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>Counter Strike</span>
                  </label>

                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={modifiers.d20IgnoreWounds}
                          onChange={() => toggleModifier('d20IgnoreWounds')}
                        />
                        <div className={`w-10 h-6 rounded-full transition-colors ${isDark ? 'bg-slate-800 peer-checked:bg-blue-600' : 'bg-slate-200 peer-checked:bg-blue-800'}`}></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition-transform"></div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-medium transition-colors ${isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>D20 Ignore Wounds</span>
                        {modifiers.d20IgnoreWounds && (
                          <div className="flex items-center gap-1 ml-1" onClick={(e) => e.stopPropagation()}>
                             <span className={`text-[10px] font-bold uppercase tracking-tight ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>On</span>
                             <select 
                               value={modifiers.d20Threshold}
                               onChange={(e) => updateNumericModifier('d20Threshold', parseInt(e.target.value))}
                               className={`text-[10px] font-bold border rounded px-1 py-0.5 focus:outline-none min-w-[3rem] ${
                                 isDark ? 'bg-slate-800 text-blue-400 border-slate-700 focus:border-blue-500' : 'bg-slate-50 text-blue-800 border-slate-200 focus:border-blue-800'
                               }`}
                             >
                               {d20Options.map(opt => (
                                 <option key={opt} value={opt}>{opt}+</option>
                               ))}
                             </select>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>

                  {[
                    { key: 'stealthDodge', label: 'Stealth Dodge / Defensive Agility' },
                    { key: 'shieldsOfValor', label: 'Shields of Valor' },
                    { key: 'oneShieldDefense', label: 'One Shield Defense' },
                    { key: 'rerollOneDefense', label: 'Reroll 1 Defense' },
                  ].map(power => (
                    <label key={power.key} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={modifiers[power.key as keyof TacticalModifiers] as boolean}
                          onChange={() => toggleModifier(power.key as keyof TacticalModifiers)}
                        />
                        <div className={`w-10 h-6 rounded-full transition-colors ${isDark ? 'bg-slate-800 peer-checked:bg-blue-600' : 'bg-slate-200 peer-checked:bg-blue-800'}`}></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition-transform"></div>
                      </div>
                      <span className={`text-xs font-medium transition-colors ${isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>{power.label}</span>
                    </label>
                  ))}

                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={modifiers.hasAutoShields}
                          onChange={() => toggleModifier('hasAutoShields')}
                        />
                        <div className={`w-10 h-6 rounded-full transition-colors ${isDark ? 'bg-slate-800 peer-checked:bg-blue-600' : 'bg-slate-200 peer-checked:bg-blue-800'}`}></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition-transform"></div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-medium transition-colors ${isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>Automatic Shield</span>
                        {modifiers.hasAutoShields && (
                          <div className="flex items-center gap-1 ml-1" onClick={(e) => e.stopPropagation()}>
                            <select 
                              value={modifiers.autoShields}
                              onChange={(e) => updateNumericModifier('autoShields', parseInt(e.target.value))}
                              className={`text-[10px] font-bold border rounded px-1 py-0.5 focus:outline-none min-w-[3rem] ${
                                isDark ? 'bg-slate-800 text-blue-400 border-slate-700 focus:border-blue-500' : 'bg-slate-50 text-blue-800 border-slate-200 focus:border-blue-800'
                              }`}
                            >
                              {autoOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>

                  {[
                    { key: 'heroicDefenseAura', label: 'Heroic Defense Aura' },
                    { key: 'giftOfTheEmpressAura', label: 'Gift of the Empress Aura' },
                    { key: 'magneticDeflectorShield', label: 'Magnetic Deflector Shield' }
                  ].map(power => (
                    <label key={power.key} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={modifiers[power.key as keyof TacticalModifiers] as boolean}
                          onChange={() => toggleModifier(power.key as keyof TacticalModifiers)}
                        />
                        <div className={`w-10 h-6 rounded-full transition-colors ${isDark ? 'bg-slate-800 peer-checked:bg-blue-600' : 'bg-slate-200 peer-checked:bg-blue-800'}`}></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition-transform"></div>
                      </div>
                      <span className={`text-xs font-medium transition-colors ${isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>{power.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <section className="grid grid-cols-2 gap-4">
            <div className={`p-6 rounded-2xl border backdrop-blur-md flex flex-col items-center text-center transition-all ${
              isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <span className={`text-xs font-semibold tracking-tight mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Wound Chance</span>
              <span className={`text-3xl font-bold tabular-nums tracking-tight transition-colors ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>
                {(results.hitChance * 100).toFixed(1)}%
              </span>
            </div>
            <div className={`p-6 rounded-2xl border backdrop-blur-md flex flex-col items-center text-center transition-all ${
              isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <span className={`text-xs font-semibold tracking-tight mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Expected Wounds</span>
              <span className={`text-3xl font-bold tabular-nums tracking-tight transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {results.expectedDamage.toFixed(2)}
              </span>
            </div>
          </section>

          <section className={`flex flex-col p-6 rounded-2xl border backdrop-blur-md transition-all ${
            isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-xl font-semibold tracking-tight mb-6 border-b pb-2 flex items-center gap-2 ${
              isDark ? 'text-slate-100 border-slate-800' : 'text-slate-900 border-slate-100'
            }`}>
              <svg className={`w-5 h-5 ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Wound Distribution
            </h2>
            
            <div className={`overflow-hidden rounded-xl border transition-all ${
              isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50'
            }`}>
              <table className="w-full text-left text-sm">
                <thead className={`text-[11px] font-semibold tracking-tight ${
                  isDark ? 'bg-slate-800/30 text-slate-500' : 'bg-slate-100 text-slate-500'
                }`}>
                  <tr>
                    <th className="px-4 py-4 border-b border-slate-800">Outcome</th>
                    <th className={`px-4 py-4 border-b border-slate-800 font-bold ${isDark ? 'text-emerald-400/80' : 'text-emerald-600'}`}>P(≥X)</th>
                    <th className="px-4 py-4 border-b border-slate-800">P(=X)</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-200'}`}>
                  {results.outcomes.filter(o => o.damage > 0 || o.isDestroyed).map((o, idx) => (
                    <tr key={`def-${idx}`} className={`transition-colors ${
                      isDark ? 'hover:bg-slate-800/20' : 'hover:bg-white bg-white/40'
                    }`}>
                      <td className="px-4 py-4 font-mono font-bold">
                        {o.isDestroyed ? (
                          <span className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'} font-bold uppercase text-[10px] tracking-widest`}>DESTROYED</span>
                        ) : (
                          <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{o.damage} {o.damage === 1 ? 'Wound' : 'Wounds'}</span>
                        )}
                      </td>
                      <td className={`px-4 py-4 font-bold tabular-nums text-xs ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>{(o.cumulativeProb * 100).toFixed(1)}%</td>
                      <td className={`px-4 py-4 tabular-nums font-medium text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{(o.probability * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                  
                  {modifiers.headbutt && (
                    <>
                      <tr className={isDark ? 'bg-slate-800/20' : 'bg-slate-100/40'}>
                        <td colSpan={3} className={`px-4 py-2 text-xs font-semibold tracking-tight border-t ${
                          isDark ? 'text-emerald-400 border-slate-800' : 'text-emerald-800 border-slate-100'
                        }`}>
                          Headbutt
                        </td>
                      </tr>
                      <tr>
                         <td colSpan={3} className={`px-4 pb-4 ${isDark ? 'bg-slate-900/5' : 'bg-slate-50/30'}`}>
                            <div className="grid grid-cols-2 gap-3 mt-2">
                                <div className={`p-3 rounded-xl border flex flex-col items-center text-center ${
                                  isDark ? 'bg-emerald-900/10 border-emerald-900/20' : 'bg-emerald-50/50 border-emerald-100 shadow-sm shadow-emerald-900/5'
                                }`}>
                                  <span className={`text-[10px] font-semibold tracking-tight mb-1 ${isDark ? 'text-emerald-400/80' : 'text-slate-500'}`}>Shared Wound Chance</span>
                                  <span className={`text-xl font-bold tabular-nums ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>
                                    {(results.headbuttChance * 100).toFixed(1)}%
                                  </span>
                                </div>
                                <div className="opacity-0 pointer-events-none"></div>
                            </div>
                         </td>
                      </tr>
                    </>
                  )}

                  {modifiers.counterStrike && (
                    <>
                      <tr className={isDark ? 'bg-orange-950/20' : 'bg-amber-50'}>
                        <td colSpan={3} className={`px-4 py-2 text-xs font-semibold tracking-tight border-t ${
                          isDark ? 'text-orange-500 border-slate-800' : 'text-amber-800 border-slate-100'
                        }`}>
                          Counter Strike
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3} className={`px-4 pb-4 ${isDark ? 'bg-orange-950/5' : 'bg-amber-50/30'}`}>
                          <div className="grid grid-cols-2 gap-3 mt-2">
                            <div className={`p-3 rounded-xl border flex flex-col items-center text-center ${
                              isDark ? 'bg-orange-900/20 border-orange-900/30' : 'bg-amber-50 border-amber-200 shadow-sm shadow-amber-900/5'
                            }`}>
                              <span className={`text-[10px] font-semibold tracking-tight mb-1 ${isDark ? 'text-orange-400/80' : 'text-slate-500'}`}>Wound Chance</span>
                              <span className={`text-xl font-bold tabular-nums ${isDark ? 'text-orange-500' : 'text-amber-600'}`}>
                                {(results.counterChance * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className={`p-3 rounded-xl border flex flex-col items-center text-center ${
                              isDark ? 'bg-orange-900/20 border-orange-900/30' : 'bg-amber-50 border-amber-200 shadow-sm shadow-amber-900/5'
                            }`}>
                              <span className={`text-[10px] font-semibold tracking-tight mb-1 ${isDark ? 'text-orange-400/80' : 'text-slate-500'}`}>Expected Wounds</span>
                              <span className={`text-xl font-bold tabular-nums ${isDark ? 'text-orange-200' : 'text-slate-900'}`}>
                                {results.expectedCounterDamage.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                      {results.counterOutcomes.filter(o => o.damage > 0).map((o, idx) => (
                        <tr key={`atk-${idx}`} className={`transition-colors ${
                          isDark ? 'hover:bg-orange-900/10 bg-orange-950/5' : 'hover:bg-amber-50 bg-white'
                        }`}>
                          <td className={`px-4 py-4 font-mono font-bold text-xs ${isDark ? 'text-orange-200' : 'text-amber-900'}`}>
                            {o.damage} {o.damage === 1 ? 'Wound' : 'Wounds'}
                          </td>
                          <td className={`px-4 py-4 font-bold tabular-nums text-xs ${isDark ? 'text-orange-500' : 'text-amber-600'}`}>{(o.cumulativeProb * 100).toFixed(1)}%</td>
                          <td className={`px-4 py-4 tabular-nums font-medium text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{(o.probability * 100).toFixed(1)}%</td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      <footer className={`mt-auto pt-16 pb-8 text-[10px] font-semibold tracking-tight text-center transition-colors ${
        isDark ? 'text-slate-700' : 'text-slate-400'
      }`}>
        Vibecoded by vegietarian18. Open beta test.
      </footer>
    </div>
  );
};

export default App;