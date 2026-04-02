import { useState, useEffect } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useLocation } from "wouter";
import {
  Plus, Trash2, FileText, ExternalLink, Shield, Pencil, Loader2
} from "lucide-react";

interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  metaDescription: string;
  status: "draft" | "published";
  createdAt: string;
}

// ─── Default HTML content for each system page ───────────────────────────────
const SYSTEM_PAGE_CONTENT: Record<string, { title: string; html: string; meta: string }> = {
  "disclaimer": {
    title: "দাবিত্যাগ (Disclaimer)",
    meta: "AI শিখি বাংলায় ওয়েবসাইটের দাবিত্যাগ ও অস্বীকৃতি সংক্রান্ত নীতি।",
    html: `<p><em>সর্বশেষ আপডেট: ২০ জানুয়ারি, ২০২৫</em></p>

<h2>সাধারণ দাবিত্যাগ (General Disclaimer)</h2>
<p>"AI শিখি বাংলায়" ওয়েবসাইটে প্রদান করা সমস্ত তথ্য শুধুমাত্র সাধারণ শিক্ষামূলক এবং তথ্যমূলক উদ্দেশ্যে প্রকাশ করা হয়। আমরা তথ্যের সঠিকতা, প্রাসঙ্গিকতা এবং নির্ভরযোগ্যতা নিশ্চিত করার চেষ্টা করি, তবে আমরা কোনো প্রকার ওয়ারেন্টি বা গ্যারান্টি প্রদান করি না। এই ওয়েবসাইটের কোনো তথ্য ব্যবহার করে নেওয়া যেকোনো পদক্ষেপের জন্য আপনি নিজেই সম্পূর্ণ দায়ী থাকবেন।</p>

<h2>অ্যাফিলিয়েট লিঙ্ক বিজ্ঞপ্তি (Affiliate Disclaimer)</h2>
<p>আমাদের ওয়েবসাইটে শেয়ার করা কিছু লিঙ্ক অ্যাফিলিয়েট লিঙ্ক হতে পারে। এর মানে হলো, আপনি যদি সেই লিঙ্কে ক্লিক করে কোনো পণ্য বা পরিষেবা কেনেন, তবে কোনো অতিরিক্ত খরচ ছাড়াই আমরা একটি ছোট কমিশন পেতে পারি। এই কমিশন আমাদের ওয়েবসাইট পরিচালনা এবং নতুন কন্টেন্ট তৈরিতে সাহায্য করে। আমরা শুধুমাত্র সেইসব টুল এবং সার্ভিসগুলোই রিকমেন্ড করি যেগুলো সম্পর্কে আমরা নিজে আত্মবিশ্বাসী।</p>

<h2>পেশাদার পরামর্শ নয় (No Professional Advice)</h2>
<p>এই ওয়েবসাইটের কোনো কন্টেন্ট, টিউটোরিয়াল বা গাইডলাইন কোনো পেশাদার আইনি, আর্থিক বা প্রযুক্তিগত পরামর্শ হিসেবে গণ্য করা যাবে না। বিশেষ কোনো গুরুত্বপূর্ণ সিদ্ধান্ত নেওয়ার পূর্বে অবশ্যই একজন পেশাদারের পরামর্শ গ্রহণ করুন।</p>

<h2>ত্রুটি ও বাদ পড়া (Errors and Omissions)</h2>
<p>কৃত্রিম বুদ্ধিমত্তা (AI) একটি অত্যন্ত দ্রুত পরিবর্তনশীল প্রযুক্তি। আমরা আমাদের তথ্যগুলো হালনাগাদ রাখার সর্বোচ্চ চেষ্টা করি, কিন্তু তবুও কিছু তথ্য পুরনো বা অকার্যকর হয়ে যেতে পারে। তথ্যে কোনো অনিচ্ছাকৃত ভুল বা বাদ পড়ার জন্য "AI শিখি বাংলায়" কর্তৃপক্ষ দায়ী থাকবে না।</p>

<h2>বাহ্যিক লিঙ্ক (External Links Disclaimer)</h2>
<p>আমাদের ওয়েবসাইটে অন্যান্য বাহ্যিক ওয়েবসাইটের লিঙ্ক থাকতে পারে। সেইসব ওয়েবসাইটের কন্টেন্ট, তথ্যের সঠিকতা বা তাদের প্রাইভেসি পলিসির ওপর আমাদের কোনো নিয়ন্ত্রণ নেই। বাহ্যিক ওয়েবসাইটগুলো ভিজিট এবং ব্যবহারের সম্পূর্ণ ঝুঁকি ব্যবহারকারীর নিজস্ব।</p>

<h2>সম্মতি</h2>
<p>আমাদের ওয়েবসাইট ব্যবহার করার মাধ্যমে আপনি এতদ্বারা আমাদের দাবিত্যাগ (Disclaimer) এর সাথে সম্মতি জ্ঞাপন করছেন এবং এর শর্তাবলী মেনে নিচ্ছেন।</p>
<p>যোগাযোগ: <a href="mailto:contact@aishikhibanglay.com">contact@aishikhibanglay.com</a></p>`,
  },

  "privacy-policy": {
    title: "প্রাইভেসি পলিসি",
    meta: "AI শিখি বাংলায় ওয়েবসাইটের গোপনীয়তা নীতি।",
    html: `<p><em>সর্বশেষ আপডেট: ২০ জানুয়ারি, ২০২৫</em></p>

<h2>ভূমিকা (Introduction)</h2>
<p>"AI শিখি বাংলায়" (aishikhibanglay.com) এ আপনাকে স্বাগতম। আপনার গোপনীয়তা রক্ষা করা আমাদের অন্যতম প্রধান অগ্রাধিকার। এই প্রাইভেসি পলিসি ডকুমেন্টে আমরা ব্যাখ্যা করেছি কীভাবে আমরা আপনার তথ্য সংগ্রহ করি, ব্যবহার করি এবং সুরক্ষিত রাখি।</p>

<h2>তথ্য সংগ্রহ (Data Collection)</h2>
<p>আমরা প্রধানত দুই ধরনের তথ্য সংগ্রহ করে থাকি:</p>
<ul>
  <li><strong>ব্যক্তিগত তথ্য:</strong> আপনি যখন আমাদের সাথে যোগাযোগ করেন বা নিউজলেটারে সাবস্ক্রাইব করেন, তখন আমরা আপনার নাম এবং ইমেইল ঠিকানা সংগ্রহ করতে পারি।</li>
  <li><strong>নন-পার্সোনাল তথ্য:</strong> আমাদের ওয়েবসাইট ভিজিট করার সময় আপনার ব্রাউজার ধরন, আইপি অ্যাড্রেস (IP Address), অপারেটিং সিস্টেম, এবং ভিজিটের সময় ও পেজগুলোর তথ্য স্বয়ংক্রিয়ভাবে সংগৃহীত হতে পারে।</li>
</ul>

<h2>কুকি নীতি (Cookies)</h2>
<p>আমাদের ওয়েবসাইট কুকি (Cookies) ব্যবহার করে। কুকি হলো ছোট টেক্সট ফাইল যা আপনার ডিভাইসে সংরক্ষিত থাকে এবং আপনার ব্রাউজিং অভিজ্ঞতাকে আরও উন্নত ও ব্যক্তিগতকৃত করতে সাহায্য করে। আপনি চাইলে আপনার ব্রাউজার সেটিংস থেকে কুকি নিয়ন্ত্রণ বা বন্ধ করতে পারেন।</p>

<h2>Google AdSense এবং বিজ্ঞাপন</h2>
<p>আমাদের ওয়েবসাইটে Google AdSense বা অন্যান্য তৃতীয় পক্ষের বিজ্ঞাপন প্রদর্শিত হতে পারে। গুগল সহ তৃতীয় পক্ষের বিক্রেতারা কুকি ব্যবহার করে ব্যবহারকারীর পূর্ববর্তী ভিজিটের ওপর ভিত্তি করে বিজ্ঞাপন প্রদর্শন করে। গুগল ডার্ট (DART) কুকি ব্যবহার করে আপনার ইন্টারনেট ব্যবহারের ওপর ভিত্তি করে প্রাসঙ্গিক বিজ্ঞাপন দেখাতে পারে। আপনি গুগল অ্যাড সেটিংস থেকে ডার্ট কুকির ব্যবহার অপ্ট-আউট করতে পারেন।</p>

<h2>তৃতীয় পক্ষের লিঙ্ক (Third Party Links)</h2>
<p>আমাদের ওয়েবসাইটে অন্যান্য ওয়েবসাইটের লিঙ্ক থাকতে পারে। সেইসব তৃতীয় পক্ষের ওয়েবসাইটের প্রাইভেসি পলিসি আমাদের থেকে ভিন্ন হতে পারে। আমরা আপনাকে সেই ওয়েবসাইটগুলো ভিজিট করার সময় তাদের নিজস্ব প্রাইভেসি পলিসি পড়ে নেওয়ার অনুরোধ করছি। তৃতীয় পক্ষের ওয়েবসাইটের কন্টেন্ট বা কার্যক্রমের জন্য আমরা দায়ী নই।</p>

<h2>ব্যবহারকারীর অধিকার (User Rights)</h2>
<p>আপনার ব্যক্তিগত তথ্যের ওপর আপনার সম্পূর্ণ অধিকার রয়েছে। আপনি চাইলে আপনার প্রদানকৃত তথ্য মুছে ফেলার জন্য আমাদের অনুরোধ করতে পারেন।</p>

<h2>যোগাযোগ (Contact Information)</h2>
<p>এই প্রাইভেসি পলিসি সম্পর্কে আপনার কোনো প্রশ্ন থাকলে বা আপনার তথ্য সম্পর্কে জানতে চাইলে আমাদের সাথে যোগাযোগ করুন:</p>
<p><strong>ইমেইল:</strong> <a href="mailto:contact@aishikhibanglay.com">contact@aishikhibanglay.com</a></p>`,
  },

  "terms-and-conditions": {
    title: "শর্তাবলী (Terms & Conditions)",
    meta: "AI শিখি বাংলায় ওয়েবসাইট ব্যবহারের শর্তাবলী।",
    html: `<p><em>সর্বশেষ আপডেট: ২০ জানুয়ারি, ২০২৫</em></p>

<h2>শর্তাবলী গ্রহণ (Acceptance of Terms)</h2>
<p>"AI শিখি বাংলায়" ওয়েবসাইটটি ব্যবহার করার মাধ্যমে আপনি আমাদের এই শর্তাবলী এবং নিয়মকানুন মেনে চলতে সম্মতি প্রদান করছেন। আপনি যদি এই শর্তাবলীর কোনো অংশের সাথে একমত না হন, তবে অনুগ্রহ করে আমাদের ওয়েবসাইট ব্যবহার করা থেকে বিরত থাকুন।</p>

<h2>মেধা সম্পত্তি (Intellectual Property)</h2>
<p>এই ওয়েবসাইটের সকল কন্টেন্ট (টেক্সট, গ্রাফিক্স, লোগো, ভিডিও, এবং অন্যান্য উপাদান) "AI শিখি বাংলায়" এর নিজস্ব সম্পত্তি এবং কপিরাইট আইন দ্বারা সংরক্ষিত। আমাদের লিখিত পূর্বানুমতি ছাড়া কোনো কন্টেন্ট কপি, পুনরুৎপাদন, বিতরণ বা বাণিজ্যিক উদ্দেশ্যে ব্যবহার করা সম্পূর্ণ নিষিদ্ধ।</p>

<h2>ব্যবহারকারীর আচরণ (User Conduct)</h2>
<p>ওয়েবসাইট ব্যবহার করার সময় আপনাকে অবশ্যই নিম্নলিখিত বিষয়গুলো মেনে চলতে হবে:</p>
<ul>
  <li>এমন কোনো কার্যকলাপ করা যাবে না যা ওয়েবসাইট বা এর সার্ভারের ক্ষতি করতে পারে।</li>
  <li>স্প্যামিং, হ্যাকিং বা ক্ষতিকর সফটওয়্যার ছড়ানোর চেষ্টা করা যাবে না।</li>
  <li>অবৈধ, মানহানিকর বা অশালীন মন্তব্য করা বা কন্টেন্ট পোস্ট করা থেকে বিরত থাকতে হবে।</li>
</ul>

<h2>ওয়ারেন্টি অস্বীকৃতি (Disclaimer of Warranties)</h2>
<p>আমরা ওয়েবসাইটে প্রদত্ত তথ্যের সঠিকতা এবং হালনাগাদ নিশ্চিত করার সর্বোচ্চ চেষ্টা করি। তবে আমরা গ্যারান্টি দিচ্ছি না যে সমস্ত তথ্য সম্পূর্ণ নির্ভুল বা ত্রুটিমুক্ত হবে। এই ওয়েবসাইট এবং এর কন্টেন্টগুলো "যেমন আছে" (As is) ভিত্তিতে প্রদান করা হয়।</p>

<h2>দায়বদ্ধতার সীমাবদ্ধতা (Limitation of Liability)</h2>
<p>এই ওয়েবসাইট ব্যবহার করার ফলে আপনার কোনো প্রত্যক্ষ, পরোক্ষ বা আনুষঙ্গিক ক্ষতি হলে তার জন্য "AI শিখি বাংলায়" কর্তৃপক্ষ দায়ী থাকবে না। আমাদের শেয়ার করা কোনো টুল বা সফটওয়্যার ব্যবহারের ফলে আপনার ডেটা বা ডিভাইসের কোনো ক্ষতি হলে আমরা তার দায়ভার নেব না।</p>

<h2>প্রযোজ্য আইন (Governing Law)</h2>
<p>এই শর্তাবলী বাংলাদেশের প্রচলিত আইন অনুযায়ী পরিচালিত এবং ব্যাখ্যা করা হবে। যেকোনো আইনি বিরোধের ক্ষেত্রে বাংলাদেশের বিচারব্যবস্থার এক্তিয়ার প্রযোজ্য হবে।</p>

<h2>যোগাযোগ (Contact)</h2>
<p>আমাদের শর্তাবলী সম্পর্কে আপনার কোনো প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন:</p>
<p><strong>ইমেইল:</strong> <a href="mailto:contact@aishikhibanglay.com">contact@aishikhibanglay.com</a></p>`,
  },

  "cookie-policy": {
    title: "কুকি পলিসি",
    meta: "AI শিখি বাংলায় ওয়েবসাইটের কুকি ব্যবহার নীতি।",
    html: `<p><em>সর্বশেষ আপডেট: ২০ জানুয়ারি, ২০২৫</em></p>

<h2>কুকি কী? (What are cookies?)</h2>
<p>কুকি (Cookies) হলো ছোট ডেটা ফাইল বা টেক্সট ফাইল যা ওয়েবসাইটগুলো আপনার কম্পিউটার, মোবাইল ফোন বা অন্যান্য ডিভাইসে সংরক্ষণ করে যখন আপনি সেই ওয়েবসাইটগুলো ভিজিট করেন। এগুলো আপনার ব্রাউজিং অভিজ্ঞতা উন্নত করতে, আপনার পছন্দগুলো মনে রাখতে এবং ওয়েবসাইট কীভাবে কাজ করছে তা বুঝতে আমাদের সাহায্য করে।</p>

<h2>কুকির প্রকারভেদ (Types of cookies)</h2>
<p>আমরা আমাদের ওয়েবসাইটে বিভিন্ন ধরনের কুকি ব্যবহার করে থাকি:</p>
<ul>
  <li><strong>এসেনশিয়াল কুকি (Essential Cookies):</strong> এই কুকিগুলো ওয়েবসাইটের মৌলিক কাজগুলো সম্পাদন করার জন্য অপরিহার্য। এগুলো ছাড়া ওয়েবসাইট সঠিকভাবে কাজ নাও করতে পারে।</li>
  <li><strong>অ্যানালিটিক্স কুকি (Analytics Cookies):</strong> এই কুকিগুলো আমাদের বুঝতে সাহায্য করে দর্শকরা কীভাবে আমাদের ওয়েবসাইট ব্যবহার করেন। যেমন: কোন পেজগুলো বেশি দেখা হচ্ছে, ভিজিটররা কতক্ষণ সময় কাটাচ্ছেন। আমরা সাধারণত এর জন্য গুগল অ্যানালিটিক্স ব্যবহার করি।</li>
  <li><strong>বিজ্ঞাপন কুকি (Advertising Cookies):</strong> এই কুকিগুলো আপনাকে আপনার আগ্রহ অনুযায়ী প্রাসঙ্গিক বিজ্ঞাপন দেখাতে ব্যবহৃত হয়। তৃতীয় পক্ষের বিজ্ঞাপনদাতারা (যেমন Google AdSense) এই কুকিগুলো সেট করতে পারে।</li>
</ul>

<h2>Google AdSense কুকি ব্যাখ্যা</h2>
<p>আমাদের ওয়েবসাইটে Google AdSense এর মাধ্যমে বিজ্ঞাপন প্রদর্শিত হয়। গুগল এবং তার পার্টনাররা আপনার ব্রাউজারে কুকি (যেমন DART কুকি) সেট করতে পারে।</p>
<ul>
  <li>গুগল ডার্ট কুকি ব্যবহার করে আপনার ইন্টারনেট ব্রাউজিং হিস্ট্রির ওপর ভিত্তি করে প্রাসঙ্গিক বিজ্ঞাপন প্রদর্শন করে।</li>
  <li>গুগল অ্যাড সেটিংস (Google Ad Settings) ভিজিট করে আপনি পার্সোনালাইজড বিজ্ঞাপন এবং ডার্ট কুকির ব্যবহার অপ্ট-আউট করতে পারেন।</li>
</ul>

<h2>কুকি নিয়ন্ত্রণ (How to control cookies)</h2>
<p>আপনি চাইলে আপনার ডিভাইসে কুকি সংরক্ষণ নিয়ন্ত্রণ বা মুছে ফেলতে পারেন। প্রায় সব ব্রাউজারেই সেটিংসে গিয়ে কুকি ব্লক বা ডিলিট করার অপশন থাকে। তবে মনে রাখবেন, সমস্ত কুকি ব্লক করলে আমাদের ওয়েবসাইটের কিছু ফিচার সঠিকভাবে কাজ নাও করতে পারে।</p>

<h2>যোগাযোগ (Contact Info)</h2>
<p>আমাদের কুকি পলিসি সম্পর্কে আপনার কোনো প্রশ্ন বা মতামত থাকলে আমাদের জানান:</p>
<p><strong>ইমেইল:</strong> <a href="mailto:contact@aishikhibanglay.com">contact@aishikhibanglay.com</a></p>`,
  },
};

// System pages list
const SYSTEM_PAGES = Object.entries(SYSTEM_PAGE_CONTENT).map(([slug, data]) => ({
  slug,
  title: data.title,
  url: `/${slug}`,
}));

function PagesManagerContent() {
  const [, setLocation] = useLocation();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState<string | null>(null);

  const fetchPages = async () => {
    const res = await fetch("/api/admin/pages", { credentials: "include" });
    if (res.ok) setPages(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchPages(); }, []);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`"${title}" মুছে ফেললে এই পেজটি আবার ডিফল্ট কন্টেন্টে ফিরে যাবে। নিশ্চিত?`)) return;
    const res = await fetch(`/api/admin/pages/${id}`, { method: "DELETE", credentials: "include" });
    if (res.ok) setPages((prev) => prev.filter((p) => p.id !== id));
  };

  // Create system page with full default content and open editor
  const handleCreateSystemPage = async (sp: typeof SYSTEM_PAGES[0]) => {
    setCreating(sp.slug);
    const pageData = SYSTEM_PAGE_CONTENT[sp.slug];
    const res = await fetch("/api/admin/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title: pageData.title,
        slug: sp.slug,
        content: pageData.html,
        metaDescription: pageData.meta,
        status: "published",
      }),
    });
    if (res.ok) {
      const created: Page = await res.json();
      setCreating(null);
      setLocation(`/admin/pages/${created.id}/edit`);
    } else {
      setCreating(null);
    }
  };

  const customPages = pages.filter(
    (p) => !SYSTEM_PAGES.some((sp) => sp.slug === p.slug)
  );

  const systemPagesWithDb = SYSTEM_PAGES.map((sp) => ({
    ...sp,
    dbPage: pages.find((p) => p.slug === sp.slug) ?? null,
  }));

  return (
    <AdminLayout title="পেজ ম্যানেজার">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">

        {/* ── System Pages ── */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-amber-400" />
            <h2 className="text-white font-semibold text-sm">সিস্টেম পেজ</h2>
          </div>
          <p className="text-xs text-gray-500 mb-3 ml-6">
            "এডিট করুন" ক্লিক করলে বিদ্যমান কন্টেন্ট সম্পাদক-এ লোড হবে — সরাসরি পরিবর্তন করুন। ট্র্যাশ আইকনে ক্লিক করলে ডিফল্টে ফিরে যাবে।
          </p>
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-800">
            {loading ? (
              <div className="py-8 flex justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
              </div>
            ) : systemPagesWithDb.map((sp) => (
              <div key={sp.slug} className="px-5 py-4 flex items-center gap-4">
                <FileText className="w-5 h-5 text-amber-500/60 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-medium text-sm">{sp.title}</span>
                    {sp.dbPage ? (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        sp.dbPage.status === "published"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-700 text-gray-400"
                      }`}>
                        {sp.dbPage.status === "published" ? "✏️ কাস্টম কন্টেন্ট সক্রিয়" : "ড্রাফট"}
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-500 border border-gray-700">
                        ডিফল্ট কন্টেন্ট
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-gray-600 text-xs">{sp.url}</span>
                    <a href={sp.url} target="_blank" rel="noopener noreferrer"
                      className="text-gray-600 hover:text-cyan-400 transition-colors" title="পেজ দেখুন">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {sp.dbPage ? (
                    <>
                      <button
                        onClick={() => setLocation(`/admin/pages/${sp.dbPage!.id}/edit`)}
                        className="flex items-center gap-1.5 text-gray-400 hover:text-cyan-400 text-xs px-3 py-1.5 rounded border border-gray-700 hover:border-cyan-500 transition-colors"
                      >
                        <Pencil className="w-3 h-3" /> সম্পাদনা
                      </button>
                      <button
                        onClick={() => handleDelete(sp.dbPage!.id, sp.title)}
                        className="text-gray-600 hover:text-red-400 transition-colors" title="ডিফল্টে ফিরে যান"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleCreateSystemPage(sp)}
                      disabled={creating === sp.slug}
                      className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs px-3 py-1.5 rounded border border-amber-500/20 hover:border-amber-500/40 transition-colors disabled:opacity-50"
                    >
                      {creating === sp.slug ? (
                        <><Loader2 className="w-3 h-3 animate-spin" /> লোড হচ্ছে...</>
                      ) : (
                        <><Pencil className="w-3 h-3" /> এডিট করুন</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Custom Pages ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold text-sm">কাস্টম পেজ</h2>
            <button
              onClick={() => setLocation("/admin/pages/new")}
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> নতুন পেজ
            </button>
          </div>

          {loading ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl py-8 flex justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
            </div>
          ) : customPages.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center">
              <FileText className="w-10 h-10 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">কোনো কাস্টম পেজ নেই।</p>
              <button
                onClick={() => setLocation("/admin/pages/new")}
                className="mt-3 text-cyan-400 hover:text-cyan-300 text-sm"
              >
                প্রথম পেজটি তৈরি করুন →
              </button>
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-800">
              {customPages.map((page) => (
                <div key={page.id} className="px-5 py-4 flex items-center gap-4">
                  <FileText className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-sm">{page.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        page.status === "published"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-700 text-gray-400"
                      }`}>
                        {page.status === "published" ? "প্রকাশিত" : "ড্রাফট"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-gray-500 text-xs">/pages/{page.slug}</span>
                      {page.status === "published" && (
                        <a href={`/pages/${page.slug}`} target="_blank" rel="noopener noreferrer"
                          className="text-gray-600 hover:text-cyan-400 transition-colors">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setLocation(`/admin/pages/${page.id}/edit`)}
                      className="flex items-center gap-1.5 text-gray-400 hover:text-cyan-400 text-xs px-3 py-1.5 rounded border border-gray-700 hover:border-cyan-500 transition-colors"
                    >
                      <Pencil className="w-3 h-3" /> সম্পাদনা
                    </button>
                    <button
                      onClick={() => handleDelete(page.id, page.title)}
                      className="text-gray-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default function PagesManagerPage() {
  return (
    <AdminGuard>
      <PagesManagerContent />
    </AdminGuard>
  );
}
