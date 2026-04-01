import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Clock, Calendar, Tag, CheckCircle, XCircle, ArrowRight } from "lucide-react";

const relatedPosts = [
  {
    slug: "2",
    category: "AI টুলস রিভিউ",
    categoryColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    title: "Midjourney বনাম DALL-E 3: ছবি তৈরির জন্য কোনটি সেরা?",
    readTime: "৫ মিনিট পড়া",
  },
  {
    slug: "4",
    category: "AI দিয়ে আয়",
    categoryColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    title: "ফ্রিল্যান্সিংয়ে AI এর ব্যবহার: কীভাবে আয় বাড়াবেন?",
    readTime: "৬ মিনিট পড়া",
  },
  {
    slug: "5",
    category: "Prompt গাইড",
    categoryColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    title: "কোডিং শেখার জন্য ৫টি সেরা ChatGPT প্রম্পট",
    readTime: "৩ মিনিট পড়া",
  },
];

const pros = [
  "বিনামূল্যে ব্যবহার করা যায় (GPT-3.5 মডেল)",
  "বাংলায় প্রশ্ন করলে বাংলায় উত্তর দেয়",
  "লেখালেখি, অনুবাদ ও সারসংক্ষেপ তৈরিতে দুর্দান্ত",
  "কোডিং ও গণিতের সমস্যা সমাধানে সক্ষম",
  "২৪ ঘণ্টা, সপ্তাহের ৭ দিন ব্যবহারযোগ্য",
  "কোনো ইনস্টলেশন ছাড়াই ব্রাউজারে চলে",
];

const cons = [
  "বিনামূল্যের সংস্করণে ইন্টারনেট অ্যাক্সেস নেই",
  "মাঝেমধ্যে ভুল বা পুরোনো তথ্য দিতে পারে",
  "GPT-4 ব্যবহার করতে মাসিক সাবস্ক্রিপশন লাগে",
  "জটিল বাংলা ব্যাকরণে কখনো ভুল করে",
  "সংবেদনশীল বিষয়ে উত্তর দিতে অস্বীকার করে",
];

const useCases = [
  {
    icon: "✍️",
    title: "লেখালেখি ও কন্টেন্ট তৈরি",
    description:
      "ব্লগ পোস্ট, সোশ্যাল মিডিয়া ক্যাপশন, ইমেইল বা যেকোনো লেখা দ্রুত তৈরি করতে ChatGPT অসাধারণ কার্যকর। একজন ফ্রিল্যান্স রাইটার হিসেবে আপনি ঘণ্টার কাজ মিনিটে শেষ করতে পারবেন।",
    example: 'প্রম্পট: "আমার ডিজিটাল মার্কেটিং সার্ভিসের জন্য একটি আকর্ষণীয় ফেসবুক পোস্ট লেখো বাংলায়"',
  },
  {
    icon: "📖",
    title: "পড়াশোনা ও শেখার কাজে",
    description:
      "বিশ্ববিদ্যালয়ের পড়া বুঝতে, কঠিন বিষয় সহজভাবে জানতে বা পরীক্ষার প্রস্তুতিতে ChatGPT আপনার ব্যক্তিগত শিক্ষকের মতো কাজ করে।",
    example: 'প্রম্পট: "কোয়ান্টাম ফিজিক্স সহজ বাংলায় বুঝিয়ে দাও, যেন আমি দশম শ্রেণির ছাত্র"',
  },
  {
    icon: "💼",
    title: "ব্যবসায়িক কাজে",
    description:
      "ব্যবসায়িক পরিকল্পনা তৈরি, বাজার বিশ্লেষণ, ক্লায়েন্ট ইমেইল লেখা বা প্রেজেন্টেশন তৈরিতে ChatGPT আপনার পরামর্শদাতার ভূমিকা পালন করে।",
    example: 'প্রম্পট: "আমি একটি অনলাইন কাপড়ের ব্যবসা শুরু করতে চাই। একটি বিস্তারিত বিজনেস প্ল্যান তৈরি করো"',
  },
  {
    icon: "💻",
    title: "কোডিং ও প্রযুক্তিতে",
    description:
      "প্রোগ্রামিং শিখতে বা কোড লিখতে সাহায্য নিন। Python, JavaScript থেকে শুরু করে যেকোনো ভাষায় ChatGPT কোড লিখে দিতে এবং বুঝিয়ে দিতে পারে।",
    example: 'প্রম্পট: "Python দিয়ে একটি সিম্পল ক্যালকুলেটর প্রোগ্রাম লেখো এবং প্রতিটি লাইন বাংলায় বুঝিয়ে দাও"',
  },
  {
    icon: "🌐",
    title: "অনুবাদ ও ভাষা শেখায়",
    description:
      "ইংরেজি থেকে বাংলা বা বাংলা থেকে ইংরেজিতে অনুবাদ করতে ChatGPT গুগল ট্রান্সলেটের চেয়ে অনেক ভালো প্রসঙ্গভিত্তিক অনুবাদ দেয়।",
    example: 'প্রম্পট: "এই ইংরেজি চুক্তিপত্রটি সহজ বাংলায় অনুবাদ করো এবং গুরুত্বপূর্ণ পয়েন্টগুলো আলাদা করে বলো"',
  },
];

const promptTips = [
  {
    tip: "স্পষ্ট ভাষায় নির্দেশ দিন",
    detail:
      "\"কিছু একটা লেখো\" না বলে স্পষ্ট করুন। যেমন: \"আমার ব্লগের জন্য ৫০০ শব্দের একটি SEO-বান্ধব আর্টিকেল লেখো ChatGPT সম্পর্কে\"",
  },
  {
    tip: "প্রসঙ্গ (Context) দিন",
    detail:
      "আপনি কে, কার জন্য লিখছেন সেটা বলুন। যেমন: \"আমি একজন গ্রাফিক ডিজাইনার, আমার ক্লায়েন্টকে ইমেইল করতে হবে প্রজেক্ট ডিলে হওয়া নিয়ে\"",
  },
  {
    tip: "আউটপুটের ফরম্যাট বলুন",
    detail:
      "তালিকা চাইলে বলুন \"বুলেট পয়েন্টে লেখো\", সারণি চাইলে বলুন \"টেবিল আকারে দাও\"। এতে উত্তর অনেক সংগঠিত হয়।",
  },
  {
    tip: "ধাপে ধাপে চিন্তা করতে বলুন",
    detail:
      "জটিল প্রশ্নের জন্য লিখুন \"ধাপে ধাপে ব্যাখ্যা করো\" বা \"Step by step think\"। এতে ChatGPT আরও সঠিক উত্তর দেয়।",
  },
  {
    tip: "উত্তর পছন্দ না হলে পরিমার্জন করুন",
    detail:
      "\"আরও সহজ করো\", \"আরও দীর্ঘ করো\" বা \"একটু প্রফেশনাল টোনে লেখো\" বলে রিফাইন করতে পারেন। এটাই ChatGPT এর বড় সুবিধা।",
  },
];

export default function BlogChatGPTGuide() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen py-12 md:py-20"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">

          {/* Back Button */}
          <Link href="/blog">
            <button
              data-testid="button-back-to-blog"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-10 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              ব্লগে ফিরে যান
            </button>
          </Link>

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Category Badge */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-sm font-medium">
                <Tag className="w-3.5 h-3.5" />
                AI টিউটোরিয়াল
              </span>
            </div>

            {/* Title */}
            <h1
              data-testid="text-post-title"
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6"
            >
              ChatGPT বাংলায় কীভাবে ব্যবহার করবেন —{" "}
              <span className="text-primary">সম্পূর্ণ গাইড ২০২৫</span>
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>১৫ জানুয়ারি, ২০২৫</span>
              </div>
              <div className="flex items-center gap-1.5 text-primary font-medium">
                <Clock className="w-4 h-4" />
                <span data-testid="text-read-time">আনুমানিক পড়ার সময়: ১০ মিনিট</span>
              </div>
            </div>
          </motion.header>

          {/* Article Body */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="prose prose-invert prose-lg max-w-none"
          >
            {/* Introduction */}
            <section className="mb-12">
              <p className="text-lg text-muted-foreground leading-relaxed">
                আপনি কি জানেন বিশ্বজুড়ে প্রতিদিন কোটি কোটি মানুষ ChatGPT ব্যবহার করছে? কিন্তু বাংলাদেশে এবং বাংলা ভাষাভাষী মানুষদের মধ্যে এখনো অনেকেই জানেন না কীভাবে এই শক্তিশালী AI টুলটি সঠিকভাবে ব্যবহার করতে হয়। এই গাইডে আমরা একদম শুরু থেকে শেষ পর্যন্ত ChatGPT ব্যবহারের সমস্ত কিছু বাংলায় আলোচনা করব — অ্যাকাউন্ট খোলা থেকে শুরু করে কার্যকর প্রম্পট লেখা পর্যন্ত।
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                ChatGPT হলো OpenAI-এর তৈরি একটি কৃত্রিম বুদ্ধিমত্তা চ্যাটবট যা আপনার যেকোনো প্রশ্নের উত্তর দিতে, লেখা তৈরি করতে, কোড লিখতে, অনুবাদ করতে এবং আরও অনেক কাজ করতে সক্ষম। এবং সবচেয়ে ভালো খবর হলো — এটি বাংলায়ও চমৎকারভাবে কাজ করে।
              </p>
            </section>

            {/* Step by Step Account Creation */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                বিনামূল্যে ChatGPT অ্যাকাউন্ট তৈরি করুন (ধাপে ধাপে)
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                ChatGPT ব্যবহার শুরু করতে প্রথমে একটি বিনামূল্যের অ্যাকাউন্ট তৈরি করতে হবে। নিচের ধাপগুলো অনুসরণ করুন:
              </p>

              <div className="space-y-4">
                {[
                  {
                    step: "১",
                    title: "ChatGPT-এর ওয়েবসাইটে যান",
                    detail:
                      "আপনার ব্রাউজারে chat.openai.com লিখুন অথবা Google-এ ChatGPT লিখে সার্চ করুন এবং অফিশিয়াল সাইটে প্রবেশ করুন।",
                  },
                  {
                    step: "২",
                    title: "Sign Up বাটনে ক্লিক করুন",
                    detail:
                      "হোম পেজে \"Sign up\" বাটনে ক্লিক করুন। আপনার কাছে তিনটি অপশন থাকবে: ইমেইল দিয়ে, Google অ্যাকাউন্ট দিয়ে, বা Microsoft অ্যাকাউন্ট দিয়ে।",
                  },
                  {
                    step: "৩",
                    title: "ইমেইল ও পাসওয়ার্ড দিন",
                    detail:
                      "আপনার একটি সক্রিয় ইমেইল ঠিকানা এবং শক্তিশালী পাসওয়ার্ড দিন। তারপর Continue বাটনে ক্লিক করুন।",
                  },
                  {
                    step: "৪",
                    title: "ইমেইল ভেরিফিকেশন করুন",
                    detail:
                      "OpenAI আপনার ইমেইলে একটি ভেরিফিকেশন লিঙ্ক পাঠাবে। আপনার ইনবক্স চেক করুন এবং \"Verify email address\" বাটনে ক্লিক করুন।",
                  },
                  {
                    step: "৫",
                    title: "প্রোফাইল তথ্য পূরণ করুন",
                    detail:
                      "আপনার নাম এবং জন্মতারিখ দিন। মনে রাখবেন, ChatGPT ব্যবহারের জন্য বয়স কমপক্ষে ১৩ বছর হতে হবে।",
                  },
                  {
                    step: "৬",
                    title: "শুরু করুন",
                    detail:
                      "সব ঠিকঠাক হলে আপনি সরাসরি ChatGPT-এর চ্যাট ইন্টারফেসে প্রবেশ করবেন। নিচের টেক্সট বক্সে বাংলায় টাইপ করুন এবং Enter চাপুন।",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="flex gap-4 p-5 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Use Cases */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">
                বাংলাদেশি ব্যবহারকারীদের জন্য ৫টি কার্যকরী ব্যবহার
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                আপনি কি ভাবছেন ChatGPT দিয়ে আসলে কী কী করা যায়? এখানে বাংলাদেশের প্রেক্ষাপটে সবচেয়ে কাজের ৫টি ব্যবহার তুলে ধরা হলো:
              </p>

              <div className="space-y-6">
                {useCases.map((uc, idx) => (
                  <div
                    key={idx}
                    className="p-6 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors"
                  >
                    <h3 className="text-xl font-bold mb-3 text-foreground">
                      {uc.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">{uc.description}</p>
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <p className="text-sm text-primary/80 font-mono">{uc.example}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Prompt Tips */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">
                বাংলায় কার্যকর প্রম্পট লেখার টিপস
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                ChatGPT থেকে ভালো ফলাফল পাওয়া অনেকটাই নির্ভর করে আপনি কীভাবে প্রশ্ন বা নির্দেশনা দিচ্ছেন তার উপর। নিচের টিপসগুলো অনুসরণ করলে আপনি অনেক ভালো উত্তর পাবেন:
              </p>

              <div className="space-y-4">
                {promptTips.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-5 bg-card border border-border rounded-xl"
                  >
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-primary font-bold text-xs mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{item.tip}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Pros & Cons */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                সুবিধা ও অসুবিধা
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                  <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    সুবিধাসমূহ
                  </h3>
                  <ul className="space-y-3">
                    {pros.map((pro, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-xl">
                  <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    অসুবিধাসমূহ
                  </h3>
                  <ul className="space-y-3">
                    {cons.map((con, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Conclusion */}
            <section className="mb-12 p-6 md:p-8 bg-gradient-to-br from-primary/10 to-cyan-500/5 border border-primary/20 rounded-2xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                উপসংহার
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                ChatGPT আজকের ডিজিটাল যুগে একটি অপরিহার্য টুল হয়ে উঠেছে। শিক্ষার্থী, ফ্রিল্যান্সার, উদ্যোক্তা বা পেশাদার — সবার জন্যই এটি সময় ও শ্রম বাঁচানোর একটি দুর্দান্ত উপায়। বাংলায় ব্যবহার করা যায় বলে বাংলাভাষী ব্যবহারকারীদের জন্য এটি আরও সহজলভ্য।
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                মনে রাখবেন, ChatGPT একটি সহায়ক টুল — প্রতিস্থাপক নয়। এটি আপনার কাজকে আরও স্মার্ট ও দ্রুত করে তুলবে, কিন্তু আপনার নিজের বিচারবুদ্ধি ও সৃজনশীলতার কোনো বিকল্প নেই।
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://chat.openai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="link-start-chatgpt"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  ChatGPT ব্যবহার শুরু করুন
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link href="/tools">
                  <button
                    data-testid="link-explore-tools"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-lg font-medium hover:bg-secondary transition-colors"
                  >
                    আরও AI টুলস দেখুন
                  </button>
                </Link>
              </div>
            </section>
          </motion.article>

          {/* Related Posts */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 pt-10 border-t border-border"
          >
            <h2 className="text-2xl font-bold mb-6 text-foreground">সম্পর্কিত পোস্টসমূহ</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <div
                    data-testid={`card-related-post-${post.slug}`}
                    className="p-4 bg-card border border-border rounded-xl hover:border-primary/40 transition-colors group cursor-pointer h-full flex flex-col"
                  >
                    <span
                      className={`self-start px-2.5 py-0.5 rounded-full border text-xs font-medium mb-3 ${post.categoryColor}`}
                    >
                      {post.category}
                    </span>
                    <h3 className="font-semibold text-foreground text-sm leading-snug mb-3 group-hover:text-primary transition-colors flex-1">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-auto">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>

        </div>
      </div>
    </motion.div>
  );
}
