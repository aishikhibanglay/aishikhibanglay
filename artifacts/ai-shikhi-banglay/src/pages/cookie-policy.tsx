import { motion } from "framer-motion";
import { PageSEO } from "@/components/PageSEO";
import { EditablePage } from "@/components/EditablePage";

function HardcodedCookiePolicy() {
  const lastUpdated = "২০ জানুয়ারি, ২০২৫";
  return (
    <div className="min-h-screen py-12 md:py-20">
      <PageSEO title="কুকি নীতি" canonical="/cookie-policy" />
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl md:text-5xl font-bold mb-6">কুকি <span className="text-primary">পলিসি</span></h1>
          <p className="text-muted-foreground mb-12">সর্বশেষ আপডেট: {lastUpdated}</p>
          <div className="space-y-12 text-lg text-foreground/90 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">কুকি কী? (What are cookies?)</h2>
              <p>কুকি (Cookies) হলো ছোট ডেটা ফাইল বা টেক্সট ফাইল যা ওয়েবসাইটগুলো আপনার কম্পিউটার, মোবাইল ফোন বা অন্যান্য ডিভাইসে সংরক্ষণ করে যখন আপনি সেই ওয়েবসাইটগুলো ভিজিট করেন।</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">কুকির প্রকারভেদ (Types of cookies)</h2>
              <p className="mb-4">আমরা আমাদের ওয়েবসাইটে বিভিন্ন ধরনের কুকি ব্যবহার করে থাকি:</p>
              <div className="space-y-6 pl-2">
                <div className="border-l-4 border-primary pl-4 py-1">
                  <h3 className="font-bold text-xl mb-2">এসেনশিয়াল কুকি (Essential Cookies)</h3>
                  <p>এই কুকিগুলো ওয়েবসাইটের মৌলিক কাজগুলো সম্পাদন করার জন্য অপরিহার্য।</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4 py-1">
                  <h3 className="font-bold text-xl mb-2">অ্যানালিটিক্স কুকি (Analytics Cookies)</h3>
                  <p>এই কুকিগুলো আমাদের বুঝতে সাহায্য করে দর্শকরা কীভাবে আমাদের ওয়েবসাইট ব্যবহার করেন।</p>
                </div>
                <div className="border-l-4 border-amber-500 pl-4 py-1">
                  <h3 className="font-bold text-xl mb-2">বিজ্ঞাপন কুকি (Advertising Cookies)</h3>
                  <p>এই কুকিগুলো আপনাকে আপনার আগ্রহ অনুযায়ী প্রাসঙ্গিক বিজ্ঞাপন দেখাতে ব্যবহৃত হয়।</p>
                </div>
              </div>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">Google AdSense কুকি ব্যাখ্যা</h2>
              <p className="mb-4">আমাদের ওয়েবসাইটে Google AdSense এর মাধ্যমে বিজ্ঞাপন প্রদর্শিত হয়। গুগল এবং তার পার্টনাররা আপনার ব্রাউজারে কুকি (যেমন DART কুকি) সেট করতে পারে।</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>গুগল ডার্ট কুকি ব্যবহার করে আপনার ব্রাউজিং হিস্ট্রির ওপর ভিত্তি করে প্রাসঙ্গিক বিজ্ঞাপন প্রদর্শন করে।</li>
                <li>গুগল অ্যাড সেটিংস ভিজিট করে আপনি পার্সোনালাইজড বিজ্ঞাপন অপ্ট-আউট করতে পারেন।</li>
              </ul>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">কুকি নিয়ন্ত্রণ (How to control cookies)</h2>
              <p>আপনি চাইলে আপনার ডিভাইসে কুকি সংরক্ষণ নিয়ন্ত্রণ বা মুছে ফেলতে পারেন। তবে মনে রাখবেন, সমস্ত কুকি ব্লক করলে আমাদের ওয়েবসাইটের কিছু ফিচার সঠিকভাবে কাজ নাও করতে পারে।</p>
            </section>
            <section className="bg-secondary/50 p-6 md:p-8 rounded-2xl border border-border mt-12">
              <h2 className="text-2xl font-bold text-primary mb-4">যোগাযোগ (Contact Info)</h2>
              <p className="mb-4">আমাদের কুকি পলিসি সম্পর্কে আপনার কোনো প্রশ্ন বা মতামত থাকলে আমাদের জানান:</p>
              <p className="font-medium text-xl">ইমেইল: <a href="mailto:contact@aishikhibanglay.com" className="text-primary hover:underline">contact@aishikhibanglay.com</a></p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function CookiePolicy() {
  return <EditablePage slug="cookie-policy" fallback={<HardcodedCookiePolicy />} />;
}
