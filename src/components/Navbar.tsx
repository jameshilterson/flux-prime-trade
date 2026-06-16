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
      <div className="container flex h-16 items-center justify-between md:justify-between">
        {/* Mobile: hamburger on left, logo centered. Desktop: logo left + nav */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        <Link
          to="/"
          className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
        >
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center font-black text-primary-foreground">C</div>
          <span className="font-bold text-lg tracking-tight">CryptoVault</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#about" className="text-muted-foreground hover:text-foreground transition">About</a>
          <a href="#services" className="text-muted-foreground hover:text-foreground transition">Services</a>
          <a href="#plans" className="text-muted-foreground hover:text-foreground transition">Plans</a>
          <a href="#traders" className="text-muted-foreground hover:text-foreground transition">Copy Trading</a>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <Button size="sm" onClick={() => navigate("/dashboard")}>Dashboard</Button>
          ) : (
            <>
              {/* Sign In: desktop only — removed from mobile per spec */}
              <Button variant="ghost" size="sm" className="hidden md:inline-flex" onClick={() => navigate("/login")}>Sign In</Button>
              <Button size="sm" className="hidden md:inline-flex" onClick={() => navigate("/signup")}>Sign Up</Button>
            </>
          )}
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border px-4 py-3 flex flex-col gap-3 text-sm bg-background">
          <a href="#about" onClick={() => setOpen(false)}>About</a>
          <a href="#services" onClick={() => setOpen(false)}>Services</a>
          <a href="#plans" onClick={() => setOpen(false)}>Plans</a>
          <a href="#traders" onClick={() => setOpen(false)}>Copy Trading</a>
          {!user && (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="text-muted-foreground">Sign In</Link>
              <Link to="/signup" onClick={() => setOpen(false)} className="font-semibold text-primary">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
