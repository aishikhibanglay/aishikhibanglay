import { motion } from "framer-motion";
import { ExternalLink, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageSEO } from "@/components/PageSEO";

const tools = [
  {
    id: 1,
    name: "ChatGPT",
    company: "OpenAI",
    badge: "Free / Paid",
    rating: 5.0,
    description: "সবচেয়ে জনপ্রিয় এআই চ্যাটবট। টেক্সট লেখা, কোডিং করা, অনুবাদ করা থেকে শুরু করে যেকোনো প্রশ্নের উত্তর দিতে সক্ষম।",
    image: "bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400"
  },
  {
    id: 2,
    name: "Google Gemini",
    company: "Google",
    badge: "Free",
    rating: 4.5,
    description: "গুগলের শক্তিশালী এআই মডেল। রিয়েল-টাইম তথ্যের জন্য সেরা। এর সাথে গুগল ডক্স এবং জিমেইল ইন্টিগ্রেশন রয়েছে।",
    image: "bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-400"
  },
  {
    id: 3,
    name: "Claude",
    company: "Anthropic",
    badge: "Free / Paid",
    rating: 4.5,
    description: "নিরাপদ এবং অত্যন্ত বুদ্ধিমান এআই অ্যাসিস্ট্যান্ট। বড় ডকুমেন্ট পড়া এবং সামারাইজ করার জন্য চ্যাটজিপিটির চেয়েও ভালো।",
    image: "bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400"
  },
  {
    id: 4,
    name: "Midjourney",
    company: "Midjourney Inc.",
    badge: "Paid",
    rating: 5.0,
    description: "টেক্সট থেকে হাই-কোয়ালিটি ছবি তৈরি করার সেরা টুল। প্রফেশনাল গ্রাফিক্স এবং আর্টওয়ার্ক তৈরির জন্য অতুলনীয়।",
    image: "bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 text-purple-400"
  },
  {
    id: 5,
    name: "Perplexity AI",
    company: "Perplexity",
    badge: "Free / Paid",
    rating: 4.0,
    description: "এআই চালিত সার্চ ইঞ্জিন। যেকোনো প্রশ্নের সুনির্দিষ্ট উত্তর দেয় এবং সাথে সোর্স লিঙ্ক যুক্ত করে দেয়। রিসার্চের জন্য সেরা।",
    image: "bg-gradient-to-br from-cyan-500/20 to-sky-500/20 text-cyan-400"
  },
  {
    id: 6,
    name: "ElevenLabs",
    company: "ElevenLabs",
    badge: "Free / Paid",
    rating: 4.0,
    description: "টেক্সট থেকে মানুষের মতো বাস্তব ভয়েস তৈরি করার টুল। ভিডিওর জন্য প্রফেশনাল ভয়েসওভার বানাতে দারুণ কার্যকরী।",
    image: "bg-gradient-to-br from-rose-500/20 to-pink-500/20 text-rose-400"
  }
];

export default function Tools() {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />);
      } else if (i === fullStars && hasHalfStar) {
        // Simple representation for half star
        stars.push(<Star key={i} className="w-4 h-4 fill-amber-400/50 text-amber-400" />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-muted" />);
      }
    }
    return stars;
  };

  return (
    <div className="min-h-screen py-12 md:py-20">
      <PageSEO
        title="AI টুলস"
        canonical="/tools"
        description="সেরা AI টুলসের তালিকা বাংলায়। ChatGPT, Gemini, Claude, Midjourney সহ সব জনপ্রিয় আর্টিফিশিয়াল ইন্টেলিজেন্স টুলস রিভিউ।"
      />
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">সেরা <span className="text-primary">AI টুলস</span></h1>
          <p className="text-lg text-muted-foreground">
            আপনার কাজকে আরও সহজ এবং দ্রুত করতে সেরা কিছু আর্টিফিশিয়াল ইন্টেলিজেন্স টুলের তালিকা।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, idx) => (
            <motion.div 
              key={tool.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col hover:border-primary/40 hover:shadow-lg transition-all"
            >
              <div className={`h-32 ${tool.image} flex flex-col justify-center px-6 relative`}>
                <h3 className="text-2xl font-bold text-white drop-shadow-md">{tool.name}</h3>
                <p className="text-white/80 font-medium text-sm">{tool.company}</p>
                <div className="absolute top-4 right-4 bg-background/50 backdrop-blur-md border border-white/10 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                  {tool.badge}
                </div>
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center gap-1 mb-4">
                  {renderStars(tool.rating)}
                  <span className="text-sm text-muted-foreground ml-2">{tool.rating}/5.0</span>
                </div>
                
                <p className="text-muted-foreground mb-6 flex-grow">
                  {tool.description}
                </p>
                
                <Button className="w-full gap-2 mt-auto" variant="secondary">
                  ওয়েবসাইট ভিজিট করুন <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}