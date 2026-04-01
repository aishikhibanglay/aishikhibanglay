import { motion } from "framer-motion";

export default function Disclaimer() {
  const lastUpdated = "২০ জানুয়ারি, ২০২৫";

  return (
    <div className="min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-6">দাবিত্যাগ <span className="text-primary">(Disclaimer)</span></h1>
          <p className="text-muted-foreground mb-12">সর্বশেষ আপডেট: {lastUpdated}</p>

          <div className="space-y-12 text-lg text-foreground/90 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">সাধারণ দাবিত্যাগ (General Disclaimer)</h2>
              <p>
                "AI শিখি বাংলায়" ওয়েবসাইটে প্রদান করা সমস্ত তথ্য শুধুমাত্র সাধারণ শিক্ষামূলক এবং তথ্যমূলক উদ্দেশ্যে প্রকাশ করা হয়। আমরা তথ্যের সঠিকতা, প্রাসঙ্গিকতা এবং নির্ভরযোগ্যতা নিশ্চিত করার চেষ্টা করি, তবে আমরা কোনো প্রকার ওয়ারেন্টি বা গ্যারান্টি প্রদান করি না। এই ওয়েবসাইটের কোনো তথ্য ব্যবহার করে নেওয়া যেকোনো পদক্ষেপের জন্য আপনি নিজেই সম্পূর্ণ দায়ী থাকবেন।
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">অ্যাফিলিয়েট লিঙ্ক বিজ্ঞপ্তি (Affiliate Disclaimer)</h2>
              <p>
                আমাদের ওয়েবসাইটে শেয়ার করা কিছু লিঙ্ক অ্যাফিলিয়েট লিঙ্ক হতে পারে। এর মানে হলো, আপনি যদি সেই লিঙ্কে ক্লিক করে কোনো পণ্য বা পরিষেবা কেনেন, তবে কোনো অতিরিক্ত খরচ ছাড়াই আমরা একটি ছোট কমিশন পেতে পারি। এই কমিশন আমাদের ওয়েবসাইট পরিচালনা এবং নতুন কন্টেন্ট তৈরিতে সাহায্য করে। আমরা শুধুমাত্র সেইসব টুল এবং সার্ভিসগুলোই রিকমেন্ড করি যেগুলো সম্পর্কে আমরা নিজে আত্মবিশ্বাসী।
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">পেশাদার পরামর্শ নয় (No Professional Advice)</h2>
              <p>
                এই ওয়েবসাইটের কোনো কন্টেন্ট, টিউটোরিয়াল বা গাইডলাইন কোনো পেশাদার আইনি, আর্থিক বা প্রযুক্তিগত পরামর্শ হিসেবে গণ্য করা যাবে না। বিশেষ কোনো গুরুত্বপূর্ণ সিদ্ধান্ত নেওয়ার পূর্বে অবশ্যই একজন পেশাদারের পরামর্শ গ্রহণ করুন।
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">ত্রুটি ও বাদ পড়া (Errors and Omissions)</h2>
              <p>
                কৃত্রিম বুদ্ধিমত্তা (AI) একটি অত্যন্ত দ্রুত পরিবর্তনশীল প্রযুক্তি। আমরা আমাদের তথ্যগুলো হালনাগাদ রাখার সর্বোচ্চ চেষ্টা করি, কিন্তু তবুও কিছু তথ্য পুরনো বা অকার্যকর হয়ে যেতে পারে। তথ্যে কোনো অনিচ্ছাকৃত ভুল বা বাদ পড়ার জন্য "AI শিখি বাংলায়" কর্তৃপক্ষ দায়ী থাকবে না।
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">বাহ্যিক লিঙ্ক (External Links Disclaimer)</h2>
              <p>
                আমাদের ওয়েবসাইটে অন্যান্য বাহ্যিক ওয়েবসাইটের লিঙ্ক থাকতে পারে। সেইসব ওয়েবসাইটের কন্টেন্ট, তথ্যের সঠিকতা বা তাদের প্রাইভেসি পলিসির ওপর আমাদের কোনো নিয়ন্ত্রণ নেই। বাহ্যিক ওয়েবসাইটগুলো ভিজিট এবং ব্যবহারের সম্পূর্ণ ঝুঁকি ব্যবহারকারীর নিজস্ব।
              </p>
            </section>

            <section className="bg-secondary/50 p-6 md:p-8 rounded-2xl border border-border mt-12">
              <h2 className="text-2xl font-bold text-primary mb-4">সম্মতি</h2>
              <p className="mb-4">
                আমাদের ওয়েবসাইট ব্যবহার করার মাধ্যমে আপনি এতদ্বারা আমাদের দাবিত্যাগ (Disclaimer) এর সাথে সম্মতি জ্ঞাপন করছেন এবং এর শর্তাবলী মেনে নিচ্ছেন।
              </p>
              <p className="text-sm mt-6">
                যোগাযোগ: <a href="mailto:contact@aishikhibanglay.com" className="text-primary hover:underline">contact@aishikhibanglay.com</a>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}