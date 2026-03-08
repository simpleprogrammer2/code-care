import { Code2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <Code2 className="h-6 w-6 text-primary" />
          <span className="font-mono text-lg font-bold tracking-tight text-foreground">
            code<span className="text-primary">review</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link to="/browse" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Browse Reviews
          </Link>
          <Link to="/submit" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Get a Review
          </Link>
          <Link to="/how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            How It Works
          </Link>
          <Button variant="hero" size="sm">
            Sign Up
          </Button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link to="/browse" className="text-sm text-muted-foreground" onClick={() => setOpen(false)}>
              Browse Reviews
            </Link>
            <Link to="/submit" className="text-sm text-muted-foreground" onClick={() => setOpen(false)}>
              Get a Review
            </Link>
            <Link to="/how-it-works" className="text-sm text-muted-foreground" onClick={() => setOpen(false)}>
              How It Works
            </Link>
            <Button variant="hero" size="sm" className="w-full">
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
