import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send } from "lucide-react";
import { SiYoutube, SiFacebook, SiX } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { PageSEO } from "@/components/PageSEO";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Reset after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen py-12 md:py-20">
      <PageSEO
        title="যোগাযোগ"
        canonical="/contact"
        description="AI শিখি বাংলায়-এর সাথে যোগাযোগ করুন। আপনার প্রশ্ন, মতামত বা পরামর্শ জানাতে আমাদের সাথে সংযুক্ত হন।"
      />
      <div className="container mx-auto px-4">
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

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="bg-card border border-border p-6 rounded-2xl">
              <h3 className="text-xl font-bold mb-6">যোগাযোগের মাধ্যম</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">ইমেইল</p>
                    <a href="mailto:contact@aishikhibanglay.com" className="text-muted-foreground hover:text-primary transition-colors">
                      contact@aishikhibanglay.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl">
              <h3 className="text-xl font-bold mb-6">সোশ্যাল মিডিয়া</h3>
              <div className="flex flex-wrap gap-4">
                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary hover:bg-red-500/10 hover:text-red-500 transition-colors group" data-testid="contact-social-youtube">
                  <SiYoutube className="w-5 h-5 text-muted-foreground group-hover:text-red-500 transition-colors" />
                  <span className="font-medium">ইউটিউব</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary hover:bg-blue-500/10 hover:text-blue-500 transition-colors group" data-testid="contact-social-facebook">
                  <SiFacebook className="w-5 h-5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                  <span className="font-medium">ফেসবুক</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary hover:bg-neutral-500/10 hover:text-white transition-colors group" data-testid="contact-social-x">
                  <SiX className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
                  <span className="font-medium">এক্স (টুইটার)</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3 bg-card border border-border p-8 rounded-3xl"
          >
            <h2 className="text-2xl font-bold mb-6">বার্তা পাঠান</h2>
            
            {isSuccess ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-6 rounded-xl flex items-center justify-center text-center flex-col gap-4 animate-in fade-in zoom-in duration-300">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Send className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">বার্তা পাঠানো হয়েছে!</h3>
                  <p className="text-emerald-500/80">আপনার বার্তার জন্য ধন্যবাদ। আমরা খুব শীঘ্রই আপনার সাথে যোগাযোগ করব।</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">আপনার নাম</label>
                  <Input 
                    id="name" 
                    placeholder="যেমন: রহিম ইসলাম" 
                    required 
                    className="bg-background h-12"
                    data-testid="input-contact-name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">ইমেইল এড্রেস</label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="যেমন: rahim@example.com" 
                    required 
                    className="bg-background h-12"
                    data-testid="input-contact-email"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">আপনার বার্তা</label>
                  <Textarea 
                    id="message" 
                    placeholder="কী জানতে চান বা জানাতে চান তা এখানে লিখুন..." 
                    required 
                    className="bg-background min-h-[150px] resize-y"
                    data-testid="textarea-contact-message"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full gap-2 text-md h-12" 
                  disabled={isSubmitting}
                  data-testid="button-submit-contact"
                >
                  {isSubmitting ? "পাঠানো হচ্ছে..." : (
                    <>বার্তা পাঠান <Send className="w-4 h-4" /></>
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