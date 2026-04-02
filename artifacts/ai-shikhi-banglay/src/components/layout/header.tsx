import { Link, useLocation } from "wouter";
import { Menu, X, Youtube, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { useNavItems } from "@/lib/useNavItems";
import { useTheme } from "@/lib/useTheme";

const DEFAULT_LOGO = `${import.meta.env.BASE_URL}logo.svg`;
const DEFAULT_BRAND = "AI শিখি বাংলায়";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { settings } = useSiteSettings();
  const { bySection } = useNavItems();
  const { isDark, toggle } = useTheme();

  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 20); };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-update favicon when logo changes
  useEffect(() => {
    if (!settings.logo_url) return;
    const existing = document.querySelectorAll<HTMLLinkElement>("link[rel='icon'], link[rel='apple-touch-icon']");
    existing.forEach((el) => { el.href = settings.logo_url; });
  }, [settings.logo_url]);

  const navLinks = bySection("navbar");
  const subscribeUrl = settings.youtube_subscribe_url || settings.youtube_channel_url || "#";
  const brandName = settings.brand_name || DEFAULT_BRAND;
  const logoUrl = settings.logo_url || DEFAULT_LOGO;

  // Split brand name for styling: last word gets primary colour
  const parts = brandName.trim().split(" ");
  const lastWord = parts.pop() ?? "";
  const firstPart = parts.join(" ");

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <img
            src={logoUrl}
            alt={`${brandName} লোগো`}
            className="w-9 h-9 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.7)] transition-all duration-200"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = DEFAULT_LOGO; }}
          />
          <span className="font-bold text-xl tracking-tight text-foreground dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:to-white/70">
            {firstPart && <>{firstPart} </>}
            <span className="text-primary">{lastWord}</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location === link.href;
            const linkProps = link.openInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {};
            if (link.openInNewTab) {
              return (
                <a
                  key={link.id}
                  href={link.href}
                  {...linkProps}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary hover:bg-primary/10 ${
                    isActive ? "text-primary bg-primary/10" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </a>
              );
            }
            return (
              <Link
                key={link.id}
                href={link.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary hover:bg-primary/10 ${
                  isActive ? "text-primary bg-primary/10" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <button
            onClick={toggle}
            aria-label={isDark ? "লাইট মোড চালু করুন" : "ডার্ক মোড চালু করুন"}
            className="ml-1 w-9 h-9 flex items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
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
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
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
            {navLinks.map((link) => {
              const isActive = location === link.href;
              if (link.openInNewTab) {
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                      isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </a>
                );
              }
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? "text-primary bg-primary/10" 
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
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
