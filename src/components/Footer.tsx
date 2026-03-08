import { Code2 } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-background py-12">
    <div className="container mx-auto flex flex-col items-center gap-4 px-6 text-center">
      <div className="flex items-center gap-2">
        <Code2 className="h-5 w-5 text-primary" />
        <span className="font-mono text-sm font-bold text-foreground">
          code<span className="text-primary">review</span>
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        © 2026 codereview. Pay what you want for expert code reviews.
      </p>
    </div>
  </footer>
);

export default Footer;
