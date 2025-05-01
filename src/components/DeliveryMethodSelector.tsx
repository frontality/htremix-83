
import { cn } from "@/lib/utils";
import { Mail, Package } from "lucide-react";

interface DeliveryMethodSelectorProps {
  selectedMethod: "e-gift" | "physical";
  onSelect: (method: "e-gift" | "physical") => void;
}

const DeliveryMethodSelector = ({
  selectedMethod,
  onSelect,
}: DeliveryMethodSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        onClick={() => onSelect("e-gift")}
        className={cn(
          "border-2 p-4 rounded-xl flex items-center gap-4 cursor-pointer",
          "transition-all duration-300",
          selectedMethod === "e-gift"
            ? "border-hottopic-red bg-hottopic-red/10 card-glow"
            : "border-hottopic-gray hover:border-hottopic-red/50"
        )}
      >
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center",
          selectedMethod === "e-gift" ? "bg-hottopic-red" : "bg-hottopic-gray"
        )}>
          <Mail className="text-white" size={24} />
        </div>
        <div>
          <h3 className="font-bold">E-Gift Card</h3>
          <p className="text-sm text-muted-foreground">Delivered instantly via email</p>
        </div>
      </div>
      
      <div
        onClick={() => onSelect("physical")}
        className={cn(
          "border-2 p-4 rounded-xl flex items-center gap-4 cursor-pointer",
          "transition-all duration-300",
          selectedMethod === "physical"
            ? "border-hottopic-red bg-hottopic-red/10 card-glow"
            : "border-hottopic-gray hover:border-hottopic-red/50"
        )}
      >
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center",
          selectedMethod === "physical" ? "bg-hottopic-red" : "bg-hottopic-gray"
        )}>
          <Package className="text-white" size={24} />
        </div>
        <div>
          <h3 className="font-bold">Physical Gift Card</h3>
          <p className="text-sm text-muted-foreground">Shipped to your address</p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryMethodSelector;
