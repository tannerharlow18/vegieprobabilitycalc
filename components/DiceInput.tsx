import React from 'react';

interface DiceInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  max: number;
  color: 'red' | 'blue';
  theme: 'dark' | 'light';
}

const DiceInput: React.FC<DiceInputProps> = ({ label, value, onChange, max, color, theme }) => {
  const options = Array.from({ length: max + 1 }, (_, i) => i);
  const isAttack = color === 'red';
  const isDark = theme === 'dark';

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    if (value > 0) onChange(value - 1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    if (value < max) onChange(value + 1);
  };

  const buttonBaseClass = `flex items-center justify-center w-7 h-7 border-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2`;
  
  const themeClasses = isDark 
    ? {
        btn: `bg-slate-800 border-${isAttack ? 'red-900/40' : 'blue-900/40'} text-${isAttack ? 'red-400' : 'blue-400'} hover:border-${isAttack ? 'red-500' : 'blue-500'} hover:bg-${isAttack ? 'red-500/10' : 'blue-500/10'} focus:ring-${isAttack ? 'red-500' : 'blue-500'}/20`,
        select: `${isAttack ? 'bg-red-950/20 border-red-900/40' : 'bg-blue-950/20 border-blue-900/40'} hover:border-${isAttack ? 'red-500' : 'blue-500'} text-white focus:ring-${isAttack ? 'red-500' : 'blue-500'}/20`,
        disabled: `opacity-20 cursor-not-allowed`
      }
    : {
        btn: `bg-${isAttack ? 'red-50' : 'blue-50'} border-${isAttack ? 'red-200' : 'blue-200'} text-${isAttack ? 'red-700' : 'blue-700'} hover:border-${isAttack ? 'red-800' : 'blue-800'} hover:bg-${isAttack ? 'red-100' : 'blue-100'} focus:ring-${isAttack ? 'red-800' : 'blue-800'}/10`,
        select: `${isAttack ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'} hover:border-${isAttack ? 'red-800' : 'blue-800'} text-slate-900 focus:ring-${isAttack ? 'red-800' : 'blue-800'}/10`,
        disabled: `opacity-30 cursor-not-allowed`
      };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className={`text-[11px] font-bold uppercase tracking-widest ${
        isAttack 
          ? (isDark ? 'text-red-400' : 'text-red-800') 
          : (isDark ? 'text-blue-400' : 'text-blue-800')
      }`}>
        {label}
      </label>
      
      <div className="flex items-center gap-1.5">
        {/* Dropdown Select - Made Larger */}
        <div className="relative flex-1 min-w-0">
          <select
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className={`w-full appearance-none border-2 rounded-xl py-1.5 h-11 px-3 focus:outline-none transition-all duration-200 cursor-pointer text-sm font-bold truncate
              ${themeClasses.select}`}
          >
            {options.map((opt) => (
              <option key={opt} value={opt} className={isDark ? "bg-slate-900" : "bg-white"}>
                {opt} {opt === 1 ? 'Die' : 'Dice'}
              </option>
            ))}
          </select>
          <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        {/* Quick Adjustment Controls - Made Smaller and placed on the Right */}
        <div className="flex gap-1 shrink-0">
          <button
            onClick={handleIncrement}
            disabled={value >= max}
            className={`${buttonBaseClass} ${themeClasses.btn} ${value >= max ? themeClasses.disabled : ''}`}
            aria-label={`Increase ${label} dice`}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            onClick={handleDecrement}
            disabled={value <= 0}
            className={`${buttonBaseClass} ${themeClasses.btn} ${value <= 0 ? themeClasses.disabled : ''}`}
            aria-label={`Decrease ${label} dice`}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiceInput;