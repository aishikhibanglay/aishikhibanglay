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

function HardcodedDisclaimer() {
  return (
    <div className="min-h-screen py-12 md:py-20">
      <PageSEO title="দায়বদ্ধতা অস্বীকৃতি" canonical="/disclaimer" />
      <div className="container mx-auto px-4 max-w-3xl">
        <Eyebrow text="দাবিত্যাগ" />
        <h1 className="text-[clamp(26px,4vw,40px)] font-bold leading-tight mb-2.5">
          সৎ থাকাটাই<br />
          <span className="text-primary">আমাদের নীতি</span>
        </h1>
        <div className="flex gap-3 flex-wrap mb-9 pb-7 border-b border-border">
          <MetaTag>🗓️ কার্যকর: ১ জানুয়ারি ২০২৫</MetaTag>
        </div>

        <HBox variant="gold">
          <strong>📌 বিশেষ নোট:</strong> আমরা সর্বদা সৎ থাকতে বিশ্বাস করি। এই পেজে আমরা স্পষ্টভাবে জানিয়ে দিচ্ছি আমাদের সেবার সীমাবদ্ধতা কোথায়।
        </HBox>

        <Section title="১. শিক্ষামূলক উদ্দেশ্য">
          <Para>
            AI শিখি বাংলায় প্ল্যাটফর্মের সকল কন্টেন্ট — কোর্স, ব্লগ পোস্ট, ভিডিও, নোটস — সম্পূর্ণ{" "}
            <strong className="text-foreground">শিক্ষামূলক উদ্দেশ্যে</strong> তৈরি। এগুলো কোনো পেশাদার পরামর্শের বিকল্প নয়।
          </Para>
          <HBox variant="red">
            ⚠️ আমাদের কন্টেন্ট Professional Legal, Financial, Medical, বা Engineering Advice এর বিকল্প নয়। এসব ক্ষেত্রে সর্বদা qualified professional এর পরামর্শ নাও।
          </HBox>
        </Section>

        <Section title="২. Income ও Career সম্পর্কিত দাবিত্যাগ">
          <Para>আমাদের কোর্স ও মার্কেটিং মেটেরিয়ালে যে income সংখ্যাগুলো উল্লেখ থাকে, সেগুলো:</Para>
          <UL items={[
            <>বাস্তব শিক্ষার্থীদের অভিজ্ঞতার উপর ভিত্তি করে — কিন্তু সবার ক্ষেত্রে একই ফলাফল হবে এমন <strong className="text-foreground">কোনো গ্যারান্টি নেই</strong></>,
            "Income নির্ভর করে ব্যক্তির effort, দক্ষতা, বাজার পরিস্থিতি এবং অনেক বাহ্যিক কারণের উপর",
            "পূর্ববর্তী ফলাফল ভবিষ্যতের ফলাফলের নিশ্চয়তা দেয় না",
          ]} />
          <HBox>
            💡 আমরা তোমাকে দক্ষতা অর্জনে সাহায্য করতে পারি — কিন্তু সাফল্য নির্ভর করে তোমার পরিশ্রম ও প্রয়োগের উপর।
          </HBox>
        </Section>

        <Section title="৩. AI তথ্যের নির্ভুলতা">
          <Para>AI প্রযুক্তি অত্যন্ত দ্রুত পরিবর্তনশীল। তাই:</Para>
          <UL items={[
            "আমাদের কোর্সে দেওয়া AI tool সংক্রান্ত তথ্য পরবর্তীতে পরিবর্তিত হতে পারে",
            "Third-party tools (ChatGPT, Gemini ইত্যাদি) এর features, pricing বা availability পরিবর্তন হলে আমরা দায়ী নই",
            "আমরা নিয়মিত কোর্স আপডেট করার চেষ্টা করি, কিন্তু সব পরিবর্তন তাৎক্ষণিকভাবে প্রতিফলিত নাও হতে পারে",
          ]} />
        </Section>

        <Section title="৪. বাহ্যিক লিংক ও রেফারেন্স">
          <Para>আমাদের প্ল্যাটফর্মে তৃতীয় পক্ষের ওয়েবসাইট বা tools এর লিংক থাকতে পারে। এই লিংকগুলো সুবিধার জন্য দেওয়া হয়। তৃতীয় পক্ষের সাইটের কন্টেন্ট, নীতি বা কার্যক্রমের জন্য আমরা দায়ী নই।</Para>
        </Section>

        <Section title="৫. Affiliate ও Sponsored কন্টেন্ট">
          <Para>কখনো কখনো আমাদের কোর্সে বা ব্লগে আমরা নির্দিষ্ট AI tools উল্লেখ করি। কিছু ক্ষেত্রে আমরা Affiliate Commission পেতে পারি — কিন্তু আমাদের সুপারিশ সবসময় শিক্ষার্থীর সেরা স্বার্থ বিবেচনা করে দেওয়া হয়। Sponsored কন্টেন্ট সর্বদা স্পষ্টভাবে চিহ্নিত থাকবে।</Para>
        </Section>

        <Section title="৬. Technology ও Platform Disclaimer">
          <UL items={[
            "আমরা platform ২৪/৭ উপলব্ধ রাখার চেষ্টা করি — কিন্তু technical issues এর কারণে interruption হতে পারে",
            "Scheduled maintenance এর আগাম নোটিশ দেওয়া হবে",
            "Data loss এর বিরুদ্ধে আমরা সর্বোচ্চ সতর্কতা নিই, কিন্তু absolute guarantee দেওয়া সম্ভব নয়",
          ]} />
        </Section>

        <Section title="৭. পেশাদার পরামর্শ Disclaimer">
          <DocTable
            headers={["বিষয়", "আমরা যা দিই", "আমরা যা দিই না"]}
            rows={[
              ["আইন", "AI ও প্রযুক্তি বিষয়ক সাধারণ তথ্য", "Legal Advice"],
              ["বিনিয়োগ", "AI career সুযোগের তথ্য", "Financial/Investment Advice"],
              ["চিকিৎসা", "AI in Healthcare সম্পর্কে শিক্ষা", "Medical Diagnosis/Advice"],
              ["নিয়োগ", "Career guidance ও দক্ষতা উন্নয়ন", "Job Guarantee"],
            ]}
          />
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

export default function Disclaimer() {
  return <EditablePage slug="disclaimer" fallback={<HardcodedDisclaimer />} />;
}
