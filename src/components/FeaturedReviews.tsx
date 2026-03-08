import { Star, Clock, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const reviews = [
  {
    id: 1,
    title: "React Auth Hook Refactor",
    language: "TypeScript",
    author: "sarah_dev",
    reviewer: "mike_senior",
    rating: 5,
    tip: "$25",
    status: "completed",
    snippet: "useAuth() custom hook with refresh token logic",
  },
  {
    id: 2,
    title: "Python FastAPI Endpoint",
    language: "Python",
    author: "code_ninja",
    reviewer: "py_master",
    rating: 5,
    tip: "$15",
    status: "completed",
    snippet: "REST API with Pydantic validation & error handling",
  },
  {
    id: 3,
    title: "Go Concurrency Pattern",
    language: "Go",
    author: "gopher42",
    reviewer: "go_guru",
    rating: 4,
    tip: "$30",
    status: "completed",
    snippet: "Worker pool pattern with graceful shutdown",
  },
];

const FeaturedReviews = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Recent <span className="text-primary">reviews</span>
          </h2>
          <p className="text-muted-foreground">See what the community is building and reviewing.</p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:glow-border"
            >
              <div className="mb-4 flex items-center justify-between">
                <Badge variant="secondary" className="font-mono text-xs">
                  {review.language}
                </Badge>
                <span className="font-mono text-lg font-bold text-primary">{review.tip}</span>
              </div>

              <h3 className="mb-2 font-mono text-base font-semibold text-foreground">{review.title}</h3>

              <div className="mb-4 rounded-md bg-background px-3 py-2 font-mono text-xs text-muted-foreground">
                <Code2 className="mr-1 inline h-3 w-3 text-primary" />
                {review.snippet}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>@{review.author} → @{review.reviewer}</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedReviews;
