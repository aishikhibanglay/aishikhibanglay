import { motion } from "framer-motion";
import { PageSEO } from "@/components/PageSEO";

export default function PrivacyPolicy() {
  const lastUpdated = "২০ জানুয়ারি, ২০২৫";

  return (
    <div className="min-h-screen py-12 md:py-20">
      <PageSEO title="গোপনীয়তা নীতি" canonical="/privacy-policy" noIndex={false} />
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-6">প্রাইভেসি <span className="text-primary">পলিসি</span></h1>
          <p className="text-muted-foreground mb-12">সর্বশেষ আপডেট: {lastUpdated}</p>

          <div className="space-y-12 text-lg text-foreground/90 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">ভূমিকা (Introduction)</h2>
              <p>
                "AI শিখি বাংলায়" (aishikhibanglay.com) এ আপনাকে স্বাগতম। আপনার গোপনীয়তা রক্ষা করা আমাদের অন্যতম প্রধান অগ্রাধিকার। এই প্রাইভেসি পলিসি ডকুমেন্টে আমরা ব্যাখ্যা করেছি কীভাবে আমরা আপনার তথ্য সংগ্রহ করি, ব্যবহার করি এবং সুরক্ষিত রাখি।
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">তথ্য সংগ্রহ (Data Collection)</h2>
              <p className="mb-4">আমরা প্রধানত দুই ধরনের তথ্য সংগ্রহ করে থাকি:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>ব্যক্তিগত তথ্য:</strong> আপনি যখন আমাদের সাথে যোগাযোগ করেন বা নিউজলেটারে সাবস্ক্রাইব করেন, তখন আমরা আপনার নাম এবং ইমেইল ঠিকানা সংগ্রহ করতে পারি।</li>
                <li><strong>নন-পার্সোনাল তথ্য:</strong> আমাদের ওয়েবসাইট ভিজিট করার সময় আপনার ব্রাউজার ধরন, আইপি অ্যাড্রেস (IP Address), অপারেটিং সিস্টেম, এবং ভিজিটের সময় ও পেজগুলোর তথ্য স্বয়ংক্রিয়ভাবে সংগৃহীত হতে পারে।</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">কুকি নীতি (Cookies)</h2>
              <p>
                আমাদের ওয়েবসাইট কুকি (Cookies) ব্যবহার করে। কুকি হলো ছোট টেক্সট ফাইল যা আপনার ডিভাইসে সংরক্ষিত থাকে এবং আপনার ব্রাউজিং অভিজ্ঞতাকে আরও উন্নত ও ব্যক্তিগতকৃত করতে সাহায্য করে। আপনি চাইলে আপনার ব্রাউজার সেটিংস থেকে কুকি নিয়ন্ত্রণ বা বন্ধ করতে পারেন।
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">Google AdSense এবং বিজ্ঞাপন</h2>
              <p>
                আমাদের ওয়েবসাইটে Google AdSense বা অন্যান্য তৃতীয় পক্ষের বিজ্ঞাপন প্রদর্শিত হতে পারে। গুগল সহ তৃতীয় পক্ষের বিক্রেতারা কুকি ব্যবহার করে ব্যবহারকারীর পূর্ববর্তী ভিজিটের ওপর ভিত্তি করে বিজ্ঞাপন প্রদর্শন করে। গুগল ডার্ট (DART) কুকি ব্যবহার করে আপনার ইন্টারনেট ব্যবহারের ওপর ভিত্তি করে প্রাসঙ্গিক বিজ্ঞাপন দেখাতে পারে। আপনি গুগল অ্যাড সেটিংস থেকে ডার্ট কুকির ব্যবহার অপ্ট-আউট করতে পারেন।
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">তৃতীয় পক্ষের লিঙ্ক (Third Party Links)</h2>
              <p>
                আমাদের ওয়েবসাইটে অন্যান্য ওয়েবসাইটের লিঙ্ক থাকতে পারে। সেইসব তৃতীয় পক্ষের ওয়েবসাইটের প্রাইভেসি পলিসি আমাদের থেকে ভিন্ন হতে পারে। আমরা আপনাকে সেই ওয়েবসাইটগুলো ভিজিট করার সময় তাদের নিজস্ব প্রাইভেসি পলিসি পড়ে নেওয়ার অনুরোধ করছি। তৃতীয় পক্ষের ওয়েবসাইটের কন্টেন্ট বা কার্যক্রমের জন্য আমরা দায়ী নই।
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">ব্যবহারকারীর অধিকার (User Rights)</h2>
              <p>
                আপনার ব্যক্তিগত তথ্যের ওপর আপনার সম্পূর্ণ অধিকার রয়েছে। আপনি চাইলে আপনার প্রদানকৃত তথ্য মুছে ফেলার জন্য আমাদের অনুরোধ করতে পারেন।
              </p>
            </section>

            <section className="bg-secondary/50 p-6 md:p-8 rounded-2xl border border-border mt-12">
              <h2 className="text-2xl font-bold text-primary mb-4">যোগাযোগ (Contact Information)</h2>
              <p className="mb-4">
                এই প্রাইভেসি পলিসি সম্পর্কে আপনার কোনো প্রশ্ন থাকলে বা আপনার তথ্য সম্পর্কে জানতে চাইলে আমাদের সাথে যোগাযোগ করুন:
              </p>
              <p className="font-medium text-xl">ইমেইল: <a href="mailto:contact@aishikhibanglay.com" className="text-primary hover:underline">contact@aishikhibanglay.com</a></p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}