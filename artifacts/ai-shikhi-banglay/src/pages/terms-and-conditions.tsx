import { motion } from "framer-motion";

export default function TermsAndConditions() {
  const lastUpdated = "২০ জানুয়ারি, ২০২৫";

  return (
    <div className="min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-6"><span className="text-primary">শর্তাবলী</span> (Terms & Conditions)</h1>
          <p className="text-muted-foreground mb-12">সর্বশেষ আপডেট: {lastUpdated}</p>

          <div className="space-y-12 text-lg text-foreground/90 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">শর্তাবলী গ্রহণ (Acceptance of Terms)</h2>
              <p>
                "AI শিখি বাংলায়" ওয়েবসাইটটি ব্যবহার করার মাধ্যমে আপনি আমাদের এই শর্তাবলী এবং নিয়মকানুন মেনে চলতে সম্মতি প্রদান করছেন। আপনি যদি এই শর্তাবলীর কোনো অংশের সাথে একমত না হন, তবে অনুগ্রহ করে আমাদের ওয়েবসাইট ব্যবহার করা থেকে বিরত থাকুন।
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">মেধা সম্পত্তি (Intellectual Property)</h2>
              <p>
                এই ওয়েবসাইটের সকল কন্টেন্ট (টেক্সট, গ্রাফিক্স, লোগো, ভিডিও, এবং অন্যান্য উপাদান) "AI শিখি বাংলায়" এর নিজস্ব সম্পত্তি এবং কপিরাইট আইন দ্বারা সংরক্ষিত। আমাদের লিখিত পূর্বানুমতি ছাড়া কোনো কন্টেন্ট কপি, পুনরুৎপাদন, বিতরণ বা বাণিজ্যিক উদ্দেশ্যে ব্যবহার করা সম্পূর্ণ নিষিদ্ধ।
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">ব্যবহারকারীর আচরণ (User Conduct)</h2>
              <p className="mb-4">ওয়েবসাইট ব্যবহার করার সময় আপনাকে অবশ্যই নিম্নলিখিত বিষয়গুলো মেনে চলতে হবে:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>এমন কোনো কার্যকলাপ করা যাবে না যা ওয়েবসাইট বা এর সার্ভারের ক্ষতি করতে পারে।</li>
                <li>স্প্যামিং, হ্যাকিং বা ক্ষতিকর সফটওয়্যার ছড়ানোর চেষ্টা করা যাবে না।</li>
                <li>অবৈধ, মানহানিকর বা অশালীন মন্তব্য করা বা কন্টেন্ট পোস্ট করা থেকে বিরত থাকতে হবে।</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">ওয়ারেন্টি অস্বীকৃতি (Disclaimer of Warranties)</h2>
              <p>
                আমরা ওয়েবসাইটে প্রদত্ত তথ্যের সঠিকতা এবং হালনাগাদ নিশ্চিত করার সর্বোচ্চ চেষ্টা করি। তবে আমরা গ্যারান্টি দিচ্ছি না যে সমস্ত তথ্য সম্পূর্ণ নির্ভুল বা ত্রুটিমুক্ত হবে। এই ওয়েবসাইট এবং এর কন্টেন্টগুলো "যেমন আছে" (As is) ভিত্তিতে প্রদান করা হয়।
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">দায়বদ্ধতার সীমাবদ্ধতা (Limitation of Liability)</h2>
              <p>
                এই ওয়েবসাইট ব্যবহার করার ফলে আপনার কোনো প্রত্যক্ষ, পরোক্ষ বা আনুষঙ্গিক ক্ষতি হলে তার জন্য "AI শিখি বাংলায়" কর্তৃপক্ষ দায়ী থাকবে না। আমাদের শেয়ার করা কোনো টুল বা সফটওয়্যার ব্যবহারের ফলে আপনার ডেটা বা ডিভাইসের কোনো ক্ষতি হলে আমরা তার দায়ভার নেব না।
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">প্রযোজ্য আইন (Governing Law)</h2>
              <p>
                এই শর্তাবলী বাংলাদেশের প্রচলিত আইন অনুযায়ী পরিচালিত এবং ব্যাখ্যা করা হবে। যেকোনো আইনি বিরোধের ক্ষেত্রে বাংলাদেশের বিচারব্যবস্থার এক্তিয়ার প্রযোজ্য হবে।
              </p>
            </section>

            <section className="bg-secondary/50 p-6 md:p-8 rounded-2xl border border-border mt-12">
              <h2 className="text-2xl font-bold text-primary mb-4">যোগাযোগ (Contact)</h2>
              <p className="mb-4">
                আমাদের শর্তাবলী সম্পর্কে আপনার কোনো প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন:
              </p>
              <p className="font-medium text-xl">ইমেইল: <a href="mailto:contact@aishikhibanglay.com" className="text-primary hover:underline">contact@aishikhibanglay.com</a></p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}