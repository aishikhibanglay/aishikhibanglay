import { motion } from "framer-motion";
import { Brain, Youtube, Users, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 text-primary mb-8">
            <Brain className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            আমাদের <span className="text-primary">সম্পর্কে</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            "AI শিখি বাংলায়" হলো একটি শিক্ষামূলক প্ল্যাটফর্ম যার মূল লক্ষ্য হলো বাংলা ভাষাভাষী মানুষদের আর্টিফিশিয়াল ইন্টেলিজেন্স বা কৃত্রিম বুদ্ধিমত্তার সাথে পরিচয় করিয়ে দেওয়া।
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-border p-8 rounded-3xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <Target className="w-32 h-32" />
            </div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Target className="w-6 h-6 text-primary" /> আমাদের লক্ষ্য
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              আমরা চাই ভাষা যেন প্রযুক্তির শেখার পথে কোনো বাধা না হয়। বিশ্বের সবচেয়ে আধুনিক ও যুগান্তকারী প্রযুক্তি 'AI' যেন প্রতিটি বাঙালি নিজের মাতৃভাষায় শিখতে পারে এবং নিজের ক্যারিয়ার ও দৈনন্দিন জীবনে কাজে লাগাতে পারে, সেটিই আমাদের মূল লক্ষ্য।
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card border border-border p-8 rounded-3xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <Zap className="w-32 h-32" />
            </div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Zap className="w-6 h-6 text-primary" /> কেন আমরা আলাদা?
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              আমরা শুধু তাত্ত্বিক জ্ঞান নয়, বরং প্র্যাকটিক্যাল প্রয়োগে বিশ্বাস করি। আমাদের প্রতিটি কন্টেন্ট এমনভাবে তৈরি করা হয় যেন একজন সম্পূর্ণ নতুন মানুষও খুব সহজে বিষয়গুলো বুঝতে পারে এবং ব্যবহার করতে পারে।
            </p>
          </motion.div>
        </div>

        {/* Audience Section */}
        <div className="max-w-4xl mx-auto mb-24 text-center">
          <h2 className="text-3xl font-bold mb-10">এটি কাদের জন্য?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-secondary/50 border border-border">
              <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">শিক্ষার্থী</h3>
              <p className="text-muted-foreground text-sm">যারা ভবিষ্যতের প্রযুক্তির সাথে নিজেদের প্রস্তুত করতে চায়।</p>
            </div>
            <div className="p-6 rounded-2xl bg-secondary/50 border border-border">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">প্রফেশনাল</h3>
              <p className="text-muted-foreground text-sm">যারা AI ব্যবহার করে কর্মক্ষেত্রে নিজের প্রোডাক্টিভিটি বাড়াতে চান।</p>
            </div>
            <div className="p-6 rounded-2xl bg-secondary/50 border border-border">
              <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">ফ্রি্ল্যান্সার</h3>
              <p className="text-muted-foreground text-sm">যারা নতুন স্কিল শিখে অনলাইনে নিজেদের আয় বাড়াতে চান।</p>
            </div>
          </div>
        </div>

        {/* YouTube Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-red-500/10 via-background to-background border border-red-500/20 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
        >
          <div className="relative z-10">
            <Youtube className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">আমাদের ইউটিউব চ্যানেল</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              ভিডিও টিউটোরিয়ালের মাধ্যমে আরও সহজে শিখতে আমাদের ইউটিউব চ্যানেলে সাবস্ক্রাইব করুন। সেখানে আমরা নিয়মিত নতুন টুল ও ট্রিকস শেয়ার করি।
            </p>
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white gap-2 font-semibold px-8" data-testid="button-subscribe-youtube">
              <Youtube className="w-5 h-5" /> সাবস্ক্রাইব করুন
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}