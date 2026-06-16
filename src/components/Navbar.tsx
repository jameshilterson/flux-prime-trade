import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

export const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gold-gradient flex items-center justify-center font-black text-midnight">C</div>
          <span className="font-bold text-lg tracking-tight">CryptoVault</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#about" className="text-muted-foreground hover:text-foreground transition">About</a>
          <a href="#features" className="text-muted-foreground hover:text-foreground transition">Features</a>
          <a href="#plans" className="text-muted-foreground hover:text-foreground transition">Plans</a>
          <a href="#traders" className="text-muted-foreground hover:text-foreground transition">Copy Trading</a>
          <a href="#calculator" className="text-muted-foreground hover:text-foreground transition">Calculator</a>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Button variant="gold" size="sm" onClick={() => navigate("/dashboard")}>Dashboard</Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>Sign In</Button>
              {/* Sign Up hidden on mobile */}
              <Button variant="gold" size="sm" className="hidden md:inline-flex" onClick={() => navigate("/signup")}>
                Sign Up
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border px-4 py-3 flex flex-col gap-3 text-sm bg-background">
          <a href="#about" onClick={() => setOpen(false)}>About</a>
          <a href="#features" onClick={() => setOpen(false)}>Features</a>
          <a href="#plans" onClick={() => setOpen(false)}>Plans</a>
          <a href="#traders" onClick={() => setOpen(false)}>Copy Trading</a>
          <a href="#calculator" onClick={() => setOpen(false)}>Calculator</a>
        </div>
      )}
    </header>
  );
};
