import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, Globe } from "lucide-react";
import { SiYoutube, SiFacebook, SiX, SiInstagram, SiTiktok, SiGithub } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { PageSEO } from "@/components/PageSEO";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSocialLinks } from "@/lib/useSocialLinks";

function getSocialIcon(icon: string): React.ElementType {
  const map: Record<string, React.ElementType> = {
    youtube: SiYoutube,
    facebook: SiFacebook,
    twitter: SiX,
    instagram: SiInstagram,
    tiktok: SiTiktok,
    linkedin: Globe,
    github: SiGithub,
    link: Globe,
  };
  return map[icon] ?? Globe;
}

function getSocialHoverClass(icon: string): string {
  const map: Record<string, string> = {
    youtube: "hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30",
    facebook: "hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30",
    twitter: "hover:bg-neutral-400/10 hover:text-white hover:border-neutral-500/30",
    instagram: "hover:bg-pink-500/10 hover:text-pink-400 hover:border-pink-500/30",
    tiktok: "hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/30",
    linkedin: "hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30",
    github: "hover:bg-purple-500/10 hover:text-purple-400 hover:border-purple-500/30",
  };
  return map[icon] ?? "hover:bg-primary/10 hover:text-primary hover:border-primary/30";
}

const CONTACT_EMAIL = "contact@aishikhibanglay.com";

export default function Contact() {
  const { links: socialLinks } = useSocialLinks();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setStatus("success");
        setName(""); setEmail(""); setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen py-12 md:py-20">
      <PageSEO
        title="যোগাযোগ"
        canonical="/contact"
        description="AI শিখি বাংলায়-এর সাথে যোগাযোগ করুন। আপনার প্রশ্ন, মতামত বা পরামর্শ জানাতে আমাদের সাথে সংযুক্ত হন।"
      />
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-primary">যোগাযোগ</span> করুন
          </h1>
          <p className="text-lg text-muted-foreground">
            আপনার যেকোনো প্রশ্ন, মতামত বা পরামর্শ আমাদের জানাতে পারেন। আমরা দ্রুততম সময়ের মধ্যে উত্তর দেওয়ার চেষ্টা করব।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {/* ── Left: Contact Info ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Email Card */}
            <div className="bg-card border border-border p-6 rounded-2xl">
              <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" /> ইমেইল
              </h3>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="group flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-primary/10 border border-border hover:border-primary/30 transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium group-hover:text-primary transition-colors break-all">
                  {CONTACT_EMAIL}
                </span>
              </a>
            </div>

            {/* Social Media Card */}
            {socialLinks.length > 0 && (
              <div className="bg-card border border-border p-6 rounded-2xl">
                <h3 className="text-base font-semibold mb-4">সোশ্যাল মিডিয়া</h3>
                <div className="space-y-2.5">
                  {socialLinks.map((link) => {
                    const Icon = getSocialIcon(link.icon);
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/50 border border-border transition-all ${getSocialHoverClass(link.icon)}`}
                      >
                        <Icon className="w-4 h-4 text-muted-foreground group-hover:text-current transition-colors shrink-0" />
                        <span className="font-medium text-sm">{link.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>

          {/* ── Right: Contact Form ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-3 bg-card border border-border p-8 rounded-3xl"
          >
            <h2 className="text-2xl font-bold mb-1">বার্তা পাঠান</h2>
            <p className="text-sm text-muted-foreground mb-7">
              ফর্মটি পূরণ করুন — আমরা যত দ্রুত সম্ভব উত্তর দেব।
            </p>

            {status === "success" ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-8 rounded-2xl flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Send className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">বার্তা পাঠানো হয়েছে!</h3>
                  <p className="text-emerald-400/80 text-sm">
                    আপনার বার্তার জন্য ধন্যবাদ। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।
                  </p>
                </div>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-xs text-emerald-400/60 hover:text-emerald-400 transition-colors underline underline-offset-2"
                >
                  আরেকটি বার্তা পাঠান
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="text-sm font-medium">
                    আপনার নাম <span className="text-red-400">*</span>
                  </label>
                  <Input
                    id="contact-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="যেমন: রহিম ইসলাম"
                    required
                    className="bg-background h-11"
                    data-testid="input-contact-name"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-sm font-medium">
                    ইমেইল এড্রেস <span className="text-red-400">*</span>
                  </label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="যেমন: rahim@example.com"
                    required
                    className="bg-background h-11"
                    data-testid="input-contact-email"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="text-sm font-medium">
                    আপনার বার্তা <span className="text-red-400">*</span>
                  </label>
                  <Textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="কী জানতে চান বা জানাতে চান তা এখানে লিখুন..."
                    required
                    rows={5}
                    className="bg-background resize-none"
                    data-testid="textarea-contact-message"
                  />
                </div>

                {status === "error" && (
                  <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                    বার্তা পাঠাতে সমস্যা হয়েছে। সরাসরি ইমেইল করুন:{" "}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
                      {CONTACT_EMAIL}
                    </a>
                  </p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2 h-11"
                  disabled={status === "sending"}
                  data-testid="button-submit-contact"
                >
                  {status === "sending" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      পাঠানো হচ্ছে...
                    </>
                  ) : (
                    <>
                      বার্তা পাঠান <Send className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
