import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { AppInput } from './AppInput';
import { Button } from './Button';

export interface DatePickerInputProps {
  label?: string;
  value: string; // Format DD/MM/YYYY
  onChange: (date: string) => void;
  error?: string;
  placeholder?: string;
  allowClear?: boolean;
  align?: 'left' | 'right';
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DAYS_OF_WEEK = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  label,
  value,
  onChange,
  error,
  placeholder = 'DD/MM/AAAA',
  allowClear = false,
  align = 'left',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse value or default to current date
  const parseCurrentDate = (): { day: number; month: number; year: number } => {
    if (value && value.includes('/')) {
      const [d, m, y] = value.split('/').map(Number);
      if (d && m && y) {
        return { day: d, month: m - 1, year: y };
      }
    }
    const today = new Date();
    return { day: today.getDate(), month: today.getMonth(), year: today.getFullYear() };
  };

  const initial = parseCurrentDate();
  const [viewMonth, setViewMonth] = useState(initial.month);
  const [viewYear, setViewYear] = useState(initial.year);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const formatted = `${String(day).padStart(2, '0')}/${String(viewMonth + 1).padStart(2, '0')}/${viewYear}`;
    onChange(formatted);
    setIsOpen(false);
  };

  const handleToday = () => {
    const today = new Date();
    setViewMonth(today.getMonth());
    setViewYear(today.getFullYear());
    const formatted = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    onChange(formatted);
    setIsOpen(false);
  };

  // Generate calendar days
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7; // Monday = 0
  const daysArray: (number | null)[] = [];

  for (let i = 0; i < firstDayOfWeek; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  const selectedDate = parseCurrentDate();
  const isSelected = (day: number) =>
    selectedDate.day === day &&
    selectedDate.month === viewMonth &&
    selectedDate.year === viewYear;

  const today = new Date();
  const isToday = (day: number) =>
    today.getDate() === day &&
    today.getMonth() === viewMonth &&
    today.getFullYear() === viewYear;

  return (
    <div ref={containerRef} className="relative w-full">
      <div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer">
        <AppInput
          label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          error={error}
          readOnly
          className="cursor-pointer font-mono font-medium"
          rightElement={
            <div className="flex items-center space-x-1">
              {allowClear && Boolean(value) && (
                <Button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange('');
                  }}
                  className="p-1 text-stone-300 hover:text-stone-600 transition-colors"
                  title="Limpiar fecha"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen((prev) => !prev);
                }}
                className="p-1 text-stone-400 hover:text-maribel-700 transition-colors"
              >
                <CalendarIcon className="w-4 h-4" />
              </button>
            </div>
          }
        />
      </div>

      {isOpen && (
        <div
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } top-full mt-1.5 z-50 w-72 bg-white rounded-2xl shadow-xl border border-stone-200 p-3.5 select-none animate-in fade-in zoom-in-95 duration-150`}
        >
          {/* Header con Mes/Año y botones */}
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold text-stone-800 font-serif">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAYS_OF_WEEK.map((d) => (
              <span key={d} className="text-[10px] font-bold text-stone-400 uppercase">
                {d}
              </span>
            ))}
          </div>

          {/* Grilla de días */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {daysArray.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="h-7 w-7" />;
              }

              const selected = isSelected(day);
              const currentDay = isToday(day);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`h-7 w-7 rounded-xl text-xs font-medium flex items-center justify-center transition-all ${
                    selected
                      ? 'bg-maribel-700 text-white font-bold shadow-xs'
                      : currentDay
                      ? 'border border-maribel-400 text-maribel-700 font-semibold bg-rose-50/50'
                      : 'hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer del calendario */}
          <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={handleToday}
              className="text-maribel-700 font-semibold hover:underline"
            >
              Hoy
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-stone-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
