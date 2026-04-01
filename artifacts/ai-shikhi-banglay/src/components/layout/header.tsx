import { Link, useLocation } from "wouter";
import { Menu, X, Youtube, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { useTheme } from "@/lib/useTheme";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { settings } = useSiteSettings();
  const { isDark, toggle } = useTheme();

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

  const subscribeUrl = settings.youtube_subscribe_url || settings.youtube_channel_url || "#";

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <img
            src={`${import.meta.env.BASE_URL}logo.svg`}
            alt="AI শিখি বাংলায় লোগো"
            className="w-9 h-9 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.7)] transition-all duration-200"
          />
          <span className="font-bold text-xl tracking-tight text-foreground dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:to-white/70">
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

          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label={isDark ? "লাইট মোড চালু করুন" : "ডার্ক মোড চালু করুন"}
            className="ml-1 w-9 h-9 flex items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
          >
            {isDark
              ? <Sun className="w-4 h-4" />
              : <Moon className="w-4 h-4" />
            }
          </button>

          <a
            href={subscribeUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="button-subscribe-header"
          >
            <Button className="ml-3 gap-2">
              <Youtube className="w-4 h-4" />
              সাবস্ক্রাইব করুন
            </Button>
          </a>
        </nav>

        {/* Mobile: theme toggle + hamburger */}
        <div className="md:hidden flex items-center gap-1">
          <button
            onClick={toggle}
            aria-label={isDark ? "লাইট মোড" : "ডার্ক মোড"}
            className="w-9 h-9 flex items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
          >
            {isDark
              ? <Sun className="w-4 h-4" />
              : <Moon className="w-4 h-4" />
            }
          </button>
          <button 
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
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
            <a
              href={subscribeUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="button-subscribe-mobile"
            >
              <Button className="mt-2 w-full gap-2">
                <Youtube className="w-4 h-4" />
                সাবস্ক্রাইব করুন
              </Button>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
