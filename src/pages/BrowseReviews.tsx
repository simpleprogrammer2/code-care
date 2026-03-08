import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Code2, Clock, CheckCircle2, DollarSign, Star } from "lucide-react";
import { toast } from "sonner";

interface ReviewRequest {
  id: number;
  title: string;
  language: string;
  author: string;
  snippet: string;
  status: "open" | "in-review" | "completed";
  createdAt: string;
  reviewerRating?: number;
  tip?: string;
}

const mockReviews: ReviewRequest[] = [
  { id: 1, title: "Express Middleware Error Handling", language: "TypeScript", author: "dev_jane", snippet: "Custom error boundary middleware with logging", status: "open", createdAt: "2 hours ago" },
  { id: 2, title: "Rust Ownership Pattern", language: "Rust", author: "rustacean", snippet: "Borrow checker compliant linked list", status: "open", createdAt: "4 hours ago" },
  { id: 3, title: "SQL Query Optimization", language: "SQL", author: "db_wizard", snippet: "Complex JOIN with subquery performance", status: "in-review", createdAt: "6 hours ago" },
  { id: 4, title: "React Custom Hook", language: "TypeScript", author: "hook_master", snippet: "useInfiniteScroll with intersection observer", status: "open", createdAt: "8 hours ago" },
  { id: 5, title: "Go HTTP Server", language: "Go", author: "gopher99", snippet: "Graceful shutdown with context cancellation", status: "completed", createdAt: "1 day ago", reviewerRating: 5, tip: "$20" },
  { id: 6, title: "Python Data Pipeline", language: "Python", author: "data_py", snippet: "Async ETL with retry mechanism", status: "completed", createdAt: "1 day ago", reviewerRating: 4, tip: "$12" },
];

const statusConfig = {
  open: { label: "Open", icon: Clock, className: "border-primary/50 text-primary bg-primary/10" },
  "in-review": { label: "In Review", icon: Code2, className: "border-warning/50 text-warning bg-warning/10" },
  completed: { label: "Completed", icon: CheckCircle2, className: "border-muted-foreground/50 text-muted-foreground bg-muted" },
};

const BrowseReviews = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "in-review" | "completed">("all");
  const [payOpen, setPayOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewRequest | null>(null);
  const [tipAmount, setTipAmount] = useState("");

  const filtered = mockReviews.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.language.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || r.status === filter;
    return matchSearch && matchFilter;
  });

  const handlePay = () => {
    if (!tipAmount || parseFloat(tipAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    toast.success(`Thank you! $${tipAmount} tip sent to the reviewer.`);
    setPayOpen(false);
    setTipAmount("");
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
            {(["all", "open", "in-review", "completed"] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "secondary"}
                size="sm"
                onClick={() => setFilter(f)}
                className="font-mono text-xs capitalize"
              >
                {f === "all" ? "All" : f}
              </Button>
            ))}
          </div>
        </div>

        {/* Review Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((review) => {
            const statusInfo = statusConfig[review.status];
            const StatusIcon = statusInfo.icon;
            return (
              <Card
                key={review.id}
                className="group transition-all hover:border-primary/30 hover:glow-border"
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
                    {review.snippet}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">@{review.author} · {review.createdAt}</span>

                    {review.status === "open" && (
                      <Button variant="hero" size="sm" className="text-xs">
                        Pick Up
                      </Button>
                    )}

                    {review.status === "completed" && (
                      <div className="flex items-center gap-3">
                        {review.tip && (
                          <span className="font-mono text-sm font-bold text-primary">{review.tip}</span>
                        )}
                        <Button
                          variant="hero-outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            setSelectedReview(review);
                            setPayOpen(true);
                          }}
                        >
                          <DollarSign className="mr-1 h-3 w-3" /> Tip
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="font-mono text-muted-foreground">No reviews match your search.</p>
          </div>
        )}
      </div>

      {/* Pay What You Want Dialog */}
      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-mono">Pay what you want</DialogTitle>
            <DialogDescription>
              Tip the reviewer for "{selectedReview?.title}". Any amount is appreciated!
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

      <Footer />
    </div>
  );
};

export default BrowseReviews;
