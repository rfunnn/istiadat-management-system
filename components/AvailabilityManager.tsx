
import React, { useState } from 'react';
import { AvailabilitySlot } from '../types';

interface AvailabilityManagerProps {
  availability: AvailabilitySlot[];
  onToggleSlot: (date: string, type: 'day' | 'night') => void;
}

const AvailabilityManager: React.FC<AvailabilityManagerProps> = ({ availability, onToggleSlot }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const numDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const calendarDays = [];
  for (let i = 0; i < startDay; i++) calendarDays.push(null);
  for (let d = 1; d <= numDays; d++) calendarDays.push(d);

  const getSlotState = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return availability.find(s => s.date === dateStr) || { date: dateStr, daySlot: true, nightSlot: true };
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-stone-200">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
        <div>
          <h3 className="text-2xl font-serif font-bold text-[#3d2b1f]">Venue Schedule</h3>
          <p className="text-sm text-stone-500 font-medium mt-1">Refining availability for viewing and events.</p>
        </div>
        <div className="flex items-center bg-stone-50 rounded-2xl p-1.5 border border-stone-100 shadow-inner">
          <button 
            onClick={prevMonth}
            className="w-10 h-10 flex items-center justify-center hover:bg-white hover:text-[#a67c52] hover:shadow-sm rounded-xl transition-all text-stone-400 active:scale-90"
          >
            <i className="fas fa-chevron-left text-xs"></i>
          </button>
          <span className="px-10 font-serif font-bold text-[#3d2b1f] text-lg min-w-[200px] text-center tracking-wide">
            {monthName} <span className="text-[#a67c52]">{year}</span>
          </span>
          <button 
            onClick={nextMonth}
            className="w-10 h-10 flex items-center justify-center hover:bg-white hover:text-[#a67c52] hover:shadow-sm rounded-xl transition-all text-stone-400 active:scale-90"
          >
            <i className="fas fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-stone-100 border border-stone-100 rounded-[2rem] overflow-hidden shadow-inner">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-stone-50 py-5 text-center text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">
            {day}
          </div>
        ))}
        
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="bg-stone-50/40 h-36"></div>;
          }

          const slot = getSlotState(day);
          
          return (
            <div 
              key={day} 
              className={`bg-white h-36 p-5 flex flex-col justify-between transition-all hover:z-10 relative group ${
                isToday(day) ? 'ring-4 ring-inset ring-[#a67c52]/20' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-base font-serif font-bold ${isToday(day) ? 'text-[#a67c52]' : 'text-stone-700'}`}>
                  {day}
                </span>
                {isToday(day) && (
                  <span className="w-1.5 h-1.5 bg-[#a67c52] rounded-full shadow-[0_0_8px_rgba(166,124,82,0.5)]"></span>
                )}
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => onToggleSlot(slot.date, 'day')}
                  className={`w-full py-2 px-3 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all flex items-center justify-between group ${
                    slot.daySlot 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-600 hover:text-white' 
                    : 'bg-stone-100 text-stone-400 border border-stone-200 hover:bg-rose-500 hover:text-white hover:border-rose-500'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <i className="fas fa-sun opacity-60"></i>
                    DAY
                  </span>
                  <i className={`fas ${slot.daySlot ? 'fa-circle-check' : 'fa-circle-xmark'} opacity-30`}></i>
                </button>

                <button
                  onClick={() => onToggleSlot(slot.date, 'night')}
                  className={`w-full py-2 px-3 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all flex items-center justify-between group ${
                    slot.nightSlot 
                    ? 'bg-[#a67c52]/10 text-[#a67c52] border border-[#a67c52]/20 hover:bg-[#a67c52] hover:text-white' 
                    : 'bg-stone-100 text-stone-400 border border-stone-200 hover:bg-rose-500 hover:text-white hover:border-rose-500'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <i className="fas fa-moon opacity-60"></i>
                    NIGHT
                  </span>
                  <i className={`fas ${slot.nightSlot ? 'fa-circle-check' : 'fa-circle-xmark'} opacity-30`}></i>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex flex-wrap gap-8 text-[10px] font-bold uppercase tracking-widest text-stone-400 border-t border-stone-100 pt-10">
        <div className="flex items-center gap-3">
          <span className="w-4 h-4 bg-emerald-500 rounded-md shadow-sm"></span>
          <span>Open Slot</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-4 h-4 bg-stone-200 rounded-md shadow-sm"></span>
          <span>Reserved / Blocked</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-4 h-4 bg-[#a67c52] rounded-md shadow-sm"></span>
          <span>Featured Date</span>
        </div>
        <div className="ml-auto italic normal-case flex items-center gap-2 text-stone-300 font-medium">
          <i className="fas fa-mouse-pointer text-[#a67c52]"></i>
          Toggle availability via direct interaction
        </div>
      </div>
    </div>
  );
};

export default AvailabilityManager;
