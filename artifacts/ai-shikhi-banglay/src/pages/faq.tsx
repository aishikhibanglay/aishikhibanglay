import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Search, HelpCircle, MessageSquare } from "lucide-react";
import { Link } from "wouter";
import { PageSEO } from "@/components/PageSEO";

/* ─── DATA ─── */

type Category = "all" | "general" | "course" | "payment" | "technical" | "career" | "community";

interface FaqItem {
  id: number;
  q: string;
  a: React.ReactNode;
  cat: Exclude<Category, "all">;
}

const TABS: { key: Category; label: string }[] = [
  { key: "all",       label: "🗂️ সব" },
  { key: "general",   label: "ℹ️ সাধারণ" },
  { key: "course",    label: "📚 কোর্স" },
  { key: "payment",   label: "💳 পেমেন্ট" },
  { key: "technical", label: "⚙️ Technical" },
  { key: "career",    label: "🎯 ক্যারিয়ার" },
  { key: "community", label: "🤝 Community" },
];

const SECTION_LABELS: Record<string, { emoji: string; label: string }> = {
  general:   { emoji: "ℹ️", label: "সাধারণ প্রশ্নাবলী" },
  course:    { emoji: "📚", label: "কোর্স সংক্রান্ত প্রশ্নাবলী" },
  payment:   { emoji: "💳", label: "পেমেন্ট ও মূল্য সংক্রান্ত প্রশ্নাবলী" },
  technical: { emoji: "⚙️", label: "Technical প্রশ্নাবলী" },
  career:    { emoji: "🎯", label: "ক্যারিয়ার ও উপার্জন সংক্রান্ত প্রশ্নাবলী" },
  community: { emoji: "🤝", label: "Community ও Support সংক্রান্ত প্রশ্নাবলী" },
};

const Tag = ({ children, color = "primary" }: { children: React.ReactNode; color?: "primary" | "amber" | "emerald" | "sky" }) => {
  const cls = {
    primary: "bg-primary/10 text-primary border-primary/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    sky: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  }[color];
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded border ${cls} mr-1.5 mt-2`}>
      {children}
    </span>
  );
};

const Li = ({ children }: { children: React.ReactNode }) => (
  <li className="text-sm text-muted-foreground leading-relaxed py-0.5">{children}</li>
);

const FAQS: FaqItem[] = [
  /* ── GENERAL ── */
  {
    id: 1, cat: "general",
    q: '"AI শিখি বাংলায়" আসলে কী?',
    a: <><p className="text-sm text-muted-foreground leading-relaxed">"AI শিখি বাংলায়" হলো বাংলাদেশের প্রথম পূর্ণাঙ্গ বাংলা ভাষার AI শিক্ষা প্ল্যাটফর্ম। এখানে তুমি Artificial Intelligence, ChatGPT, Machine Learning, Prompt Engineering সহ আধুনিক AI technology সম্পূর্ণ বাংলায় শিখতে পারবে — একদম শূন্য থেকে শুরু করে Advanced level পর্যন্ত।</p><div><Tag>বাংলায় AI 🇧🇩</Tag><Tag color="emerald">Beginner Friendly ✅</Tag></div></>,
  },
  {
    id: 2, cat: "general",
    q: "এই প্ল্যাটফর্ম কাদের জন্য তৈরি?",
    a: <><p className="text-sm text-muted-foreground leading-relaxed">এই প্ল্যাটফর্ম সবার জন্য — কোনো পূর্ব অভিজ্ঞতা লাগবে না। বিশেষভাবে উপকারী হবে:</p><ul className="list-none mt-2 space-y-1"><Li>📘 Students যারা AI career গড়তে চাও</Li><Li>💼 Professionals যারা কাজে AI যোগ করতে চাও</Li><Li>🧑‍💻 Freelancers যারা AI services দিতে চাও</Li><Li>🏪 Business owners যারা ব্যবসায় AI ব্যবহার করতে চাও</Li><Li>👩‍🏫 শিক্ষক যারা AI নিয়ে সচেতনতা বাড়াতে চাও</Li></ul></>,
  },
  {
    id: 3, cat: "general",
    q: "AI শিখতে কি গণিত বা Coding জানা লাগবে?",
    a: <><p className="text-sm text-muted-foreground leading-relaxed">একদমই না! আমাদের Beginner courses শুরু হয় একদম শূন্য থেকে — কোনো coding বা advanced math জানা ছাড়াই। Intermediate এবং Advanced levels এ ধীরে ধীরে technical বিষয়গুলো পরিচয় করিয়ে দেওয়া হয়। তোমার শেখার গতিতে, তোমার মতো করে।</p><div><Tag>No Coding Required</Tag><Tag color="amber">No Math Required</Tag></div></>,
  },
  {
    id: 4, cat: "general",
    q: "কোর্সগুলো কি সত্যিই সম্পূর্ণ বাংলায়?",
    a: <p className="text-sm text-muted-foreground leading-relaxed">হ্যাঁ! সকল ভিডিও লেকচার, নোটস, Quiz, এবং Support — সবই বাংলায়। Technical terms এর ক্ষেত্রে বাংলা explanation এর পাশাপাশি ইংরেজি term উল্লেখ করা হয়, যাতে ভবিষ্যতে global resources ব্যবহার করতে অসুবিধা না হয়।</p>,
  },
  {
    id: 5, cat: "general",
    q: "Mobile দিয়ে কি কোর্স করা যাবে?",
    a: <><p className="text-sm text-muted-foreground leading-relaxed">অবশ্যই! আমাদের প্ল্যাটফর্ম সম্পূর্ণ Mobile Responsive। Android ও iOS উভয় ডিভাইস থেকেই ভিডিও দেখা, Quiz দেওয়া, এবং কমিউনিটিতে অংশ নেওয়া যাবে। ভবিষ্যতে আমাদের Dedicated Mobile App আসছে।</p><div><Tag color="sky">Android ✓</Tag><Tag color="sky">iOS ✓</Tag><Tag>Tablet ✓</Tag></div></>,
  },
  {
    id: 6, cat: "general",
    q: "বাংলাদেশের বাইরে থেকেও কি Enroll করা যাবে?",
    a: <p className="text-sm text-muted-foreground leading-relaxed">হ্যাঁ! বিশ্বের যেকোনো প্রান্ত থেকে যে কেউ Enroll করতে পারবে। প্রবাসী বাংলাদেশি এবং Bengali speaking learners সবার জন্যই এই প্ল্যাটফর্ম উন্মুক্ত। International payment methods (Visa, Mastercard, PayPal) সাপোর্ট করা হয়।</p>,
  },

  /* ── COURSE ── */
  {
    id: 7, cat: "course",
    q: "কোন কোন বিষয়ের কোর্স পাওয়া যাবে?",
    a: <><p className="text-sm text-muted-foreground leading-relaxed">আমাদের কোর্স তালিকায় রয়েছে:</p><ul className="list-none mt-2 space-y-1"><Li>🤖 ChatGPT & Prompt Engineering (Beginner to Advanced)</Li><Li>🎨 AI Image Generation (Midjourney, DALL-E, Stable Diffusion)</Li><Li>🎬 AI Video Creation (Runway, Pika, Sora)</Li><Li>💼 AI for Business & Marketing</Li><Li>👨‍💻 AI Coding Assistant (GitHub Copilot, Cursor)</Li><Li>📊 Machine Learning Basics</Li><Li>🧠 Deep Learning Introduction</Li><Li>💰 AI Freelancing Masterclass</Li></ul></>,
  },
  {
    id: 8, cat: "course",
    q: "একটি কোর্স শেষ করতে কতদিন লাগে?",
    a: <><p className="text-sm text-muted-foreground leading-relaxed">কোর্সের ধরন অনুযায়ী সময় আলাদা। তবে সাধারণভাবে:</p><ul className="list-none mt-2 space-y-1"><Li>⚡ Short Course: ৩–৭ দিন (প্রতিদিন ৩০ মিনিট)</Li><Li>📘 Standard Course: ৩–৪ সপ্তাহ (প্রতিদিন ১ ঘণ্টা)</Li><Li>🎓 Comprehensive Course: ৬–৮ সপ্তাহ (প্রতিদিন ১–২ ঘণ্টা)</Li></ul><p className="text-sm text-muted-foreground leading-relaxed mt-2">তোমার নিজের pace এ শেখো — কোনো deadline নেই। Lifetime access থাকবে।</p></>,
  },
  {
    id: 9, cat: "course",
    q: "কোর্স Enroll করার পর কতদিন Access থাকবে?",
    a: <><p className="text-sm text-muted-foreground leading-relaxed">Lifetime Access! একবার কোর্স কিনলে সারাজীবনের জন্য তোমার। কোর্সে নতুন content যোগ হলে সেটাও বিনামূল্যে পাবে। আমরা নিয়মিত কোর্স আপডেট করি AI এর নতুন developments অনুযায়ী।</p><div><Tag>Lifetime Access ♾️</Tag><Tag color="amber">Free Updates 🔄</Tag></div></>,
  },
  {
    id: 10, cat: "course",
    q: "কোর্স কি Live নাকি Recorded?",
    a: <><p className="text-sm text-muted-foreground leading-relaxed">দুটোই আছে! বেশিরভাগ কোর্স Pre-recorded — যাতে তুমি নিজের সময় মতো শিখতে পারো। এর পাশাপাশি প্রতি মাসে Live Masterclass, Q&A Session, এবং Workshop হয় — যেগুলো পরে Recording হিসেবেও দেখা যায়।</p><div><Tag color="sky">Recorded 🎬</Tag><Tag color="amber">Live Sessions 🔴</Tag></div></>,
  },
  {
    id: 11, cat: "course",
    q: "ফ্রিতে কি কিছু শেখার সুযোগ আছে?",
    a: <><p className="text-sm text-muted-foreground leading-relaxed">হ্যাঁ! আমাদের Free tier এ রয়েছে:</p><ul className="list-none mt-2 space-y-1"><Li>✅ প্রতিটি কোর্সের প্রথম ২–৩টি লেকচার বিনামূল্যে</Li><Li>✅ Weekly Free Webinar</Li><Li>✅ AI Blog ও Resource Library</Li><Li>✅ Community Forum এ অংশগ্রহণ</Li><Li>✅ Monthly Newsletter</Li></ul><div><Tag color="emerald">Free Forever 🆓</Tag></div></>,
  },
  {
    id: 12, cat: "course",
    q: "কোর্সে কি Practical Project করার সুযোগ আছে?",
    a: <><p className="text-sm text-muted-foreground leading-relaxed">অবশ্যই! আমরা বিশ্বাস করি "Learning by Doing" তে। প্রতিটি কোর্সে রয়েছে:</p><ul className="list-none mt-2 space-y-1"><Li>🛠️ Hands-on Exercises প্রতিটি লেকচারের পর</Li><Li>📋 Mini Projects প্রতিটি module শেষে</Li><Li>🏆 Final Capstone Project কোর্স শেষে</Li><Li>📁 Portfolio তৈরিতে সাহায্য</Li></ul></>,
  },
  {
    id: 13, cat: "course",
    q: "Course Materials কি Download করা যাবে?",
    a: <><p className="text-sm text-muted-foreground leading-relaxed">হ্যাঁ! Paid courses এ নিম্নলিখিত সবকিছু Download করা যাবে:</p><ul className="list-none mt-2 space-y-1"><Li>📄 PDF Notes ও Cheat Sheets</Li><Li>📊 Slides ও Infographics</Li><Li>📝 Exercise Files ও Templates</Li><Li>🎧 Audio Version (পথে চলতে চলতে শোনার জন্য)</Li></ul><p className="text-sm text-muted-foreground leading-relaxed mt-2">তবে ভিডিও download করা যাবে না — platform এই stream করতে হবে।</p></>,
  },
  {
    id: 24, cat: "course",
    q: "কোর্স শেষে কি Certificate পাওয়া যাবে?",
    a: <><p className="text-sm text-muted-foreground leading-relaxed">হ্যাঁ! সকল Paid কোর্স সফলভাবে সম্পন্ন করলে Digital Certificate পাবে। Certificate এ থাকবে:</p><ul className="list-none mt-2 space-y-1"><Li>📋 তোমার নাম ও কোর্সের নাম</Li><Li>📅 Completion date</Li><Li>🔐 Unique verification code (employers verify করতে পারবে)</Li><Li>🔗 LinkedIn এ direct share করার option</Li></ul><div><Tag color="emerald">Verifiable ✅</Tag><Tag color="sky">LinkedIn Ready 🔗</Tag></div></>,
  },
  {
    id: 25, cat: "course",
    q: "Certificate টি কি Job এ কাজে লাগবে?",
    a: <p className="text-sm text-muted-foreground leading-relaxed">আমাদের Certificate বাংলাদেশের IT sector এ স্বীকৃত। তবে সবচেয়ে গুরুত্বপূর্ণ হলো তোমার শেখা skills — Certificate শুধু সেটাকে প্রমাণ করে। আমরা Employer এবং Freelance platform গুলোর সাথে partnership এর কাজ করছি। Capstone Project থেকে তৈরি Portfolio অনেক বেশি কার্যকর job পেতে।</p>,
  },

  /* ── PAYMENT ── */
  {
    id: 14, cat: "payment",
    q: "কোর্সের দাম কত?",
    a: <><p className="text-sm text-muted-foreground leading-relaxed">বিভিন্ন কোর্সের মূল্য আলাদা। সাধারণভাবে:</p><ul className="list-none mt-2 space-y-1"><Li>⚡ Short Courses: ৩৯৯ – ৭৯৯ টাকা</Li><Li>📘 Standard Courses: ৯৯৯ – ১,৯৯৯ টাকা</Li><Li>🎓 Comprehensive Courses: ২,৪৯৯ – ৪,৯৯৯ টাকা</Li><Li>💎 All-Access Membership: ৭৯৯ টাকা/মাস</Li></ul><p className="text-sm text-muted-foreground leading-relaxed mt-2">নিয়মিত Discount এবং Bundle offer পাওয়া যায়। Newsletter subscribe করলে first notification পাবে।</p></>,
  },
  {
    id: 15, cat: "payment",
    q: "কোন কোন Payment Method সাপোর্ট করে?",
    a: <><p className="text-sm text-muted-foreground leading-relaxed">বাংলাদেশের জনপ্রিয় সকল পেমেন্ট পদ্ধতি সাপোর্ট করা হয়:</p><ul className="list-none mt-2 space-y-1"><Li>📱 bKash, Nagad, Rocket</Li><Li>💳 Visa, Mastercard (Debit ও Credit)</Li><Li>🏦 Internet Banking (DBBL, Dutch Bangla, BRAC Bank)</Li><Li>🌍 PayPal (International users এর জন্য)</Li></ul><div><Tag color="amber">bKash ✓</Tag><Tag color="amber">Nagad ✓</Tag><Tag color="sky">Card ✓</Tag></div></>,
  },
  {
    id: 16, cat: "payment",
    q: "Refund Policy কী? টাকা ফেরত পাওয়া যাবে?",
    a: <><p className="text-sm text-muted-foreground leading-relaxed">আমাদের <strong className="text-foreground">7-Day Money Back Guarantee</strong> আছে। কোর্স কেনার ৭ দিনের মধ্যে যদি সন্তুষ্ট না হও, সম্পূর্ণ টাকা ফেরত দেওয়া হবে — কোনো প্রশ্ন ছাড়া। তবে কোর্সের ৩০% এর বেশি সম্পন্ন করলে Refund প্রযোজ্য হবে না।</p><div><Tag color="emerald">7-Day Guarantee ✅</Tag></div></>,
  },
  {
    id: 17, cat: "payment",
    q: "Student বা কম আয়ের মানুষদের জন্য কি বিশেষ সুবিধা আছে?",
    a: <><p className="text-sm text-muted-foreground leading-relaxed">হ্যাঁ! আমরা বিশ্বাস করি অর্থের অভাব যেন শেখার বাধা না হয়। তাই রয়েছে:</p><ul className="list-none mt-2 space-y-1"><Li>🎓 Student Discount: ৪০% ছাড় (Student ID দেখালে)</Li><Li>💙 Need-based Scholarship: আবেদন করলে বিনামূল্যে access</Li><Li>📅 Installment Plan: ৩ মাসে ভাগে পেমেন্ট</Li><Li>🤝 Earn to Learn: Community contribute করে free access পাও</Li></ul></>,
  },
  {
    id: 18, cat: "payment",
    q: "Group বা Corporate Enrollment এর কোনো সুবিধা আছে?",
    a: <><p className="text-sm text-muted-foreground leading-relaxed">অবশ্যই! Team বা Organization এর জন্য আলাদা Corporate Plan আছে:</p><ul className="list-none mt-2 space-y-1"><Li>👥 ৫+ জনের জন্য: ২৫% ছাড়</Li><Li>👥 ১০+ জনের জন্য: ৪০% ছাড়</Li><Li>👥 ২০+ জনের জন্য: Custom pricing</Li></ul><p className="text-sm text-muted-foreground leading-relaxed mt-2">Corporate enquiry এর জন্য আমাদের email করো: corporate@aishikhibanglay.com</p></>,
  },

  /* ── TECHNICAL ── */
  {
    id: 19, cat: "technical",
    q: "কোর্স করতে কি Special Software বা Hardware লাগবে?",
    a: <><p className="text-sm text-muted-foreground leading-relaxed">না! বেশিরভাগ কোর্স শুধু Browser দিয়েই করা যাবে। কিছু Advanced কোর্সের জন্য:</p><ul className="list-none mt-2 space-y-1"><Li>💻 Google Colab (Free, browser-based Python environment)</Li><Li>🆓 Free tools যেগুলো কোর্সেই পরিচয় করিয়ে দেওয়া হবে</Li></ul><p className="text-sm text-muted-foreground leading-relaxed mt-2">Minimum requirement: যেকোনো smartphone বা computer + stable internet connection।</p></>,
  },
  {
    id: 20, cat: "technical",
    q: "Video quality কেমন? Slow internet এ কি দেখা যাবে?",
    a: <><p className="text-sm text-muted-foreground leading-relaxed">সকল ভিডিও HD (720p ও 1080p) quality তে available। তবে আমরা বাংলাদেশের internet reality মাথায় রেখে:</p><ul className="list-none mt-2 space-y-1"><Li>📶 Auto quality adjustment — connection অনুযায়ী automatic</Li><Li>📱 Low-data mode: ৩৬০p option available</Li><Li>⏸️ Pause & Resume: যেখানে ছেড়ে দেবে সেখান থেকে শুরু হবে</Li></ul></>,
  },
  {
    id: 21, cat: "technical",
    q: "Platform এ Login করতে সমস্যা হলে কী করবো?",
    a: <><p className="text-sm text-muted-foreground leading-relaxed">প্রথমে এগুলো চেষ্টা করো:</p><ul className="list-none mt-2 space-y-1"><Li>🔑 "Forgot Password" দিয়ে password reset করো</Li><Li>🌐 Browser cache clear করো</Li><Li>📱 অন্য browser বা device try করো</Li></ul><p className="text-sm text-muted-foreground leading-relaxed mt-2">সমস্যা থাকলে আমাদের WhatsApp Support এ যোগাযোগ করো — সাধারণত ২ ঘণ্টার মধ্যে reply পাবে।</p></>,
  },
  {
    id: 22, cat: "technical",
    q: "একই Account কি একাধিক Device এ ব্যবহার করা যাবে?",
    a: <p className="text-sm text-muted-foreground leading-relaxed">হ্যাঁ, তবে সীমিতভাবে। একটি Account একসাথে সর্বোচ্চ ২টি Device এ active থাকতে পারবে (যেমন: mobile + laptop)। Account sharing বা বিক্রি Terms of Service লঙ্ঘন — এটি করলে account suspend হতে পারে।</p>,
  },
  {
    id: 23, cat: "technical",
    q: "আমার Progress কি Save হয়?",
    a: <><p className="text-sm text-muted-foreground leading-relaxed">হ্যাঁ, সম্পূর্ণ automatically! তুমি যেখানে ভিডিও থামাবে, পরের বার সেখান থেকে শুরু হবে। Quiz scores, completed lessons, notes — সবকিছু cloud এ save থাকে। Dashboard এ গেলে তোমার পুরো learning journey দেখতে পাবে।</p><div><Tag color="emerald">Auto-Save ✅</Tag><Tag color="sky">Progress Tracking 📊</Tag></div></>,
  },

  /* ── CAREER ── */
  {
    id: 26, cat: "career",
    q: "AI শিখলে কত টাকা Earn করা সম্ভব?",
    a: <><p className="text-sm text-muted-foreground leading-relaxed">Skill এবং dedication অনুযায়ী ভিন্ন হবে। তবে আমাদের graduates এর অভিজ্ঞতা থেকে:</p><ul className="list-none mt-2 space-y-1"><Li>💼 Entry-level AI Freelancing: ২০,০০০ – ৫০,০০০ টাকা/মাস</Li><Li>🚀 Intermediate (৬ মাস পর): ৫০,০০০ – ১,৫০,০০০ টাকা/মাস</Li><Li>🌍 Advanced + International clients: $500–$3000/মাস</Li></ul><p className="text-sm text-muted-foreground leading-relaxed mt-2">এই সংখ্যাগুলো guarantee না — তোমার effort এর উপর নির্ভর করে।</p></>,
  },
  {
    id: 27, cat: "career",
    q: "Job Placement বা Internship এ সাহায্য করা হয় কি?",
    a: <><p className="text-sm text-muted-foreground leading-relaxed">হ্যাঁ! আমাদের Career Support Services এ রয়েছে:</p><ul className="list-none mt-2 space-y-1"><Li>📋 CV Review ও LinkedIn Profile Optimization</Li><Li>🤝 Partner companies তে Job Referral</Li><Li>💼 Internship opportunity announcements</Li><Li>🎤 Mock Interview preparation</Li><Li>📢 Exclusive Job Board (শুধু আমাদের students এর জন্য)</Li></ul><div><Tag color="emerald">Career Support ✅</Tag></div></>,
  },
  {
    id: 28, cat: "career",
    q: "Freelancing শুরু করতে কোন কোর্সটা আগে করবো?",
    a: <><p className="text-sm text-muted-foreground leading-relaxed">AI Freelancing এ নতুনদের জন্য আমাদের suggested path:</p><ul className="list-none mt-2 space-y-1"><Li>1️⃣ ChatGPT & Prompt Engineering (Beginner)</Li><Li>2️⃣ AI Image Generation (যদি creative field হয়)</Li><Li>3️⃣ AI Freelancing Masterclass</Li><Li>4️⃣ Portfolio Building Workshop</Li></ul><p className="text-sm text-muted-foreground leading-relaxed mt-2">এই path টা follow করলে ৬০–৯০ দিনে প্রথম client পাওয়ার সম্ভাবনা তৈরি হয়।</p></>,
  },

  /* ── COMMUNITY ── */
  {
    id: 29, cat: "community",
    q: "কোনো প্রশ্ন থাকলে কিভাবে সাহায্য পাবো?",
    a: <><p className="text-sm text-muted-foreground leading-relaxed">আমাদের Multi-channel Support System রয়েছে:</p><ul className="list-none mt-2 space-y-1"><Li>💬 Course Discussion Board — প্রতিটি লেকচারের নিচে</Li><Li>📱 WhatsApp Support Group — quick questions এর জন্য</Li><Li>📧 Email Support — complex issues এর জন্য (২৪ ঘণ্টায় reply)</Li><Li>🔴 Live Q&A — প্রতি সপ্তাহে ২ বার</Li></ul><div><Tag color="sky">24hr Email Support ✉️</Tag></div></>,
  },
  {
    id: 30, cat: "community",
    q: "Community তে কি ধরনের মানুষ আছে?",
    a: <><p className="text-sm text-muted-foreground leading-relaxed">আমাদের community তে আছে ১০,০০০+ এর বেশি শিক্ষার্থী — students থেকে শুরু করে professionals, freelancers, এবং entrepreneurs। এখানে তুমি পাবে:</p><ul className="list-none mt-2 space-y-1"><Li>🤝 Accountability Partners</Li><Li>💡 Project Collaboration সুযোগ</Li><Li>📣 Success Stories ও Inspiration</Li><Li>🎁 Exclusive Resources Sharing</Li><Li>🌍 Network তৈরির সুযোগ</Li></ul></>,
  },
  {
    id: 31, cat: "community",
    q: "Instructor রা কে? তারা কি Qualified?",
    a: <><p className="text-sm text-muted-foreground leading-relaxed">আমাদের instructors হলেন প্রকৃত practitioners — যারা নিজেরাই AI দিয়ে কাজ করেন। প্রতিটি instructor কে যাচাই করা হয়:</p><ul className="list-none mt-2 space-y-1"><Li>✅ মিনিমাম ২ বছরের Real-world AI experience</Li><Li>✅ Teaching ability test</Li><Li>✅ Content accuracy review</Li><Li>✅ Student feedback অনুযায়ী নিয়মিত evaluation</Li></ul></>,
  },
  {
    id: 32, cat: "community",
    q: "আমিও কি Instructor হতে পারবো?",
    a: <><p className="text-sm text-muted-foreground leading-relaxed">হ্যাঁ! আমরা নতুন Bengali AI educators কে সুযোগ দিতে চাই। যদি তোমার AI তে দক্ষতা থাকে এবং শেখাতে আগ্রহ থাকে, তাহলে:</p><ul className="list-none mt-2 space-y-1"><Li>📧 teach@aishikhibanglay.com এ apply করো</Li><Li>📹 একটি Sample lecture video পাঠাও</Li><Li>💰 Revenue sharing model এ earn করো</Li></ul><div><Tag color="amber">Teach & Earn 💰</Tag></div></>,
  },
  {
    id: 33, cat: "community",
    q: "Referral Program কি আছে?",
    a: <><p className="text-sm text-muted-foreground leading-relaxed">অবশ্যই! আমাদের Refer & Earn Program এ:</p><ul className="list-none mt-2 space-y-1"><Li>🎁 তুমি একজনকে refer করলে তুমি পাবে ৩০০ টাকা Credit</Li><Li>🎁 তোমার referral পাবে ১৫% discount</Li><Li>🏆 Top referrers পাবে Free Premium Membership!</Li></ul><p className="text-sm text-muted-foreground leading-relaxed mt-2">Dashboard থেকে তোমার Referral Link পাবে।</p><div><Tag color="emerald">Earn ৳৩০০ per referral 💸</Tag></div></>,
  },

  /* ── EXTRA ── */
  {
    id: 34, cat: "general",
    q: "AI কি আমার চাকরি নিয়ে নেবে? এই বিষয়ে তোমাদের মত কী?",
    a: <p className="text-sm text-muted-foreground leading-relaxed">এটা একটা অত্যন্ত গুরুত্বপূর্ণ প্রশ্ন। আমাদের সৎ উত্তর হলো — AI কিছু কাজ পরিবর্তন করবে, কিছু কাজ কমাবে, এবং অনেক নতুন কাজ তৈরি করবে। যারা AI শিখবে, তারা পরিবর্তনের সাথে adapt করবে। যারা শিখবে না, তারা পিছিয়ে পড়তে পারে। এই সত্যটা মাথায় রেখেই আমরা "AI শিখি বাংলায়" তৈরি করেছি।</p>,
  },
  {
    id: 35, cat: "general",
    q: "কিভাবে শুরু করবো? First Step কী?",
    a: <><p className="text-sm text-muted-foreground leading-relaxed">শুরু করা একদম সহজ! ৩টি simple step:</p><ul className="list-none mt-2 space-y-1"><Li>1️⃣ <strong className="text-foreground">Free Account তৈরি করো</strong> — ৩০ সেকেন্ড লাগবে</Li><Li>2️⃣ <strong className="text-foreground">Free Course শুরু করো</strong> — "AI Beginner Crash Course" দিয়ে শুরু করো</Li><Li>3️⃣ <strong className="text-foreground">Community তে যোগ দাও</strong> — হাজারো learner তোমার পাশে আছে</Li></ul><p className="text-sm text-muted-foreground leading-relaxed mt-2">Perfect time বলে কিছু নেই। শুরু করো এখনই! 🚀</p><div><Tag color="emerald">Free to Start 🆓</Tag><Tag color="amber">No Credit Card Needed</Tag></div></>,
  },
];

const SECTION_ORDER: Exclude<Category, "all">[] = ["general", "course", "payment", "technical", "career", "community"];

/* ─── COMPONENT ─── */

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<Category>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let items = FAQS;
    if (activeTab !== "all") items = items.filter((f) => f.cat === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (f) => f.q.toLowerCase().includes(q) || (typeof f.a === "string" && f.a.toLowerCase().includes(q))
      );
    }
    return items;
  }, [activeTab, search]);

  const toggle = (id: number) => setOpenId((prev) => (prev === id ? null : id));

  // Group by category in defined order
  const grouped = useMemo(() => {
    if (activeTab !== "all" || search.trim()) return null;
    return SECTION_ORDER.map((cat) => ({
      cat,
      items: FAQS.filter((f) => f.cat === cat),
    })).filter((g) => g.items.length > 0);
  }, [activeTab, search]);

  const toRender = grouped
    ? grouped.flatMap((g) => [{ type: "label" as const, cat: g.cat }, ...g.items.map((i) => ({ type: "item" as const, ...i }))])
    : filtered.map((i) => ({ type: "item" as const, ...i }));

  return (
    <div className="min-h-screen pb-20">
      <PageSEO
        title="সচরাচর জিজ্ঞাসিত প্রশ্নোত্তর"
        canonical="/faq"
        description="AI শিখি বাংলায় সম্পর্কে সচরাচর জিজ্ঞাসিত প্রশ্নাবলী ও উত্তর। কোর্স, পেমেন্ট, সার্টিফিকেট, ক্যারিয়ার সব বিষয়ে জানুন।"
      />

      {/* ── Header ── */}
      <div className="border-b border-border bg-card/40 py-14 md:py-20">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-6">
            <HelpCircle className="w-7 h-7" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            সচরাচর জিজ্ঞাসিত{" "}
            <span className="text-primary">প্রশ্নোত্তর</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            তোমার মনে যে প্রশ্নগুলো আছে, সেগুলোর উত্তর এখানেই পাবে।<br className="hidden sm:block" />
            না পেলে আমাদের সাথে সরাসরি যোগাযোগ করো।
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { icon: "❓", value: "৩৫টি", label: "প্রশ্নোত্তর" },
              { icon: "📚", value: "৬টি", label: "ক্যাটাগরি" },
              { icon: "🇧🇩", value: "সম্পূর্ণ", label: "বাংলায়" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/60 border border-border text-sm text-muted-foreground">
                <span>{s.icon}</span>
                <strong className="text-foreground">{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setActiveTab("all"); }}
              placeholder="প্রশ্ন খোঁজো... (যেমন: ফ্রি, সার্টিফিকেট, পেমেন্ট)"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-3xl pt-10">
        {/* ── Category Tabs ── */}
        {!search && (
          <div className="flex flex-wrap gap-2 mb-10">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-all ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* ── FAQ List ── */}
        {toRender.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg mb-2">😕 তোমার খোঁজা প্রশ্নটি পাওয়া যায়নি।</p>
            <p className="text-sm">আমাদের সরাসরি জানাও — <Link href="/contact"><span className="text-primary hover:underline cursor-pointer">যোগাযোগ করুন</span></Link></p>
          </div>
        ) : (
          <div className="space-y-0">
            {toRender.map((entry, idx) => {
              if (entry.type === "label") {
                const sec = SECTION_LABELS[entry.cat];
                return (
                  <div key={`label-${entry.cat}`} className="flex items-center gap-3 mt-10 mb-4 first:mt-0">
                    <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
                      {sec.emoji} {sec.label}
                    </span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                );
              }

              const isOpen = openId === entry.id;
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.3) }}
                  className={`mb-2 rounded-xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "border-primary/50 bg-card shadow-md shadow-primary/5"
                      : "border-border bg-card hover:border-border/80 hover:shadow-sm"
                  }`}
                >
                  <button
                    onClick={() => toggle(entry.id)}
                    className="w-full flex items-center gap-3 px-5 py-4 text-left group"
                  >
                    <span className={`text-xs font-bold font-mono shrink-0 w-7 ${isOpen ? "text-primary" : "text-muted-foreground"}`}>
                      {String(entry.id).padStart(2, "০")}
                    </span>
                    <span className={`flex-1 text-sm md:text-base font-semibold leading-snug transition-colors ${isOpen ? "text-foreground" : "text-foreground/90 group-hover:text-foreground"}`}>
                      {entry.q}
                    </span>
                    <span className={`shrink-0 w-7 h-7 rounded-lg border flex items-center justify-center transition-all duration-200 ${
                      isOpen
                        ? "bg-primary border-primary text-primary-foreground rotate-45"
                        : "border-border text-muted-foreground group-hover:border-primary/40"
                    }`}>
                      <Plus className="w-4 h-4" />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pl-[60px]">
                          <div className="h-px bg-border mb-4" />
                          {entry.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ── CTA ── */}
        <div className="mt-14 rounded-2xl bg-card border border-border p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">এখনও প্রশ্ন আছে? 🤔</h3>
            <p className="text-muted-foreground text-sm mb-6">
              আমাদের team সবসময় সাহায্য করতে প্রস্তুত। সরাসরি যোগাযোগ করো।
            </p>
            <Link href="/contact">
              <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity text-sm">
                <MessageSquare className="w-4 h-4" />
                এখনই যোগাযোগ করো
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
