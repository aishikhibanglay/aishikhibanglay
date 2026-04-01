import { Link, useLocation } from "wouter";
import { Menu, X, Brain } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "হোম", path: "/" },
    { name: "ব্লগ", path: "/blog" },
    { name: "AI টুলস", path: "/tools" },
    { name: "আমাদের সম্পর্কে", path: "/about" },
    { name: "যোগাযোগ", path: "/contact" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Brain className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            AI শিখি <span className="text-primary">বাংলায়</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary hover:bg-primary/10 ${
                location === link.path ? "text-primary bg-primary/10" : "text-muted-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Button className="ml-4" data-testid="button-subscribe-header">
            সাবস্ক্রাইব করুন
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border shadow-lg animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  location === link.path 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Button className="mt-2 w-full" data-testid="button-subscribe-mobile">
              সাবস্ক্রাইব করুন
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
