import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DollarSign, Star } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

interface TipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: Tables<"reviews"> | null;
}

const TipDialog = ({ open, onOpenChange, review }: TipDialogProps) => {
  const [tipAmount, setTipAmount] = useState("");

  const handlePay = () => {
    if (!tipAmount || parseFloat(tipAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    // TODO: Stripe integration
    toast.success(`Thank you! $${tipAmount} tip sent to the reviewer.`);
    onOpenChange(false);
    setTipAmount("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono">Pay what you want</DialogTitle>
          <DialogDescription>
            Tip the reviewer for "{review?.title}". Any amount is appreciated!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="flex gap-2">
            {["5", "10", "25", "50"].map((amount) => (
              <Button
                key={amount}
                variant={tipAmount === amount ? "default" : "secondary"}
                size="sm"
                className="flex-1 font-mono"
                onClick={() => setTipAmount(amount)}
              >
                ${amount}
              </Button>
            ))}
          </div>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="number"
              placeholder="Custom amount"
              value={tipAmount}
              onChange={(e) => setTipAmount(e.target.value)}
              className="pl-10 font-mono"
              min="0"
              step="0.01"
            />
          </div>
          <Button variant="hero" className="w-full gap-2" onClick={handlePay}>
            <Star className="h-4 w-4" /> Send Tip
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TipDialog;
