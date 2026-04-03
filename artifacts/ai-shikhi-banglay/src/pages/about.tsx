import { PageSEO } from "@/components/PageSEO";

function Eyebrow({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-primary text-[10px] font-mono uppercase tracking-[3px] mb-3.5">
      <span className="w-5 h-0.5 bg-primary inline-block flex-shrink-0" />
      {text}
    </div>
  );
}

function MetaTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-mono px-3 py-1 rounded border border-border bg-card text-muted-foreground">
      {children}
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="border-l-[3px] border-primary pl-3.5 font-bold text-lg mb-3.5 text-foreground">{title}</h2>
      {children}
    </div>
  );
}

export default function About() {
  return (
    <div className="min-h-screen py-12 md:py-20">
      <PageSEO
        title="আমাদের সম্পর্কে"
        canonical="/about"
        description="AI শিখি বাংলায় সম্পর্কে জানুন। আমাদের লক্ষ্য বাংলাভাষীদের কাছে AI শিক্ষাকে সহজলভ্য করা।"
      />
      <div className="container mx-auto px-4 max-w-3xl">
        <Eyebrow text="আমাদের সম্পর্কে" />
        <h1 className="text-[clamp(26px,4vw,40px)] font-bold leading-tight mb-2.5">
          বাংলায় AI শেখার<br />
          <span className="text-primary">প্রথম পূর্ণাঙ্গ প্ল্যাটফর্ম</span>
        </h1>
        <div className="flex gap-3 flex-wrap mb-9 pb-7 border-b border-border">
          <MetaTag>📍 ঢাকা, বাংলাদেশ</MetaTag>
          <MetaTag>🗓️ প্রতিষ্ঠাকাল: ২০২৩</MetaTag>
          <MetaTag>🌐 aishikhibanglay.com</MetaTag>
        </div>

        {/* About Hero */}
        <div className="relative bg-gradient-to-br from-card to-card/60 border border-border rounded-2xl p-8 md:p-10 mb-10 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-primary/10 pointer-events-none" />
          <div className="text-primary text-[11px] font-mono uppercase tracking-[2px] mb-4">✦ আমাদের গল্প</div>
          <h2 className="font-bold text-[clamp(22px,3.5vw,34px)] leading-snug text-foreground mb-4">
            একটি স্বপ্ন থেকে<br />একটি আন্দোলন
          </h2>
          <p className="text-[15px] leading-[1.9] text-muted-foreground">
            ২০২৩ সালে যখন AI revolution শুরু হলো, তখন বাংলাদেশের অধিকাংশ মানুষ ভাষার বাধার কারণে এই সুযোগ থেকে বঞ্চিত ছিল। সব ভালো resource ইংরেজিতে — বাংলায় প্রায় কিছুই নেই। এই শূন্যতা পূরণ করতেই জন্ম হলো "AI শিখি বাংলায়"-এর।
          </p>
          <p className="text-[15px] leading-[1.9] text-muted-foreground mt-3">
            আমাদের বিশ্বাস — ভাষা কখনো শেখার বাধা হওয়া উচিত না। প্রযুক্তির সুবিধা সবার কাছে পৌঁছানো উচিত — শুধু ইংরেজি জানা মানুষের কাছে নয়।
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-10">
          {[
            { v: "১০,০০০+", l: "সক্রিয় শিক্ষার্থী" },
            { v: "৫০+", l: "কোর্স ও ওয়ার্কশপ" },
            { v: "৯৮%", l: "সন্তুষ্ট শিক্ষার্থী" },
            { v: "৬৪টি", l: "জেলার শিক্ষার্থী" },
          ].map((s) => (
            <div key={s.v} className="bg-card border border-border rounded-xl p-5 text-center">
              <div className="text-[28px] font-bold text-primary leading-tight mb-1">{s.v}</div>
              <div className="text-[12.5px] text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Mission & Vision */}
        <Section title="আমাদের মিশন ও ভিশন">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[
              { i: "🎯", h: "মিশন", p: "প্রতিটি বাংলাভাষী মানুষকে AI-literate করে তোলা — যাতে তারা ভবিষ্যতের digital বিশ্বে আত্মবিশ্বাসের সাথে টিকে থাকতে পারে।" },
              { i: "🌟", h: "ভিশন", p: "২০২৭ সালের মধ্যে ১ মিলিয়ন বাংলাদেশিকে AI শিক্ষায় দক্ষ করে তোলা এবং বাংলাদেশকে AI-ready nation হিসেবে গড়ে তোলা।" },
              { i: "💡", h: "মূল্যবোধ", p: "সহজলভ্যতা, সততা, মানসম্পন্ন শিক্ষা, এবং কমিউনিটির প্রতি দায়বদ্ধতা — এই চারটি মূল্যবোধ আমাদের পথ দেখায়।" },
              { i: "🤝", h: "প্রতিশ্রুতি", p: "সর্বদা সর্বোচ্চ মানের কন্টেন্ট, সৎ তথ্য, এবং শিক্ষার্থীদের সাফল্যকে আমাদের সাফল্য হিসেবে দেখা।" },
            ].map((m) => (
              <div key={m.h} className="bg-card border border-border rounded-xl p-5">
                <div className="text-2xl mb-2.5">{m.i}</div>
                <h4 className="text-sm font-bold text-foreground mb-2">{m.h}</h4>
                <p className="text-[13px] leading-[1.75] text-muted-foreground">{m.p}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Timeline */}
        <Section title="আমাদের যাত্রা">
          <div className="relative pl-7">
            <div className="absolute left-2 top-1.5 bottom-1.5 w-0.5 bg-border" />
            {[
              { y: "মার্চ ২০২৩", h: "যাত্রার শুরু", p: "একটি ছোট YouTube channel দিয়ে শুরু — প্রথম ভিডিওতে ৫০০ views। বাংলায় AI content এর চাহিদা প্রমাণিত হলো।" },
              { y: "জুলাই ২০২৩", h: "Platform Launch", p: "প্রথম structured course platform চালু হলো। ১ মাসে ১,০০০ শিক্ষার্থী যোগ দিলো।" },
              { y: "জানুয়ারি ২০২৪", h: "Scholarship Program", p: "আর্থিকভাবে পিছিয়ে পড়া শিক্ষার্থীদের জন্য বিনামূল্যে কোর্সের সুযোগ চালু হলো। ৩০০+ scholarship দেওয়া হলো।" },
              { y: "২০২৪ বর্তমান", h: "১০,০০০+ Community", p: "এখন আমরা বাংলাদেশের সবচেয়ে বড় বাংলা AI শিক্ষা কমিউনিটি। ৬৪ জেলায় আমাদের শিক্ষার্থী রয়েছে।" },
            ].map((t) => (
              <div key={t.y} className="relative mb-6 last:mb-0">
                <div className="absolute -left-7 top-1 w-3.5 h-3.5 rounded-full bg-primary border-2 border-background" />
                <div className="text-[11px] font-mono text-primary font-bold tracking-wide mb-1">{t.y}</div>
                <h4 className="text-sm font-bold text-foreground mb-1">{t.h}</h4>
                <p className="text-[13px] text-muted-foreground leading-[1.7]">{t.p}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Team */}
        <Section title="আমাদের দল">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { a: "👨‍💻", n: "রাফি আহমেদ", r: "Founder & CEO" },
              { a: "👩‍🏫", n: "সাদিয়া ইসলাম", r: "Head of Curriculum" },
              { a: "👨‍🎨", n: "তানভীর হোসেন", r: "Lead Instructor" },
              { a: "👩‍💼", n: "নুসরাত জাহান", r: "Community Manager" },
            ].map((m) => (
              <div key={m.n} className="bg-card border border-border rounded-xl p-5 text-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-yellow-400 flex items-center justify-center text-2xl mx-auto mb-3">
                  {m.a}
                </div>
                <div className="text-sm font-bold text-foreground">{m.n}</div>
                <div className="text-xs text-muted-foreground mt-1">{m.r}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Contact */}
        <Section title="যোগাযোগ করো">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { i: "📧", l: "ইমেইল", v: "support@aishikhibanglay.com" },
              { i: "📱", l: "WhatsApp", v: "+880 1XXX-XXXXXX" },
              { i: "📍", l: "ঠিকানা", v: "ঢাকা, বাংলাদেশ" },
              { i: "🕐", l: "সাপোর্ট সময়", v: "শনি–বৃহস্পতি, ৯টা–৯টা" },
            ].map((c) => (
              <div key={c.l} className="bg-card border border-border rounded-xl p-4 flex gap-3 items-start">
                <span className="text-xl flex-shrink-0">{c.i}</span>
                <div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wide mb-0.5">{c.l}</div>
                  <div className="text-[13px] font-semibold text-foreground">{c.v}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <div className="mt-12 pt-6 border-t border-border flex justify-between items-center flex-wrap gap-3">
          <p className="text-[12.5px] text-muted-foreground">সর্বশেষ আপডেট: জানুয়ারি ২০২৫</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="border border-border text-muted-foreground px-4 py-1.5 rounded text-sm hover:border-primary hover:text-primary transition-colors"
          >
            ↑ উপরে যাও
          </button>
        </div>
      </div>
    </div>
  );
}
