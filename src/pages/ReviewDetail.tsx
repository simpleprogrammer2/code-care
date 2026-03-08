import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import sdk from "@stackblitz/sdk";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useReview, usePickUpReview, useSubmitFeedback } from "@/hooks/useReviews";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Star, Send, Code2, Loader2 } from "lucide-react";

/** Map our language labels → StackBlitz project template + file extension */
const langConfig: Record<string, { template: "node" | "typescript"; ext: string; runner: string }> = {
  TypeScript: { template: "typescript", ext: "ts", runner: "npx ts-node index.ts" },
  JavaScript: { template: "node", ext: "js", runner: "node index.js" },
  Python: { template: "node", ext: "py", runner: "# Python – install python3 in terminal: python3 index.py" },
  Go: { template: "node", ext: "go", runner: "# Go – run: go run index.go" },
  Rust: { template: "node", ext: "rs", runner: "# Rust – run: rustc index.rs && ./index" },
  Java: { template: "node", ext: "java", runner: "# Java – run: javac Main.java && java Main" },
  "C++": { template: "node", ext: "cpp", runner: "# C++ – run: g++ -o main index.cpp && ./main" },
  Ruby: { template: "node", ext: "rb", runner: "# Ruby – run: ruby index.rb" },
  SQL: { template: "node", ext: "sql", runner: "# SQL file – use your preferred DB client" },
  Other: { template: "node", ext: "txt", runner: "# Open the file and review" },
};

const ReviewDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: review, isLoading } = useReview(id || "");
  const pickUp = usePickUpReview();
  const submitFeedback = useSubmitFeedback();
  const embedRef = useRef<HTMLDivElement>(null);
  const embedLoaded = useRef(false);

  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Embed StackBlitz when review loads
  useEffect(() => {
    if (!review || !embedRef.current || embedLoaded.current) return;
    if (review.status !== "in_review") return;

    const cfg = langConfig[review.language] || langConfig.Other;
    const fileName = `index.${cfg.ext}`;

    embedLoaded.current = true;
    sdk.embedProject(
      embedRef.current,
      {
        title: review.title,
        description: review.description || "Code Review",
        template: cfg.template,
        files: {
          [fileName]: review.code_snippet,
          "README.md": `# ${review.title}\n\nLanguage: ${review.language}\n\n${review.description || ""}\n\n## Run\n${cfg.runner}`,
        },
      },
      {
        height: 500,
        openFile: fileName,
        theme: "dark",
        clickToLoad: false,
      }
    );
  }, [review]);

  const handlePickUp = async () => {
    if (!id) return;
    try {
      await pickUp.mutateAsync(id);
      toast.success("Review picked up! The sandbox is loading.");
    } catch {
      toast.error("Failed to pick up review");
    }
  };

  const handleSubmitFeedback = async () => {
    if (!id || !feedback.trim() || rating === 0) {
      toast.error("Please provide feedback and a rating");
      return;
    }
    try {
      await submitFeedback.mutateAsync({ reviewId: id, feedback, rating });
      toast.success("Feedback submitted!");
      navigate("/browse");
    } catch {
      toast.error("Failed to submit feedback");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto flex items-center justify-center px-6 pb-24 pt-28">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 pb-24 pt-28 text-center">
          <h1 className="mb-4 font-mono text-2xl font-bold text-foreground">Review not found</h1>
          <Link to="/browse"><Button variant="outline">Back to Browse</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isReviewer = user?.id === review.reviewer_id;
  const isRequester = user?.id === review.requester_id;
  const canPickUp = review.status === "open" && user && !isRequester;
  const showSandbox = review.status === "in_review";
  const canSubmitFeedback = review.status === "in_review" && isReviewer;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pb-24 pt-28">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/browse")} className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <Badge variant="secondary" className="font-mono text-xs">{review.language}</Badge>
          <Badge
            variant="outline"
            className={`font-mono text-xs ${
              review.status === "open"
                ? "border-primary/50 text-primary bg-primary/10"
                : review.status === "in_review"
                ? "border-yellow-500/50 text-yellow-500 bg-yellow-500/10"
                : "border-muted-foreground/50 text-muted-foreground bg-muted"
            }`}
          >
            {review.status.replace("_", " ")}
          </Badge>
        </div>

        <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {review.title}
        </h1>
        {review.description && (
          <p className="mb-6 text-muted-foreground">{review.description}</p>
        )}

        {/* Pick up CTA */}
        {canPickUp && (
          <Card className="mb-6 glow-border">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="font-mono font-semibold text-foreground">Ready to review?</p>
                <p className="text-sm text-muted-foreground">Pick this up to open the live sandbox and start reviewing.</p>
              </div>
              <Button variant="hero" onClick={handlePickUp} disabled={pickUp.isPending} className="gap-2">
                <Code2 className="h-4 w-4" /> {pickUp.isPending ? "Picking up..." : "Pick Up & Open IDE"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Code preview for open reviews */}
        {review.status === "open" && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="font-mono text-sm">Code Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="max-h-[400px] overflow-auto rounded-md bg-muted p-4 font-mono text-xs text-foreground">
                {review.code_snippet}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* StackBlitz sandbox */}
        {showSandbox && (
          <Card className="mb-6 overflow-hidden">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center gap-2 font-mono text-sm">
                <Code2 className="h-4 w-4 text-primary" /> Live Sandbox
                <span className="text-xs font-normal text-muted-foreground">— powered by StackBlitz</span>
              </CardTitle>
            </CardHeader>
            <div ref={embedRef} className="w-full" />
          </Card>
        )}

        {/* Feedback form (reviewer only, in_review status) */}
        {canSubmitFeedback && (
          <Card className="mb-6 glow-border">
            <CardHeader>
              <CardTitle className="font-mono text-lg">Submit Your Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Rating *</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= (hoverRating || rating)
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback *</Label>
                <Textarea
                  id="feedback"
                  placeholder="Share your detailed review: what's good, what could improve, suggestions..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
              <Button
                variant="hero"
                className="w-full gap-2"
                onClick={handleSubmitFeedback}
                disabled={submitFeedback.isPending}
              >
                <Send className="h-4 w-4" />
                {submitFeedback.isPending ? "Submitting..." : "Submit Review"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Completed feedback display */}
        {review.status === "completed" && review.reviewer_feedback && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="font-mono text-lg">Reviewer Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {review.reviewer_rating && (
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= review.reviewer_rating!
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              )}
              <p className="text-sm text-foreground whitespace-pre-wrap">{review.reviewer_feedback}</p>
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ReviewDetail;
