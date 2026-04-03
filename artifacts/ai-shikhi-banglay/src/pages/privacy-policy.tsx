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

function DocTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto my-4">
      <table className="w-full border-collapse text-[13.5px]">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h} className="bg-card text-foreground font-semibold p-3 text-left border-b-2 border-border">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-card/60 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="p-3 text-muted-foreground border-b border-border">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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

function HardcodedPrivacyPolicy() {
  return (
    <div className="min-h-screen py-12 md:py-20">
      <PageSEO title="গোপনীয়তা নীতি" canonical="/privacy-policy" noIndex={false} />
      <div className="container mx-auto px-4 max-w-3xl">
        <Eyebrow text="প্রাইভেসি পলিসি" />
        <h1 className="text-[clamp(26px,4vw,40px)] font-bold leading-tight mb-2.5">
          তোমার তথ্য <span className="text-primary">সুরক্ষিত</span><br />আমাদের কাছে
        </h1>
        <div className="flex gap-3 flex-wrap mb-9 pb-7 border-b border-border">
          <MetaTag>🗓️ কার্যকর: ১ জানুয়ারি ২০২৫</MetaTag>
          <MetaTag>📝 সংস্করণ: ২.০</MetaTag>
        </div>

        <HBox variant="green">
          <strong>🔒 সংক্ষেপে:</strong> আমরা তোমার ব্যক্তিগত তথ্য কখনো তৃতীয় পক্ষের কাছে বিক্রি করি না। তোমার তথ্য শুধুমাত্র তোমার শেখার অভিজ্ঞতা উন্নত করতে ব্যবহার করা হয়।
        </HBox>

        <Section title="১. আমরা কোন তথ্য সংগ্রহ করি">
          <Sub>ক) তুমি যা তথ্য দাও:</Sub>
          <UL items={[
            <><strong className="text-foreground">অ্যাকাউন্ট তথ্য:</strong> নাম, ইমেইল ঠিকানা, মোবাইল নম্বর (ঐচ্ছিক), প্রোফাইল ছবি</>,
            <><strong className="text-foreground">পেমেন্ট তথ্য:</strong> লেনদেনের রেকর্ড (কিন্তু কার্ড নম্বর সরাসরি আমাদের কাছে সংরক্ষিত হয় না)</>,
            <><strong className="text-foreground">শিক্ষা তথ্য:</strong> কোর্স progress, quiz ফলাফল, assignment জমা</>,
            <><strong className="text-foreground">যোগাযোগ তথ্য:</strong> Support এ পাঠানো বার্তা, ফিডব্যাক ফর্মের তথ্য</>,
          ]} />
          <Sub>খ) স্বয়ংক্রিয়ভাবে সংগৃহীত তথ্য:</Sub>
          <UL items={[
            <><strong className="text-foreground">ডিভাইস তথ্য:</strong> Browser ধরন, Operating System, স্ক্রিন রেজোলিউশন</>,
            <><strong className="text-foreground">ব্যবহার তথ্য:</strong> কোন পেজে কতক্ষণ ছিলে, কোন ভিডিও দেখেছ</>,
            <><strong className="text-foreground">লগ তথ্য:</strong> IP ঠিকানা, লগইন সময়, browser লগ</>,
            <><strong className="text-foreground">Cookie তথ্য:</strong> আমাদের Cookie Policy দেখো</>,
          ]} />
        </Section>

        <Section title="২. কেন আমরা তথ্য ব্যবহার করি">
          <DocTable
            headers={["উদ্দেশ্য", "ব্যবহৃত তথ্য", "আইনি ভিত্তি"]}
            rows={[
              ["অ্যাকাউন্ট পরিচালনা", "নাম, ইমেইল", "চুক্তি পালন"],
              ["কোর্স সরবরাহ", "শিক্ষা তথ্য", "চুক্তি পালন"],
              ["পেমেন্ট প্রক্রিয়া", "লেনদেন তথ্য", "চুক্তি পালন"],
              ["Customer Support", "যোগাযোগ তথ্য", "বৈধ স্বার্থ"],
              ["Platform উন্নয়ন", "ব্যবহার তথ্য", "বৈধ স্বার্থ"],
              ["মার্কেটিং (সম্মতি সহ)", "ইমেইল", "সম্মতি"],
            ]}
          />
        </Section>

        <Section title="৩. তথ্য শেয়ার করা হয় কার সাথে">
          <Para>আমরা তোমার ব্যক্তিগত তথ্য <strong className="text-red-400">কখনো বিক্রি করি না।</strong> শুধুমাত্র নিম্নলিখিত ক্ষেত্রে শেয়ার হতে পারে:</Para>
          <UL items={[
            <><strong className="text-foreground">Payment Gateway:</strong> bKash, SSLCommerz — শুধু পেমেন্ট প্রক্রিয়ার জন্য</>,
            <><strong className="text-foreground">Email Service:</strong> ইমেইল পাঠানোর জন্য (যেমন: SendGrid)</>,
            <><strong className="text-foreground">Analytics:</strong> Google Analytics — Anonymous data হিসেবে</>,
            <><strong className="text-foreground">আইনি বাধ্যবাধকতা:</strong> আদালতের আদেশ বা সরকারি দাবিতে</>,
          ]} />
        </Section>

        <Section title="৪. তোমার অধিকার">
          <UL items={[
            <><strong className="text-foreground">✅ দেখার অধিকার:</strong> আমরা তোমার কোন তথ্য রাখি জানতে পারবে</>,
            <><strong className="text-foreground">✅ সংশোধনের অধিকার:</strong> ভুল তথ্য ঠিক করতে পারবে</>,
            <><strong className="text-foreground">✅ মুছে দেওয়ার অধিকার:</strong> অ্যাকাউন্ট ও তথ্য delete করতে পারবে</>,
            <><strong className="text-foreground">✅ সম্মতি প্রত্যাহারের অধিকার:</strong> Marketing email থেকে Unsubscribe করতে পারবে</>,
            <><strong className="text-foreground">✅ Data Portability:</strong> তোমার তথ্য Download করতে পারবে</>,
          ]} />
          <Para>এই অধিকার প্রয়োগ করতে: <strong className="text-primary">privacy@aishikhibanglay.com</strong></Para>
        </Section>

        <Section title="৫. তথ্য সুরক্ষা">
          <Para>আমরা তোমার তথ্য সুরক্ষায় ব্যবহার করি:</Para>
          <UL items={[
            "🔐 SSL/TLS Encryption — সব data transfer এ",
            "🔐 Bcrypt Password Hashing — পাসওয়ার্ড কখনো plain text এ নেই",
            "🔐 Two-Factor Authentication (ঐচ্ছিক)",
            "🔐 Regular Security Audits",
            "🔐 Limited Staff Access — শুধু প্রয়োজনীয় team সদস্যরা তথ্যে প্রবেশ করতে পারে",
          ]} />
        </Section>

        <Section title="৬. তথ্য সংরক্ষণ মেয়াদ">
          <UL items={[
            "অ্যাকাউন্ট সক্রিয় থাকলে: সব তথ্য সংরক্ষিত থাকে",
            "অ্যাকাউন্ট বন্ধ করলে: ৩০ দিনের মধ্যে ব্যক্তিগত তথ্য মুছে যাবে",
            "পেমেন্ট রেকর্ড: আইনি প্রয়োজনে ৫ বছর পর্যন্ত রাখা হয়",
          ]} />
        </Section>

        <Section title="৭. নিম্নবয়স্কদের গোপনীয়তা">
          <HBox variant="red">
            ⚠️ আমাদের প্ল্যাটফর্ম ১৩ বছরের কম বয়সীদের জন্য নয়। যদি আমরা জানতে পারি কোনো ১৩ বছরের কম বয়সী শিশুর তথ্য সংগৃহীত হয়েছে, অবিলম্বে তা মুছে দেওয়া হবে।
          </HBox>
        </Section>

        <Section title="৮. পলিসি পরিবর্তন">
          <Para>এই Privacy Policy পরিবর্তন হলে registered ইমেইলে জানানো হবে এবং website এ নোটিশ দেওয়া হবে। পরিবর্তনের ৩০ দিন পর তা কার্যকর হবে।</Para>
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

export default function PrivacyPolicy() {
  return <EditablePage slug="privacy-policy" fallback={<HardcodedPrivacyPolicy />} />;
}
