import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

export const Navbar = () => {
  const { theme, toggle } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gold-gradient flex items-center justify-center font-black text-midnight">C</div>
          <span className="font-bold text-lg tracking-tight">CryptoVault</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition">Features</a>
          <a href="#plans" className="text-muted-foreground hover:text-foreground transition">Plans</a>
          <a href="#traders" className="text-muted-foreground hover:text-foreground transition">Copy Trading</a>
          <a href="#calculator" className="text-muted-foreground hover:text-foreground transition">Calculator</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user ? (
            <Button variant="gold" size="sm" onClick={() => navigate("/dashboard")}>Dashboard</Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={() => navigate("/login")}>Login</Button>
              <Button variant="gold" size="sm" onClick={() => navigate("/signup")}>Sign Up</Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border/40 px-4 py-3 flex flex-col gap-3 text-sm">
          <a href="#features" onClick={() => setOpen(false)}>Features</a>
          <a href="#plans" onClick={() => setOpen(false)}>Plans</a>
          <a href="#traders" onClick={() => setOpen(false)}>Copy Trading</a>
          <a href="#calculator" onClick={() => setOpen(false)}>Calculator</a>
        </div>
      )}
    </header>
  );
};