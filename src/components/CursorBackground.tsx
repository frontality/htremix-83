
import { useEffect, useState } from "react";

const CursorBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div 
        className="absolute w-96 h-96 rounded-full opacity-10 transition-all duration-300 ease-out"
        style={{
          background: `radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(99, 102, 241, 0.1) 50%, transparent 70%)`,
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          transform: 'translate3d(0, 0, 0)',
        }}
      />
      <div 
        className="absolute w-64 h-64 rounded-full opacity-20 transition-all duration-500 ease-out"
        style={{
          background: `radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(168, 85, 247, 0.1) 50%, transparent 70%)`,
          left: mousePosition.x - 128,
          top: mousePosition.y - 128,
          transform: 'translate3d(0, 0, 0)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 -z-10" />
    </div>
  );
};

export default CursorBackground;
