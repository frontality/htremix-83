
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

interface GiftCardOptionProps {
  value: number;
  isSelected: boolean;
  originalPrice: number;
  discountedPrice: number;
  onClick: () => void;
}

const GiftCardOption = ({
  value,
  isSelected,
  originalPrice,
  discountedPrice,
  onClick,
}: GiftCardOptionProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative cursor-pointer rounded-lg transition-all duration-300 overflow-hidden group ht-hover-effect",
        isSelected
          ? "border-2 border-hottopic-red card-glow scale-105"
          : "border border-hottopic-gray hover:border-hottopic-red"
      )}
    >
      {/* Red bar at top */}
      <div className={cn(
        "absolute top-0 left-0 w-full h-1",
        isSelected ? "bg-hottopic-red" : "bg-transparent group-hover:bg-hottopic-red/50"
      )}></div>
      
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 text-hottopic-red z-10 animate-pulse">
          <CheckCircle size={24} />
        </div>
      )}
      
      <div className="p-4">
        {/* Card image */}
        <div className="mb-3 relative">
          <div className="absolute -top-1 -right-1 bg-hottopic-red text-white text-xs font-bold px-2 py-0.5 rotate-3 z-10 animate-floating">
            50% OFF
          </div>
          <img 
            src="https://i.imgur.com/adJEpil.png" 
            alt="Hot Topic Gift Card"
            className={cn(
              "w-full rounded-sm shadow-sm border transition-all duration-300",
              isSelected 
                ? "border-hottopic-red/50 ht-border-glow" 
                : "border-hottopic-gray/30 group-hover:border-hottopic-red/30"
            )}
          />
        </div>
        
        {/* Card value */}
        <h3 className={cn(
          "text-2xl font-bold mb-2 text-center transition-colors duration-300",
          isSelected ? "text-hottopic-red glow-text" : "text-white group-hover:text-hottopic-red"
        )}>
          ${value}
        </h3>
        
        {/* Pricing */}
        <div className="flex flex-col gap-1 text-center">
          <p className="text-muted-foreground text-sm line-through">
            ${originalPrice.toFixed(2)}
          </p>
          <p className="text-hottopic-red font-bold">
            ${discountedPrice.toFixed(2)}
          </p>
          <div className="mt-2">
            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-sm font-semibold ht-skew">
              <span className="ht-unskew inline-block">SAVE 50%</span>
            </span>
          </div>
        </div>
      </div>
      
      {/* Selected banner */}
      {isSelected && (
        <div className="bg-hottopic-red text-white text-center py-2 text-sm font-bold animate-pulse-border">
          SELECTED
        </div>
      )}
    </div>
  );
};

export default GiftCardOption;
