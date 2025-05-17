
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const HotTopicPromo = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let newSeconds = prev.seconds - 1;
        let newMinutes = prev.minutes;
        let newHours = prev.hours;
        
        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }
        
        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }
        
        if (newHours < 0) {
          // Reset to 24 hours when timer completes
          return { hours: 24, minutes: 0, seconds: 0 };
        }
        
        return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-black border-y-2 border-hottopic-red/70 py-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
          <div className="bg-hottopic-red px-4 py-2 rounded-sm ht-skew">
            <span className="text-white font-bold ht-unskew inline-block text-lg">
              FLASH SALE
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">ENDS IN:</span>
            <div className="flex items-center gap-1 text-white">
              <Clock size={18} className="text-hottopic-red" />
              <span className="font-mono font-bold">
                {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
          
          <div className="text-white font-bold md:ml-4">
            USE CODE: <span className="text-hottopic-red bg-white px-2 py-0.5 mx-1">HOTTOPICSAVE70</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotTopicPromo;
