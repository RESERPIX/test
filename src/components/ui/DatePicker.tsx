import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const pad = (n: number) => n.toString().padStart(2, '0');
const formatDateTimeLocal = (d: Date) => {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const DAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export interface DatePickerProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Выберите дату и время',
  disabled,
  className = '',
  id
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value) : null;
  const [viewDate, setViewDate] = useState(selectedDate || new Date());
  
  const [timeInput, setTimeInput] = useState(selectedDate ? `${pad(selectedDate.getHours())}:${pad(selectedDate.getMinutes())}` : '12:00');

  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setViewDate(d);
        setTimeInput(`${pad(d.getHours())}:${pad(d.getMinutes())}`);
      }
    }
  }, [value]);

  const updateCoords = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      let left = rect.left;
      if (left + 400 > window.innerWidth) {
        left = window.innerWidth - 410;
      }
      setCoords({
        top: rect.bottom + 8,
        left: left,
      });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current && 
        !popoverRef.current.contains(e.target as Node) && 
        buttonRef.current && 
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      updateCoords();
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', updateCoords, true);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updateCoords, true);
    };
  }, [isOpen, updateCoords]);

  const toggleOpen = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen && selectedDate) {
      setViewDate(selectedDate);
    }
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setViewDate(newDate);
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const [h, m] = timeInput.split(':').map(Number);
    newDate.setHours(h || 0, m || 0);
    onChange(formatDateTimeLocal(newDate));
  };

  const handleHourSelect = (hour: number) => {
    const m = timeInput.split(':')[1] || '00';
    const newTime = `${pad(hour)}:${m}`;
    setTimeInput(newTime);
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(hour, parseInt(m, 10));
      onChange(formatDateTimeLocal(newDate));
    }
  };

  const handleMinuteSelect = (minute: number) => {
    const h = timeInput.split(':')[0] || '00';
    const newTime = `${h}:${pad(minute)}`;
    setTimeInput(newTime);
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(parseInt(h, 10), minute);
      onChange(formatDateTimeLocal(newDate));
    }
  };

  const renderCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    const days = [];

    const daysInPrevMonth = new Date(year, month, 0).getDate();
    for (let i = startOffset - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }

    const remaining = Math.ceil(days.length / 7) * 7 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }

    const currentHour = parseInt(timeInput.split(':')[0] || '0', 10);
    const currentMinute = parseInt(timeInput.split(':')[1] || '0', 10);

    return (
      <div className="flex">
        <div className="p-4 w-[280px] select-none flex flex-col gap-4 border-r border-borderDef/30">
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-bold text-textPrimary">
              {MONTHS[month]} {year}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                className="w-7 h-7 flex items-center justify-center rounded-control hover:bg-surface-3 text-textSecondary hover:text-textPrimary transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => changeMonth(1)}
                className="w-7 h-7 flex items-center justify-center rounded-control hover:bg-surface-3 text-textSecondary hover:text-textPrimary transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-7 mb-2">
              {DAYS_SHORT.map(d => (
                <div key={d} className="text-center text-[10px] font-bold text-textTertiary uppercase tracking-wider h-6 flex items-center justify-center">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1.5 gap-x-1">
              {days.map((d, i) => {
                const isSelected = selectedDate && d.isCurrentMonth && d.day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();
                const isToday = d.isCurrentMonth && d.day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => d.isCurrentMonth ? handleDateSelect(d.day) : null}
                    className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-semibold transition-colors cursor-pointer ${
                      !d.isCurrentMonth ? 'text-textDisabled cursor-default opacity-40' :
                      isSelected ? 'bg-accent text-white font-extrabold' :
                      'text-textPrimary hover:bg-surface-3'
                    } ${isToday && !isSelected ? 'text-accent font-bold ring-1 ring-accent/30' : ''}`}
                  >
                    {d.day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-[120px] select-none relative">
          <div className="absolute inset-0 flex">
            <div className="flex-1 flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden border-r border-borderDef/30 p-1">
              {Array.from({length: 24}).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleHourSelect(i)}
                  className={`w-full py-2 text-xs font-mono font-medium rounded-control transition-colors cursor-pointer shrink-0 ${
                    currentHour === i ? 'bg-accent text-white font-extrabold' : 'text-textPrimary hover:bg-surface-3'
                  }`}
                >
                  {pad(i)}
                </button>
              ))}
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden p-1">
              {Array.from({length: 60}).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleMinuteSelect(i)}
                  className={`w-full py-2 text-xs font-mono font-medium rounded-control transition-colors cursor-pointer shrink-0 ${
                    currentMinute === i ? 'bg-accent text-white font-extrabold' : 'text-textPrimary hover:bg-surface-3'
                  }`}
                >
                  {pad(i)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const displayValue = selectedDate ? `${pad(selectedDate.getDate())}.${pad(selectedDate.getMonth() + 1)}.${selectedDate.getFullYear()} в ${pad(selectedDate.getHours())}:${pad(selectedDate.getMinutes())}` : placeholder;

  return (
    <div className={`relative ${className}`}>
      <button
        id={id}
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={toggleOpen}
        className={`w-full h-12 px-4 rounded-control border flex items-center justify-between transition-all outline-none ${
          disabled ? 'opacity-50 cursor-not-allowed bg-surface-1/20 border-borderDef/50 text-textDisabled' :
          isOpen ? 'bg-surface-2 border-accent shadow-[0_0_12px_rgba(124,58,237,0.1)] text-textPrimary' :
          'bg-surface-1/40 border-borderDef hover:border-borderStrong hover:bg-surface-1/80 text-textPrimary'
        }`}
      >
        <span className={`text-sm ${selectedDate ? 'font-mono font-medium' : 'text-textSecondary'}`}>
          {displayValue}
        </span>
        <CalendarIcon className={`w-4 h-4 transition-colors ${isOpen || selectedDate ? 'text-accent' : 'text-textTertiary'}`} />
      </button>

      {isOpen && ReactDOM.createPortal(
        <div
          ref={popoverRef}
          style={{ top: coords.top, left: coords.left }}
          className="fixed z-tooltip bg-surface-1 border border-borderDef rounded-card shadow-elevation-overlay animate-fadeIn overflow-hidden flex"
        >
          {renderCalendar()}
        </div>,
        document.body
      )}
    </div>
  );
};

export default DatePicker;
