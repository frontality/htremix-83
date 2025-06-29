
import { useState } from "react";
import { Plus, Zap, Gift, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    { icon: Plus, label: "Sell Item", action: () => navigate("/sell") },
    { icon: TrendingUp, label: "Marketplace", action: () => navigate("/marketplace") },
    { icon: Zap, label: "Crypto", action: () => navigate("/crypto-exchange") },
    { icon: Gift, label: "Rewards", action: () => {} },
  ];

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className={`flex flex-col-reverse gap-3 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
        {actions.map((action, index) => (
          <Button
            key={index}
            onClick={action.action}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg flex items-center justify-center"
            style={{ 
              transitionDelay: `${index * 50}ms` 
            }}
          >
            <action.icon size={20} />
          </Button>
        ))}
      </div>
      
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg transition-transform ${isOpen ? 'rotate-45' : ''}`}
      >
        <Plus size={24} />
      </Button>
    </div>
  );
};

export default QuickActions;
