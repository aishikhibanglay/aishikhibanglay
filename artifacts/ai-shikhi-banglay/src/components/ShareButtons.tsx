import { useState } from "react";
import { Link2, Check, Share2 } from "lucide-react";
import { SiFacebook, SiX, SiWhatsapp, SiTelegram } from "react-icons/si";

interface ShareButtonsProps {
  title: string;
  url?: string;
}

interface Platform {
  key: string;
  label: string;
  icon: React.ElementType;
  color: string;
  getUrl: (url: string, title: string) => string;
}

const PLATFORMS: Platform[] = [
  {
    key: "facebook",
    label: "Facebook",
    icon: SiFacebook,
    color: "hover:bg-blue-600 hover:border-blue-600 hover:text-white",
    getUrl: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    key: "twitter",
    label: "X (Twitter)",
    icon: SiX,
    color: "hover:bg-black hover:border-black hover:text-white",
    getUrl: (url, title) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: SiWhatsapp,
    color: "hover:bg-green-600 hover:border-green-600 hover:text-white",
    getUrl: (url, title) =>
      `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`,
  },
  {
    key: "telegram",
    label: "Telegram",
    icon: SiTelegram,
    color: "hover:bg-sky-500 hover:border-sky-500 hover:text-white",
    getUrl: (url, title) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
];

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
      } catch {
        // user cancelled or error — ignore
      }
      return;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openShare = (platform: Platform) => {
    window.open(platform.getUrl(shareUrl, title), "_blank", "noopener,width=600,height=500");
  };

  const hasNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <div className="mt-10 pt-8 border-t border-border">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold text-muted-foreground flex items-center gap-2 shrink-0">
          <Share2 className="w-4 h-4" />
          শেয়ার করুন:
        </span>

        {/* Native share on mobile */}
        {hasNativeShare && (
          <button
            onClick={handleNativeShare}
            className="md:hidden inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium transition-all hover:opacity-90 active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            শেয়ার
          </button>
        )}

        {/* Platform buttons — always shown on desktop, also on mobile for choice */}
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((platform) => {
            const Icon = platform.icon;
            return (
              <button
                key={platform.key}
                onClick={() => openShare(platform)}
                title={`${platform.label}-এ শেয়ার করুন`}
                aria-label={`${platform.label}-এ শেয়ার করুন`}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-card text-muted-foreground text-sm font-medium transition-all duration-200 active:scale-95 ${platform.color}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">{platform.label}</span>
              </button>
            );
          })}

          {/* Copy link */}
          <button
            onClick={handleCopy}
            title="লিংক কপি করুন"
            aria-label="লিংক কপি করুন"
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all duration-200 text-sm font-medium active:scale-95 ${
              copied
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                : "border-border bg-card text-muted-foreground hover:bg-primary/10 hover:border-primary/30 hover:text-primary"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">কপি হয়েছে!</span>
              </>
            ) : (
              <>
                <Link2 className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">লিংক কপি</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
