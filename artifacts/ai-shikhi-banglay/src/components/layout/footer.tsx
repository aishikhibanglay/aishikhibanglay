import { Link } from "wouter";
import {
  SiYoutube,
  SiFacebook,
  SiX,
  SiInstagram,
  SiTiktok,
  SiGithub,
} from "react-icons/si";
import { Globe, Linkedin } from "lucide-react";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { useNavItems, type NavItem } from "@/lib/useNavItems";
import { useSocialLinks } from "@/lib/useSocialLinks";

// Map icon key → react element
function SocialIconEl({ icon, className }: { icon: string; className?: string }) {
  const cls = className ?? "w-5 h-5";
  switch (icon) {
    case "youtube":   return <SiYoutube className={cls} />;
    case "facebook":  return <SiFacebook className={cls} />;
    case "twitter":   return <SiX className={cls} />;
    case "instagram": return <SiInstagram className={cls} />;
    case "tiktok":    return <SiTiktok className={cls} />;
    case "linkedin":  return <Linkedin className={cls} />;
    case "github":    return <SiGithub className={cls} />;
    default:          return <Globe className={cls} />;
  }
}

// Hover colour per icon
function hoverClass(icon: string) {
  switch (icon) {
    case "youtube":   return "hover:text-red-500 hover:bg-red-500/20";
    case "facebook":  return "hover:text-blue-500 hover:bg-blue-500/20";
    case "twitter":   return "hover:text-foreground hover:bg-primary/20";
    case "instagram": return "hover:text-pink-500 hover:bg-pink-500/20";
    case "tiktok":    return "hover:text-foreground hover:bg-secondary/80";
    case "linkedin":  return "hover:text-blue-400 hover:bg-blue-400/20";
    case "github":    return "hover:text-foreground hover:bg-secondary/80";
    default:          return "hover:text-cyan-400 hover:bg-cyan-400/20";
  }
}

function FooterLink({ item }: { item: NavItem }) {
  if (item.openInNewTab) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-primary transition-colors"
      >
        {item.label}
      </a>
    );
  }
  return (
    <Link href={item.href} className="text-muted-foreground hover:text-primary transition-colors">
      {item.label}
    </Link>
  );
}

const DEFAULT_LOGO = "/logo.svg";
const DEFAULT_BRAND = "AI শিখি বাংলায়";

export function Footer() {
  const { settings } = useSiteSettings();
  const { bySection } = useNavItems();
  const { links: socialLinks } = useSocialLinks();

  const mainLinks  = bySection("footer_main");
  const legalLinks = bySection("footer_legal");

  const brandName = settings.brand_name || DEFAULT_BRAND;
  const logoUrl = settings.logo_url || DEFAULT_LOGO;

  const parts = brandName.trim().split(" ");
  const lastWord = parts.pop() ?? "";
  const firstPart = parts.join(" ");

  return (
    <footer className="bg-background border-t border-border pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img
                src={logoUrl}
                alt={`${brandName} লোগো`}
                className="w-8 h-8 rounded-lg object-contain"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = DEFAULT_LOGO; }}
              />
              <span className="font-bold text-xl tracking-tight">
                {firstPart && <>{firstPart} </>}
                <span className="text-primary">{lastWord}</span>
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm leading-relaxed">
              {settings.footer_description}
            </p>

            {/* Dynamic social links */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3 flex-wrap">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={link.label}
                    className={`w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground ${hoverClass(link.icon)} transition-all`}
                  >
                    <SocialIconEl icon={link.icon} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-foreground">
              {settings.footer_main_title || "গুরুত্বপূর্ণ পেজ"}
            </h3>
            <ul className="space-y-3">
              {mainLinks.map((item) => (
                <li key={item.id}>
                  <FooterLink item={item} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-foreground">
              {settings.footer_legal_title || "আইনি তথ্য"}
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((item) => (
                <li key={item.id}>
                  <FooterLink item={item} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {settings.footer_copyright}</p>
          <p>{settings.footer_tagline}</p>
        </div>
      </div>
    </footer>
  );
}
