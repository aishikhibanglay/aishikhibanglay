import { useState } from "react";
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

function Sub({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sky-400 font-semibold text-sm mt-4 mb-2">{children}</h3>;
}

function Para({ children }: { children: React.ReactNode }) {
  return <p className="text-[14.5px] leading-[1.95] text-muted-foreground mb-3">{children}</p>;
}

function Toggle({ defaultOn = false, locked = false }: { defaultOn?: boolean; locked?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => !locked && setOn(!on)}
      title={locked ? "এটি বন্ধ করা যাবে না" : "ক্লিক করে চালু/বন্ধ করো"}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
        on ? "bg-emerald-500" : "bg-border"
      } ${locked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
          on ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

function CookieRow({ title, desc, defaultOn = false, locked = false }: { title: string; desc: string; defaultOn?: boolean; locked?: boolean }) {
  return (
    <div className="flex items-center justify-between bg-card border border-border rounded-lg p-4 mb-2.5">
      <div className="flex-1 mr-4">
        <h4 className="text-sm font-bold text-foreground mb-1">{title}</h4>
        <p className="text-[12.5px] text-muted-foreground">{desc}</p>
      </div>
      <Toggle defaultOn={defaultOn} locked={locked} />
    </div>
  );
}

function HardcodedCookiePolicy() {
  return (
    <div className="min-h-screen py-12 md:py-20">
      <PageSEO title="কুকি নীতি" canonical="/cookie-policy" />
      <div className="container mx-auto px-4 max-w-3xl">
        <Eyebrow text="কুকি পলিসি" />
        <h1 className="text-[clamp(26px,4vw,40px)] font-bold leading-tight mb-2.5">
          কুকি সম্পর্কে<br />
          <span className="text-primary">সহজ ভাষায়</span>
        </h1>
        <div className="flex gap-3 flex-wrap mb-9 pb-7 border-b border-border">
          <MetaTag>🗓️ কার্যকর: ১ জানুয়ারি ২০২৫</MetaTag>
        </div>

        <Section title="১. কুকি কী?">
          <Para>কুকি হলো ছোট ছোট text file যেগুলো তুমি কোনো website visit করলে তোমার browser এ সংরক্ষিত হয়। এগুলো website টাকে তোমাকে মনে রাখতে এবং তোমার experience ভালো করতে সাহায্য করে।</Para>
          <HBox variant="green">
            🍪 <strong>উদাহরণ:</strong> তুমি login করলে পরের বার আবার করতে না হয় — এটা সম্ভব হয় Cookie এর কারণে। তোমার ভিডিও কোথায় থামিয়েছিলে সেটা মনে রাখাও Cookie এর কাজ।
          </HBox>
        </Section>

        <Section title="২. আমরা কোন ধরনের কুকি ব্যবহার করি">
          <CookieRow
            title="🔒 অপরিহার্য কুকি (Essential Cookies)"
            desc="Login session, security token — এগুলো ছাড়া site কাজ করবে না"
            defaultOn={true}
            locked={true}
          />
          <CookieRow
            title="📊 Analytics কুকি"
            desc="কোন পেজ বেশি দেখা হচ্ছে, কতক্ষণ থাকছ — এই তথ্য site উন্নয়নে কাজে লাগে"
            defaultOn={true}
          />
          <CookieRow
            title="🎯 Preference কুকি"
            desc="তোমার ভাষা পছন্দ, video quality, theme setting মনে রাখে"
            defaultOn={true}
          />
          <CookieRow
            title="📢 Marketing কুকি"
            desc="তোমার আগ্রহ অনুযায়ী কোর্স suggest করতে ব্যবহৃত হয়"
            defaultOn={false}
          />
          <p className="text-xs text-muted-foreground mt-2">* উপরের toggles demo — আসল preference তোমার browser settings থেকে নিয়ন্ত্রণ করো।</p>
        </Section>

        <Section title="৩. কুকির বিস্তারিত তালিকা">
          <DocTable
            headers={["কুকির নাম", "উদ্দেশ্য", "মেয়াদ", "ধরন"]}
            rows={[
              ["session_token", "Login session বজায় রাখা", "Session", "Essential"],
              ["user_progress", "Course progress সংরক্ষণ", "১ বছর", "Essential"],
              ["csrf_token", "Security protection", "Session", "Essential"],
              ["_ga (Google)", "Analytics", "২ বছর", "Analytics"],
              ["video_quality", "তোমার video quality preference", "৬ মাস", "Preference"],
              ["lang_pref", "ভাষা পছন্দ", "১ বছর", "Preference"],
              ["referral_src", "কোথা থেকে এসেছ", "৩০ দিন", "Marketing"],
            ]}
          />
        </Section>

        <Section title="৪. কুকি কীভাবে নিয়ন্ত্রণ করবে">
          <Sub>Browser থেকে:</Sub>
          <UL items={[
            <><strong className="text-foreground">Chrome:</strong> Settings → Privacy &amp; Security → Cookies</>,
            <><strong className="text-foreground">Firefox:</strong> Settings → Privacy &amp; Security → Cookies and Site Data</>,
            <><strong className="text-foreground">Safari:</strong> Preferences → Privacy → Manage Website Data</>,
            <><strong className="text-foreground">Edge:</strong> Settings → Privacy, search, and services → Cookies</>,
          ]} />
          <HBox variant="red">
            ⚠️ Essential Cookies বন্ধ করলে Platform সঠিকভাবে কাজ নাও করতে পারে — login করতে সমস্যা হবে।
          </HBox>
        </Section>

        <Section title="৫. Third-Party Cookies">
          <Para>আমরা নিম্নলিখিত third-party services ব্যবহার করি যাদের নিজস্ব cookie policy আছে:</Para>
          <UL items={[
            <><strong className="text-foreground">Google Analytics:</strong> Website traffic বিশ্লেষণ</>,
            <><strong className="text-foreground">YouTube:</strong> Embedded videos এর জন্য</>,
            <><strong className="text-foreground">SSLCommerz / bKash:</strong> Payment processing এর জন্য</>,
            <><strong className="text-foreground">Facebook Pixel:</strong> Marketing optimization (opt-out সম্ভব)</>,
          ]} />
        </Section>

        <Section title="৬. Cookie Policy আপডেট">
          <Para>এই Policy পরিবর্তন হলে ওয়েবসাইটে notification দেখানো হবে। গুরুত্বপূর্ণ পরিবর্তনে email এও জানানো হবে।</Para>
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

export default function CookiePolicy() {
  return <EditablePage slug="cookie-policy" fallback={<HardcodedCookiePolicy />} />;
}
