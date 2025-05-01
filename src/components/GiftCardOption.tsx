
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
        "relative cursor-pointer rounded-xl p-6 transition-all duration-300 overflow-hidden",
        "border-2 bg-gradient-to-br from-hottopic-dark to-black",
        isSelected
          ? "border-hottopic-purple card-glow scale-105"
          : "border-hottopic-gray hover:border-hottopic-purple/50"
      )}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gift-card-pattern opacity-20"></div>
      
      {isSelected && (
        <div className="absolute top-3 right-3 text-hottopic-purple">
          <CheckCircle size={24} />
        </div>
      )}
      
      <div className="relative z-10">
        <h3 className={cn(
          "text-3xl font-bold mb-2",
          isSelected ? "text-hottopic-purple glow-text" : "text-white"
        )}>
          ${value}
        </h3>
        
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-sm line-through">
            Original: ${originalPrice.toFixed(2)}
          </p>
          <p className="text-hottopic-red font-bold">
            Now: ${discountedPrice.toFixed(2)}
          </p>
          <p className="text-green-500 text-sm font-semibold mt-1">
            Save 50%
          </p>
        </div>
      </div>
    </div>
  );
};

export default GiftCardOption;
