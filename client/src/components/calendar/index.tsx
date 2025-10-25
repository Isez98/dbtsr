// generate a google calendar clone component in react using typescript and tailwind css
import React, { useState, useRef } from 'react';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface DateSelection {
  startDate: Date | null;
  endDate: Date | null;
}

interface PopupProps {
  selection: DateSelection;
  onClose: () => void;
}

const SelectionPopup: React.FC<PopupProps> = ({ selection, onClose }) => {
  if (!selection.startDate || !selection.endDate) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-400 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Selected Time Span</h3>
        <div className="space-y-2">
          <div>
            <span className="font-medium">Start Date:</span>
            <div className="text-gray-700">{formatDate(selection.startDate)}</div>
          </div>
          <div>
            <span className="font-medium">End Date:</span>
            <div className="text-gray-700">{formatDate(selection.endDate)}</div>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-red-600 rounded hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Create Event
          </button>
        </div>
      </div>
    </div>
  );
};

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Date | null>(null);
  const [dragEnd, setDragEnd] = useState<Date | null>(null);
  const [selection, setSelection] = useState<DateSelection>({ startDate: null, endDate: null });
  const [showPopup, setShowPopup] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const totalDays = endOfMonth.getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDateFromDay = (day: number): Date => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
  };

  const isDateInRange = (date: Date, start: Date | null, end: Date | null): boolean => {
    if (!start || !end) return false;
    const actualStart = start <= end ? start : end;
    const actualEnd = start <= end ? end : start;
    return date >= actualStart && date <= actualEnd;
  };

  const handleMouseDown = (day: number) => {
    const date = getDateFromDay(day);
    setIsDragging(true);
    setDragStart(date);
    setDragEnd(date);
    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
  };

  const handleMouseEnter = (day: number) => {
    if (isDragging) {
      const date = getDateFromDay(day);
      setDragEnd(date);
    }
  };

  const handleMouseUp = () => {
    if (isDragging && dragStart && dragEnd) {
      const startDate = dragStart <= dragEnd ? dragStart : dragEnd;
      const endDate = dragStart <= dragEnd ? dragEnd : dragStart;
      
      setSelection({ startDate, endDate });
      setShowPopup(true);
    }
    
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
    document.body.style.userSelect = '';
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setSelection({ startDate: null, endDate: null });
  };

  // Add global mouse up listener to handle mouse up outside calendar
  React.useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setDragStart(null);
        setDragEnd(null);
        document.body.style.userSelect = '';
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);

  const renderDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-4 border"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= totalDays; day++) {
      const date = getDateFromDay(day);
      const isInDragRange = isDateInRange(date, dragStart, dragEnd);
      const isSelected = isDateInRange(date, selection.startDate, selection.endDate);
      
      let cellClasses = "p-4 border cursor-pointer select-none transition-colors ";
      
      if (isInDragRange && isDragging) {
        cellClasses += "bg-blue-200 ";
      } else if (isSelected) {
        cellClasses += "bg-blue-100 ";
      } else {
        cellClasses += "hover:bg-gray-100 ";
      }
      
      days.push(
        <div
          key={day}
          className={cellClasses}
          onMouseDown={() => handleMouseDown(day)}
          onMouseEnter={() => handleMouseEnter(day)}
          onMouseUp={handleMouseUp}
        >
          {day}
        </div>
      );
    }
    return days;
  };

  return (
    <>
      <div className="max-w-md mx-auto p-4" ref={calendarRef}>
        <div className="flex justify-between items-center mb-4">
          <button onClick={prevMonth} className="px-2 py-1 bg-gray-200 rounded">
            Prev
          </button>
          <h2 className="text-lg font-semibold">
            {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
          </h2>
          <button onClick={nextMonth} className="px-2 py-1 bg-gray-200 rounded">
            Next
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center font-semibold">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {renderDays()}
        </div>
      </div>
      
      {showPopup && (
        <SelectionPopup 
          selection={selection} 
          onClose={handlePopupClose} 
        />
      )}
    </>
  );
};

export default Calendar;
