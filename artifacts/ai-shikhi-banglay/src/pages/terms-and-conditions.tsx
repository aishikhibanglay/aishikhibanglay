import { PageSEO } from "@/components/PageSEO";
import { EditablePage } from "@/components/EditablePage";

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

function HBox({ variant = "orange", children }: { variant?: "orange" | "green" | "teal" | "gold" | "red"; children: React.ReactNode }) {
  const colors: Record<string, string> = {
    orange: "border-l-primary",
    green: "border-l-emerald-400",
    teal: "border-l-sky-400",
    gold: "border-l-yellow-400",
    red: "border-l-red-400",
  };
  return (
    <div className={`bg-card border border-border border-l-4 ${colors[variant]} rounded-lg p-4 my-4 text-sm leading-[1.85] text-muted-foreground`}>
      {children}
    </div>
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

function UL({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mt-2 mb-4 ml-5 flex flex-col gap-2 list-disc">
      {items.map((item, i) => (
        <li key={i} className="text-sm leading-[1.8] text-muted-foreground">{item}</li>
      ))}
    </ul>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return <p className="text-[14.5px] leading-[1.95] text-muted-foreground mb-3">{children}</p>;
}

function Sub({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sky-400 font-semibold text-sm mt-4 mb-2">{children}</h3>;
}

function HardcodedTerms() {
  return (
    <div className="min-h-screen py-12 md:py-20">
      <PageSEO title="ব্যবহারের শর্তাবলী" canonical="/terms-and-conditions" />
      <div className="container mx-auto px-4 max-w-3xl">
        <Eyebrow text="শর্তাবলী" />
        <h1 className="text-[clamp(26px,4vw,40px)] font-bold leading-tight mb-2.5">
          ব্যবহারের <span className="text-primary">শর্তাবলী</span>
        </h1>
        <div className="flex gap-3 flex-wrap mb-9 pb-7 border-b border-border">
          <MetaTag>🗓️ কার্যকর: ১ জানুয়ারি ২০২৫</MetaTag>
          <MetaTag>📍 প্রযোজ্য: বাংলাদেশ আইন অনুযায়ী</MetaTag>
        </div>

        <HBox variant="teal">
          <strong>📌 গুরুত্বপূর্ণ:</strong> এই প্ল্যাটফর্ম ব্যবহার করার মাধ্যমে তুমি এই শর্তাবলী মেনে নিচ্ছ। অনুগ্রহ করে সম্পূর্ণ পড়ো।
        </HBox>

        <Section title="১. সংজ্ঞা">
          <UL items={[
            <><strong className="text-foreground">"প্ল্যাটফর্ম"</strong> — AI শিখি বাংলায় ওয়েবসাইট ও সকল সংশ্লিষ্ট সেবা</>,
            <><strong className="text-foreground">"ব্যবহারকারী" / "তুমি"</strong> — যে কেউ যিনি প্ল্যাটফর্ম ব্যবহার করেন</>,
            <><strong className="text-foreground">"আমরা"</strong> — AI শিখি বাংলায় এবং এর পরিচালনাকারী দল</>,
            <><strong className="text-foreground">"কন্টেন্ট"</strong> — ভিডিও, নোটস, কুইজ, প্রজেক্ট সহ সকল শিক্ষামূলক উপকরণ</>,
          ]} />
        </Section>

        <Section title="২. অ্যাকাউন্ট নিবন্ধন">
          <UL items={[
            "সঠিক ও সত্যিকারের তথ্য দিয়ে অ্যাকাউন্ট খুলতে হবে",
            "একজন ব্যক্তি শুধুমাত্র একটি অ্যাকাউন্ট রাখতে পারবে",
            "পাসওয়ার্ড গোপন রাখা তোমার দায়িত্ব",
            "অ্যাকাউন্ট অন্য কাউকে দেওয়া বা ভাড়া দেওয়া নিষিদ্ধ",
            "নিবন্ধনের জন্য ন্যূনতম বয়স ১৩ বছর (১৮ বছরের কম হলে অভিভাবকের সম্মতি প্রয়োজন)",
          ]} />
        </Section>

        <Section title="৩. কোর্স ও কন্টেন্ট ব্যবহার">
          <Sub>তুমি যা করতে পারবে:</Sub>
          <UL items={[
            "✅ ব্যক্তিগত শিক্ষার জন্য কোর্স কন্টেন্ট দেখতে পারবে",
            "✅ PDF নোটস ও Study materials download করতে পারবে",
            "✅ Community তে শেয়ার ও আলোচনা করতে পারবে",
            "✅ কোর্সে শেখা দক্ষতা নিজের কাজে ব্যবহার করতে পারবে",
          ]} />
          <Sub>তুমি যা করতে পারবে না:</Sub>
          <UL items={[
            "❌ ভিডিও Download, Screen Record বা Re-upload করা নিষিদ্ধ",
            "❌ কোর্স কন্টেন্ট কাউকে বিক্রি বা বিতরণ করা নিষিদ্ধ",
            "❌ আমাদের কন্টেন্ট অন্য platform এ প্রকাশ করা নিষিদ্ধ",
            "❌ Platform এর নিরাপত্তা ব্যবস্থা bypass করার চেষ্টা নিষিদ্ধ",
            "❌ Reverse Engineering বা কোড চুরি করা নিষিদ্ধ",
          ]} />
          <HBox variant="red">
            ⚠️ এই নিয়ম লঙ্ঘন করলে বিনা নোটিশে অ্যাকাউন্ট বন্ধ হতে পারে এবং আইনি পদক্ষেপ নেওয়া হতে পারে।
          </HBox>
        </Section>

        <Section title="৪. পেমেন্ট ও Refund">
          <UL items={[
            "কোর্সের মূল্য সময়ের সাথে পরিবর্তন হতে পারে — কেনার সময়ের মূল্যই চূড়ান্ত",
            <><strong className="text-foreground">৭ দিনের Money-Back Guarantee:</strong> কোর্সের ৩০% এর কম সম্পন্ন হলে ফেরত পাওয়া যাবে</>,
            "Refund প্রক্রিয়া: ৫–১০ কার্যদিবস লাগতে পারে",
            "Promotional বা Scholarship কোর্সে Refund প্রযোজ্য নয়",
            "Subscription cancel করলে পরবর্তী billing cycle এ charge হবে না — চলতি মাস কার্যকর থাকবে",
          ]} />
        </Section>

        <Section title="৫. Intellectual Property">
          <Para>AI শিখি বাংলায় প্ল্যাটফর্মের সকল কন্টেন্ট — ভিডিও, লেখা, ছবি, লোগো, কোড — আমাদের মেধাস্বত্ব। বাংলাদেশের কপিরাইট আইন ২০০০ অনুযায়ী এগুলো সুরক্ষিত।</Para>
        </Section>

        <Section title="৬. ব্যবহারকারীর আচরণ">
          <Para>Community ও প্ল্যাটফর্মে নিম্নলিখিত আচরণ সম্পূর্ণরূপে নিষিদ্ধ:</Para>
          <UL items={[
            "অন্য ব্যবহারকারীকে হয়রানি, গালি বা হুমকি দেওয়া",
            "Spam, বিজ্ঞাপন বা অপ্রাসঙ্গিক লিংক শেয়ার করা",
            "ভুল তথ্য বা Misinformation ছড়ানো",
            "ধর্মীয়, জাতিগত বা রাজনৈতিক বিদ্বেষমূলক কন্টেন্ট",
            "অন্যের ব্যক্তিগত তথ্য শেয়ার করা (Doxxing)",
          ]} />
        </Section>

        <Section title="৭. সেবার পরিবর্তন ও বন্ধ">
          <Para>আমরা যেকোনো সময় সেবা পরিবর্তন, আপগ্রেড বা সাময়িক বন্ধ করতে পারি। Technical maintenance এর জন্য আগে থেকে জানানোর চেষ্টা করা হবে। Paid users দের ক্ষতিপূরণ দেওয়া হবে যদি সেবা দীর্ঘমেয়াদে বন্ধ হয়।</Para>
        </Section>

        <Section title="৮. দায়বদ্ধতার সীমা">
          <Para>আমাদের দায়বদ্ধতা তোমার paid কোর্সের মূল্যের মধ্যে সীমাবদ্ধ। Indirect বা consequential ক্ষতির জন্য আমরা দায়ী নই।</Para>
        </Section>

        <Section title="৯. প্রযোজ্য আইন ও বিরোধ নিষ্পত্তি">
          <Para>এই শর্তাবলী বাংলাদেশের আইন অনুযায়ী পরিচালিত। যেকোনো বিরোধ প্রথমে আলোচনার মাধ্যমে নিষ্পত্তির চেষ্টা করা হবে। আলোচনায় সমাধান না হলে ঢাকার সক্ষম আদালতে নিষ্পত্তি হবে।</Para>
        </Section>

        <div className="mt-12 pt-6 border-t border-border flex justify-between items-center flex-wrap gap-3">
          <p className="text-[12.5px] text-muted-foreground">সর্বশেষ আপডেট: ১ জানুয়ারি ২০২৫</p>
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

export default function TermsAndConditions() {
  return <EditablePage slug="terms-and-conditions" fallback={<HardcodedTerms />} />;
}
