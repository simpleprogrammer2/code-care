import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Code2, Clock, CheckCircle2, DollarSign } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { formatDistanceToNow } from "date-fns";

type Review = Tables<"reviews">;

const statusConfig = {
  open: { label: "Open", icon: Clock, className: "border-primary/50 text-primary bg-primary/10" },
  in_review: { label: "In Review", icon: Code2, className: "border-yellow-500/50 text-yellow-500 bg-yellow-500/10" },
  completed: { label: "Completed", icon: CheckCircle2, className: "border-muted-foreground/50 text-muted-foreground bg-muted" },
  cancelled: { label: "Cancelled", icon: Clock, className: "border-destructive/50 text-destructive bg-destructive/10" },
};

interface ReviewCardProps {
  review: Review;
  onPickUp?: (id: string) => void;
  onTip?: (review: Review) => void;
  onClick?: (id: string) => void;
  isAuthenticated: boolean;
}

const ReviewCard = ({ review, onPickUp, onTip, onClick, isAuthenticated }: ReviewCardProps) => {
  const statusInfo = statusConfig[review.status];
  const StatusIcon = statusInfo.icon;
  const timeAgo = formatDistanceToNow(new Date(review.created_at), { addSuffix: true });

  return (
    <Card
      className="group cursor-pointer transition-all hover:border-primary/30 hover:glow-border"
      onClick={() => onClick?.(review.id)}
    >
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <Badge variant="secondary" className="font-mono text-xs">{review.language}</Badge>
          <Badge variant="outline" className={`gap-1 font-mono text-xs ${statusInfo.className}`}>
            <StatusIcon className="h-3 w-3" />
            {statusInfo.label}
          </Badge>
        </div>

        <h3 className="mb-2 font-mono text-base font-semibold text-foreground">{review.title}</h3>

        <div className="mb-4 rounded-md bg-surface px-3 py-2 font-mono text-xs text-muted-foreground">
          <Code2 className="mr-1 inline h-3 w-3 text-primary" />
          {review.code_snippet.slice(0, 80)}
          {review.code_snippet.length > 80 && "…"}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{timeAgo}</span>

          {review.status === "open" && isAuthenticated && onPickUp && (
            <Button
              variant="hero"
              size="sm"
              className="text-xs"
              onClick={(e) => { e.stopPropagation(); onPickUp(review.id); }}
            >
              Pick Up
            </Button>
          )}

          {review.status === "completed" && isAuthenticated && onTip && (
            <Button
              variant="hero-outline"
              size="sm"
              className="text-xs"
              onClick={(e) => { e.stopPropagation(); onTip(review); }}
            >
              <DollarSign className="mr-1 h-3 w-3" /> Tip
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
