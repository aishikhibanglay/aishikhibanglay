import { Link } from "wouter";
import { SiYoutube, SiFacebook, SiX } from "react-icons/si";
import { Brain } from "lucide-react";

export function Footer() {
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
              আপনার মাতৃভাষায় আর্টিফিশিয়াল ইন্টেলিজেন্স শেখার বিশ্বস্ত প্ল্যাটফর্ম। 
              ভবিষ্যতের প্রযুক্তির সাথে তাল মিলিয়ে চলতে আমাদের সাথেই থাকুন।
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/20 transition-all" data-testid="link-youtube-footer">
                <SiYoutube className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/20 transition-all" data-testid="link-facebook-footer">
                <SiFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/20 transition-all" data-testid="link-x-footer">
                <SiX className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-foreground">গুরুত্বপূর্ণ পেজ</h3>
            <ul className="space-y-3">
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">ব্লগ</Link></li>
              <li><Link href="/tools" className="text-muted-foreground hover:text-primary transition-colors">AI টুলস</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">আমাদের সম্পর্কে</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">যোগাযোগ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-foreground">আইনি তথ্য</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">প্রাইভেসি পলিসি</Link></li>
              <li><Link href="/terms-and-conditions" className="text-muted-foreground hover:text-primary transition-colors">শর্তাবলী</Link></li>
              <li><Link href="/disclaimer" className="text-muted-foreground hover:text-primary transition-colors">দাবিত্যাগ (Disclaimer)</Link></li>
              <li><Link href="/cookie-policy" className="text-muted-foreground hover:text-primary transition-colors">কুকি পলিসি</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; 2025 AI শিখি বাংলায়। সর্বস্বত্ব সংরক্ষিত।</p>
          <p>তৈরি করা হয়েছে ভালোবাসার সাথে, বাংলাদেশের জন্য।</p>
        </div>
      </div>
    </footer>
  );
}