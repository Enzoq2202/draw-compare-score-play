
import React, { useEffect } from 'react';

interface TimerProps {
  timeRemaining: number;
  onTimeUpdate: (time: number) => void;
  onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ timeRemaining, onTimeUpdate, onTimeUp }) => {
  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      onTimeUpdate(timeRemaining - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, onTimeUpdate, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getColorClass = () => {
    if (timeRemaining > 30) return 'text-green-600';
    if (timeRemaining > 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressClass = () => {
    if (timeRemaining > 30) return 'bg-green-500';
    if (timeRemaining > 10) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const progressWidth = (timeRemaining / 60) * 100;

  return (
    <div className="text-center">
      <div className={`text-3xl font-bold ${getColorClass()} mb-2`}>
        {formatTime(timeRemaining)}
      </div>
      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-linear ${getProgressClass()}`}
          style={{ width: `${progressWidth}%` }}
        />
      </div>
      {timeRemaining <= 10 && timeRemaining > 0 && (
        <div className="text-red-600 text-sm font-medium mt-1 animate-pulse">
          Hurry up!
        </div>
      )}
    </div>
  );
};

export default Timer;
