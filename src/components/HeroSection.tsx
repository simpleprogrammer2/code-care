import { ArrowRight, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center gradient-mesh overflow-hidden">
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container relative z-10 mx-auto px-6 pt-20">
        <div className="mx-auto max-w-4xl text-center">
          {/* Terminal badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 animate-slide-up">
            <Terminal className="h-4 w-4 text-primary" />
            <span className="font-mono text-xs text-muted-foreground">
              <span className="text-primary">$</span> code-review --start
            </span>
          </div>

          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-foreground animate-slide-up md:text-7xl">
            Get your code
            <br />
            <span className="text-primary glow-text">reviewed by pros</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground animate-slide-up">
            Submit your code, get expert feedback, and pay what you think it's worth.
            No fixed prices. No subscriptions. Just great reviews.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 animate-slide-up sm:flex-row">
            <Link to="/submit">
              <Button variant="hero" size="lg" className="gap-2 text-base">
                Submit Code <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/browse">
              <Button variant="hero-outline" size="lg" className="text-base">
                Browse Reviews
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 border-t border-border pt-10">
            {[
              { value: "2,400+", label: "Reviews Done" },
              { value: "$18", label: "Avg. Tip" },
              { value: "4.9★", label: "Reviewer Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-mono text-2xl font-bold text-primary md:text-3xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
