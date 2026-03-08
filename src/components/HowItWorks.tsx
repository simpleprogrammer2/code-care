import { Upload, MessageSquareCode, DollarSign } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Submit your code",
    description: "Paste a code snippet or link your repo. Add context about what you need reviewed.",
    terminal: "$ git push origin feature/auth",
  },
  {
    icon: MessageSquareCode,
    title: "Get expert feedback",
    description: "A reviewer picks up your request and provides detailed, actionable feedback.",
    terminal: "$ review --status: in-progress",
  },
  {
    icon: DollarSign,
    title: "Pay what you want",
    description: "Satisfied? Pay any amount you feel the review was worth. No minimums, no pressure.",
    terminal: "$ tip --amount $YOUR_CHOICE",
  },
];

const HowItWorks = () => {
  return (
    <section className="border-t border-border bg-surface py-24">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            How it <span className="text-primary">works</span>
          </h2>
          <p className="text-muted-foreground">Three steps. No complexity.</p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="group relative rounded-xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:glow-border"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <step.icon className="h-6 w-6" />
              </div>

              <div className="mb-2 font-mono text-xs text-muted-foreground">
                // step {i + 1}
              </div>
              <h3 className="mb-3 font-mono text-xl font-bold text-foreground">{step.title}</h3>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{step.description}</p>

              <div className="rounded-md bg-background px-3 py-2 font-mono text-xs text-primary/70">
                {step.terminal}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
