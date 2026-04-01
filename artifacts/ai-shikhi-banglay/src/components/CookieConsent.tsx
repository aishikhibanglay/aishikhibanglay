import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Link } from "wouter";

const STORAGE_KEY = "ai_shikhi_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      // Small delay so it doesn't flash immediately on load
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function handleDismiss() {
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          role="dialog"
          aria-label="Cookie consent banner"
          data-testid="banner-cookie-consent"
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl shadow-2xl shadow-black/40 p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Cookie className="w-5 h-5 text-primary" />
            </div>

            {/* Text */}
            <p className="flex-1 text-sm text-muted-foreground leading-relaxed">
              আমরা আপনার অভিজ্ঞতা উন্নত করতে এবং বিজ্ঞাপন দেখাতে কুকি ব্যবহার করি।{" "}
              <Link href="/cookie-policy">
                <span
                  data-testid="link-cookie-policy"
                  className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity cursor-pointer"
                >
                  আরও জানুন
                </span>
              </Link>
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                data-testid="button-cookie-accept"
                onClick={handleAccept}
                className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
              >
                সম্মতি দিন
              </button>
              <button
                data-testid="button-cookie-dismiss"
                onClick={handleDismiss}
                aria-label="বন্ধ করুন"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
