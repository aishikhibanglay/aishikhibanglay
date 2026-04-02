import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Star, Loader2 } from "lucide-react";
import { PageSEO } from "@/components/PageSEO";

interface AiTool {
  id: number;
  name: string;
  company: string;
  badge: string;
  rating: number;
  description: string;
  websiteUrl: string;
  gradientClass: string;
  displayOrder: number;
}

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, i) => {
    if (i < Math.floor(rating)) {
      return <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />;
    } else if (i === Math.floor(rating) && rating % 1 !== 0) {
      return <Star key={i} className="w-4 h-4 fill-amber-400/50 text-amber-400" />;
    }
    return <Star key={i} className="w-4 h-4 text-muted-foreground/30" />;
  });
}

export default function Tools() {
  const [tools, setTools] = useState<AiTool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tools-data")
      .then((r) => r.json())
      .then((data) => setTools(Array.isArray(data) ? data : []))
      .catch(() => setTools([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen py-12 md:py-20">
      <PageSEO
        title="AI টুলস"
        canonical="/tools"
        description="সেরা AI টুলসের তালিকা বাংলায়। ChatGPT, Gemini, Claude, Midjourney সহ সব জনপ্রিয় আর্টিফিশিয়াল ইন্টেলিজেন্স টুলস রিভিউ।"
      />
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            সেরা <span className="text-primary">AI টুলস</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            আপনার কাজকে আরও সহজ এবং দ্রুত করতে সেরা কিছু আর্টিফিশিয়াল ইন্টেলিজেন্স টুলের তালিকা।
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, idx) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col hover:border-primary/40 hover:shadow-lg transition-all"
              >
                {/* Card Header */}
                <div className={`h-32 ${tool.gradientClass} flex flex-col justify-center px-6 relative`}>
                  <h3 className="text-2xl font-bold text-white drop-shadow-md">{tool.name}</h3>
                  <p className="text-white/80 font-medium text-sm">{tool.company}</p>
                  {tool.badge && (
                    <div className="absolute top-4 right-4 bg-background/50 backdrop-blur-md border border-white/10 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                      {tool.badge}
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center gap-1 mb-4">
                    {renderStars(tool.rating)}
                    <span className="text-sm text-muted-foreground ml-2">{tool.rating.toFixed(1)}/5.0</span>
                  </div>

                  <p className="text-muted-foreground mb-6 flex-grow leading-relaxed">
                    {tool.description}
                  </p>

                  {tool.websiteUrl ? (
                    <a
                      href={tool.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 mt-auto bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      ওয়েবসাইট ভিজিট করুন <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <div className="w-full flex items-center justify-center gap-2 mt-auto bg-secondary/40 text-secondary-foreground/50 px-4 py-2.5 rounded-lg text-sm cursor-not-allowed">
                      লিঙ্ক পাওয়া যায়নি
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
