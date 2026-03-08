import { Code2, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    navigate("/");
  };

  const navLinks = [
    { to: "/browse", label: "Browse Reviews" },
    { to: "/submit", label: "Get a Review" },
  ];

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
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-muted-foreground">{user.email}</span>
              <Button variant="secondary" size="sm" onClick={handleSignOut} className="gap-1">
                <LogOut className="h-3 w-3" /> Sign Out
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="hero" size="sm">Sign Up</Button>
            </Link>
          )}
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="text-sm text-muted-foreground" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            {user ? (
              <Button variant="secondary" size="sm" className="w-full gap-1" onClick={() => { handleSignOut(); setOpen(false); }}>
                <LogOut className="h-3 w-3" /> Sign Out
              </Button>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)}>
                <Button variant="hero" size="sm" className="w-full">Sign Up</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
