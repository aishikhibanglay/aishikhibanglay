import { Link } from "wouter";
import { SiYoutube, SiFacebook, SiX, SiInstagram, SiTiktok } from "react-icons/si";
import { Brain } from "lucide-react";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { useNavItems, type NavItem } from "@/lib/useNavItems";

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

export function Footer() {
  const { settings } = useSiteSettings();
  const { bySection } = useNavItems();

  const mainLinks = bySection("footer_main");
  const legalLinks = bySection("footer_legal");

  const socialIcon = (
    url: string | undefined,
    icon: React.ReactNode,
    hoverClass: string,
    title: string,
    testId?: string
  ) => {
    if (url) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground ${hoverClass} transition-all`}
          data-testid={testId}
        >
          {icon}
        </a>
      );
    }
    return (
      <span className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground/30" title={title}>
        {icon}
      </span>
    );
  };

  return (
    <footer className="bg-background border-t border-border pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                <Brain className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                AI শিখি <span className="text-primary">বাংলায়</span>
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm leading-relaxed">
              {settings.footer_description}
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              {socialIcon(settings.youtube_channel_url, <SiYoutube className="w-5 h-5" />, "hover:text-red-500 hover:bg-red-500/20", "YouTube লিংক এখনো সেট করা হয়নি", "link-youtube-footer")}
              {socialIcon(settings.facebook_url, <SiFacebook className="w-5 h-5" />, "hover:text-blue-500 hover:bg-blue-500/20", "Facebook লিংক এখনো সেট করা হয়নি", "link-facebook-footer")}
              {socialIcon(settings.twitter_url, <SiX className="w-4 h-4" />, "hover:text-primary hover:bg-primary/20", "X/Twitter লিংক এখনো সেট করা হয়নি", "link-x-footer")}
              {socialIcon(settings.instagram_url, <SiInstagram className="w-5 h-5" />, "hover:text-pink-500 hover:bg-pink-500/20", "Instagram লিংক এখনো সেট করা হয়নি", "link-instagram-footer")}
              {socialIcon(settings.tiktok_url, <SiTiktok className="w-4 h-4" />, "hover:text-foreground hover:bg-secondary/80", "TikTok লিংক এখনো সেট করা হয়নি", "link-tiktok-footer")}
            </div>
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
