import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewCard from "@/components/ReviewCard";
import TipDialog from "@/components/TipDialog";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useReviews, usePickUpReview } from "@/hooks/useReviews";
import type { Tables } from "@/integrations/supabase/types";

const FILTERS = ["all", "open", "in_review", "completed"] as const;

const BrowseReviews = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [tipReview, setTipReview] = useState<Tables<"reviews"> | null>(null);
  const { user } = useAuth();
  const { data: reviews = [], isLoading } = useReviews(filter);
  const pickUp = usePickUpReview();

  const filtered = reviews.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.language.toLowerCase().includes(search.toLowerCase())
  );

  const handlePickUp = async (id: string) => {
    try {
      await pickUp.mutateAsync(id);
      toast.success("Review picked up! Time to review some code.");
    } catch {
      toast.error("Failed to pick up review");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pb-24 pt-28">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Browse <span className="text-primary">reviews</span>
          </h1>
          <p className="text-muted-foreground">Pick up a review or see what others are building.</p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title or language..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 font-mono"
            />
          </div>
          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "secondary"}
                size="sm"
                onClick={() => setFilter(f)}
                className="font-mono text-xs capitalize"
              >
                {f === "all" ? "All" : f.replace("_", " ")}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center">
            <p className="font-mono text-muted-foreground">Loading reviews...</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                isAuthenticated={!!user}
                onPickUp={handlePickUp}
                onTip={(r) => setTipReview(r)}
              />
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="font-mono text-muted-foreground">No reviews match your search.</p>
          </div>
        )}
      </div>

      <TipDialog open={!!tipReview} onOpenChange={(o) => !o && setTipReview(null)} review={tipReview} />
      <Footer />
    </div>
  );
};

export default BrowseReviews;
