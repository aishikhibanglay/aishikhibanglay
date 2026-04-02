CREATE TABLE public.ai_tools (
    id integer NOT NULL,
    name text NOT NULL,
    company text DEFAULT ''::text NOT NULL,
    badge text DEFAULT 'Free'::text NOT NULL,
    rating real DEFAULT 4 NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    website_url text DEFAULT ''::text NOT NULL,
    gradient_class text DEFAULT 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400'::text NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);
CREATE SEQUENCE public.ai_tools_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.ai_tools_id_seq OWNED BY public.ai_tools.id;
CREATE TABLE public.nav_items (
    id integer NOT NULL,
    label text NOT NULL,
    href text NOT NULL,
    section text NOT NULL,
    "position" integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    open_in_new_tab boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.nav_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.nav_items_id_seq OWNED BY public.nav_items.id;
CREATE TABLE public.page_views (
    id integer NOT NULL,
    path text DEFAULT '/'::text NOT NULL,
    visited_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.page_views_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.page_views_id_seq OWNED BY public.page_views.id;
CREATE TABLE public.pages (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    content text DEFAULT ''::text NOT NULL,
    meta_description text DEFAULT ''::text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.pages_id_seq OWNED BY public.pages.id;
CREATE TABLE public.password_reset_tokens (
    id integer NOT NULL,
    token text NOT NULL,
    used_at timestamp with time zone,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.password_reset_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.password_reset_tokens_id_seq OWNED BY public.password_reset_tokens.id;
CREATE TABLE public.posts (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text NOT NULL,
    content text NOT NULL,
    category text NOT NULL,
    cover_image text,
    status text DEFAULT 'draft'::text NOT NULL,
    read_time integer DEFAULT 5 NOT NULL,
    published_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;
CREATE TABLE public.site_settings (
    id integer NOT NULL,
    key text NOT NULL,
    value text DEFAULT ''::text NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.site_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.site_settings_id_seq OWNED BY public.site_settings.id;
CREATE TABLE public.social_links (
    id integer NOT NULL,
    label text NOT NULL,
    url text NOT NULL,
    icon text DEFAULT 'link'::text NOT NULL,
    display_order integer DEFAULT 0 NOT NULL
);
CREATE SEQUENCE public.social_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.social_links_id_seq OWNED BY public.social_links.id;
CREATE TABLE public.subscribers (
    id integer NOT NULL,
    email text NOT NULL,
    subscribed_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.subscribers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.subscribers_id_seq OWNED BY public.subscribers.id;
ALTER TABLE ONLY public.ai_tools ALTER COLUMN id SET DEFAULT nextval('public.ai_tools_id_seq'::regclass);
ALTER TABLE ONLY public.nav_items ALTER COLUMN id SET DEFAULT nextval('public.nav_items_id_seq'::regclass);
ALTER TABLE ONLY public.page_views ALTER COLUMN id SET DEFAULT nextval('public.page_views_id_seq'::regclass);
ALTER TABLE ONLY public.pages ALTER COLUMN id SET DEFAULT nextval('public.pages_id_seq'::regclass);
ALTER TABLE ONLY public.password_reset_tokens ALTER COLUMN id SET DEFAULT nextval('public.password_reset_tokens_id_seq'::regclass);
ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);
ALTER TABLE ONLY public.site_settings ALTER COLUMN id SET DEFAULT nextval('public.site_settings_id_seq'::regclass);
ALTER TABLE ONLY public.social_links ALTER COLUMN id SET DEFAULT nextval('public.social_links_id_seq'::regclass);
ALTER TABLE ONLY public.subscribers ALTER COLUMN id SET DEFAULT nextval('public.subscribers_id_seq'::regclass);
INSERT INTO public.ai_tools VALUES (1, 'ChatGPT', 'OpenAI', 'Free / Paid', 5, 'সবচেয়ে জনপ্রিয় এআই চ্যাটবট। টেক্সট লেখা, কোডিং করা, অনুবাদ করা থেকে শুরু করে যেকোনো প্রশ্নের উত্তর দিতে সক্ষম।', 'https://chat.openai.com', 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400', 1, true);
INSERT INTO public.ai_tools VALUES (2, 'Google Gemini', 'Google', 'Free', 4.5, 'গুগলের শক্তিশালী এআই মডেল। রিয়েল-টাইম তথ্যের জন্য সেরা। এর সাথে গুগল ডক্স এবং জিমেইল ইন্টিগ্রেশন রয়েছে।', 'https://gemini.google.com', 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-400', 2, true);
INSERT INTO public.ai_tools VALUES (3, 'Claude', 'Anthropic', 'Free / Paid', 4.5, 'নিরাপদ এবং অত্যন্ত বুদ্ধিমান এআই অ্যাসিস্ট্যান্ট। বড় ডকুমেন্ট পড়া এবং সামারাইজ করার জন্য চ্যাটজিপিটির চেয়েও ভালো।', 'https://claude.ai', 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400', 3, true);
INSERT INTO public.ai_tools VALUES (4, 'Midjourney', 'Midjourney Inc.', 'Paid', 5, 'টেক্সট থেকে হাই-কোয়ালিটি ছবি তৈরি করার সেরা টুল। প্রফেশনাল গ্রাফিক্স এবং আর্টওয়ার্ক তৈরির জন্য অতুলনীয়।', 'https://www.midjourney.com', 'bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 text-purple-400', 4, true);
INSERT INTO public.ai_tools VALUES (5, 'Perplexity AI', 'Perplexity', 'Free / Paid', 4, 'এআই চালিত সার্চ ইঞ্জিন। যেকোনো প্রশ্নের সুনির্দিষ্ট উত্তর দেয় এবং সাথে সোর্স লিঙ্ক যুক্ত করে দেয়। রিসার্চের জন্য সেরা।', 'https://www.perplexity.ai', 'bg-gradient-to-br from-cyan-500/20 to-sky-500/20 text-cyan-400', 5, true);
INSERT INTO public.ai_tools VALUES (6, 'ElevenLabs', 'ElevenLabs', 'Free / Paid', 4, 'টেক্সট থেকে মানুষের মতো বাস্তব ভয়েস তৈরি করার টুল। ভিডিওর জন্য প্রফেশনাল ভয়েসওভার বানাতে দারুণ কার্যকরী।', 'https://elevenlabs.io', 'bg-gradient-to-br from-rose-500/20 to-pink-500/20 text-rose-400', 6, true);
INSERT INTO public.nav_items VALUES (4, 'আমাদের সম্পর্কে', '/about', 'navbar', 4, true, false, '2026-04-01 23:15:49.376039+00');
INSERT INTO public.nav_items VALUES (5, 'যোগাযোগ', '/contact', 'navbar', 5, true, false, '2026-04-01 23:15:49.376039+00');
INSERT INTO public.nav_items VALUES (6, 'ব্লগ', '/blog', 'footer_main', 1, true, false, '2026-04-01 23:15:49.376039+00');
INSERT INTO public.nav_items VALUES (7, 'AI টুলস', '/tools', 'footer_main', 2, true, false, '2026-04-01 23:15:49.376039+00');
INSERT INTO public.nav_items VALUES (8, 'আমাদের সম্পর্কে', '/about', 'footer_main', 3, true, false, '2026-04-01 23:15:49.376039+00');
INSERT INTO public.nav_items VALUES (10, 'প্রাইভেসি পলিসি', '/privacy-policy', 'footer_legal', 1, true, false, '2026-04-01 23:15:49.376039+00');
INSERT INTO public.nav_items VALUES (11, 'শর্তাবলী', '/terms-and-conditions', 'footer_legal', 2, true, false, '2026-04-01 23:15:49.376039+00');
INSERT INTO public.nav_items VALUES (12, 'দাবিত্যাগ', '/disclaimer', 'footer_legal', 3, true, false, '2026-04-01 23:15:49.376039+00');
INSERT INTO public.nav_items VALUES (13, 'কুকি পলিসি', '/cookie-policy', 'footer_legal', 4, true, false, '2026-04-01 23:15:49.376039+00');
INSERT INTO public.nav_items VALUES (1, 'হোম', '/', 'navbar', 1, true, false, '2026-04-01 23:15:49.376039+00');
INSERT INTO public.nav_items VALUES (3, 'AI টুলস', '/tools', 'navbar', 2, true, false, '2026-04-01 23:15:49.376039+00');
INSERT INTO public.nav_items VALUES (2, 'ব্লগ', '/blog', 'navbar', 3, true, false, '2026-04-01 23:15:49.376039+00');
INSERT INTO public.nav_items VALUES (9, 'যোগাযোগ', '/contact', 'footer_main', 4, true, false, '2026-04-01 23:15:49.376039+00');
INSERT INTO public.page_views VALUES (1, '/', '2026-04-02 00:18:57.117939+00');
INSERT INTO public.page_views VALUES (2, '/', '2026-04-02 00:26:33.436902+00');
INSERT INTO public.page_views VALUES (3, '/', '2026-04-02 00:26:35.299738+00');
INSERT INTO public.page_views VALUES (4, '/', '2026-04-02 00:27:19.390932+00');
INSERT INTO public.page_views VALUES (5, '/', '2026-04-02 00:27:24.974691+00');
INSERT INTO public.page_views VALUES (6, '/', '2026-04-02 00:27:31.250075+00');
INSERT INTO public.page_views VALUES (7, '/', '2026-04-02 00:35:58.655266+00');
INSERT INTO public.page_views VALUES (8, '/', '2026-04-02 00:36:01.622711+00');
INSERT INTO public.page_views VALUES (9, '/', '2026-04-02 00:38:11.936941+00');
INSERT INTO public.page_views VALUES (10, '/', '2026-04-02 00:38:12.644393+00');
INSERT INTO public.page_views VALUES (11, '/', '2026-04-02 08:22:10.350371+00');
INSERT INTO public.page_views VALUES (12, '/', '2026-04-02 08:23:49.903459+00');
INSERT INTO public.page_views VALUES (13, '/', '2026-04-02 08:24:10.524766+00');
INSERT INTO public.page_views VALUES (14, '/', '2026-04-02 08:31:43.400924+00');
INSERT INTO public.page_views VALUES (15, '/', '2026-04-02 08:40:08.814272+00');
INSERT INTO public.page_views VALUES (16, '/', '2026-04-02 08:48:37.149519+00');
INSERT INTO public.page_views VALUES (17, '/', '2026-04-02 08:50:24.55437+00');
INSERT INTO public.page_views VALUES (18, '/', '2026-04-02 08:50:31.047339+00');
INSERT INTO public.page_views VALUES (19, '/blog', '2026-04-02 08:52:28.653142+00');
INSERT INTO public.page_views VALUES (20, '/blog/hossain', '2026-04-02 08:52:34.413731+00');
INSERT INTO public.page_views VALUES (21, '/blog', '2026-04-02 08:52:38.399549+00');
INSERT INTO public.page_views VALUES (22, '/pages/sas', '2026-04-02 08:53:38.188084+00');
INSERT INTO public.page_views VALUES (23, '/blog', '2026-04-02 08:54:10.758686+00');
INSERT INTO public.page_views VALUES (24, '/pages/sas', '2026-04-02 08:54:13.818395+00');
INSERT INTO public.page_views VALUES (25, '/cookie-policy', '2026-04-02 08:54:16.514801+00');
INSERT INTO public.page_views VALUES (26, '/cookie-policy', '2026-04-02 08:58:23.781838+00');
INSERT INTO public.page_views VALUES (27, '/cookie-policy', '2026-04-02 08:58:53.17757+00');
INSERT INTO public.page_views VALUES (28, '/', '2026-04-02 08:59:09.286481+00');
INSERT INTO public.page_views VALUES (29, '/', '2026-04-02 09:00:29.773936+00');
INSERT INTO public.page_views VALUES (30, '/tools', '2026-04-02 09:01:21.249716+00');
INSERT INTO public.page_views VALUES (31, '/tools', '2026-04-02 09:08:47.577554+00');
INSERT INTO public.page_views VALUES (32, '/', '2026-04-02 09:28:47.896238+00');
INSERT INTO public.page_views VALUES (33, '/tools', '2026-04-02 09:28:48.628066+00');
INSERT INTO public.page_views VALUES (34, '/', '2026-04-02 09:39:35.612451+00');
INSERT INTO public.page_views VALUES (35, '/tools', '2026-04-02 09:39:38.415463+00');
INSERT INTO public.page_views VALUES (36, '/', '2026-04-02 09:39:39.218823+00');
INSERT INTO public.page_views VALUES (37, '/about', '2026-04-02 09:41:20.249844+00');
INSERT INTO public.page_views VALUES (38, '/disclaimer', '2026-04-02 09:41:25.401118+00');
INSERT INTO public.page_views VALUES (39, '/', '2026-04-02 09:48:53.085622+00');
INSERT INTO public.page_views VALUES (40, '/disclaimer', '2026-04-02 09:48:56.218092+00');
INSERT INTO public.page_views VALUES (41, '/disclaimer', '2026-04-02 09:48:57.315989+00');
INSERT INTO public.page_views VALUES (42, '/tools', '2026-04-02 09:52:18.650565+00');
INSERT INTO public.page_views VALUES (43, '/blog', '2026-04-02 09:52:21.111399+00');
INSERT INTO public.page_views VALUES (44, '/blog', '2026-04-02 09:53:36.754928+00');
INSERT INTO public.page_views VALUES (45, '/disclaimer', '2026-04-02 09:58:37.533718+00');
INSERT INTO public.page_views VALUES (46, '/', '2026-04-02 09:58:49.659522+00');
INSERT INTO public.page_views VALUES (47, '/disclaimer', '2026-04-02 10:04:05.154704+00');
INSERT INTO public.page_views VALUES (48, '/privacy-policy', '2026-04-02 10:04:07.835915+00');
INSERT INTO public.page_views VALUES (49, '/cookie-policy', '2026-04-02 10:04:10.927145+00');
INSERT INTO public.page_views VALUES (50, '/', '2026-04-02 10:08:09.528858+00');
INSERT INTO public.page_views VALUES (51, '/cookie-policy', '2026-04-02 10:08:11.921631+00');
INSERT INTO public.page_views VALUES (52, '/', '2026-04-02 10:19:20.243407+00');
INSERT INTO public.page_views VALUES (53, '/', '2026-04-02 10:19:48.865986+00');
INSERT INTO public.page_views VALUES (55, '/', '2026-04-02 10:21:20.63717+00');
INSERT INTO public.page_views VALUES (54, '/', '2026-04-02 10:21:20.637254+00');
INSERT INTO public.page_views VALUES (56, '/', '2026-04-02 10:22:31.936549+00');
INSERT INTO public.page_views VALUES (57, '/', '2026-04-02 10:22:32.244206+00');
INSERT INTO public.page_views VALUES (58, '/', '2026-04-02 10:22:37.755369+00');
INSERT INTO public.page_views VALUES (59, '/', '2026-04-02 10:24:37.468273+00');
INSERT INTO public.page_views VALUES (60, '/', '2026-04-02 10:30:27.927354+00');
INSERT INTO public.page_views VALUES (61, '/', '2026-04-02 10:37:23.791895+00');
INSERT INTO public.page_views VALUES (62, '/', '2026-04-02 10:40:14.990231+00');
INSERT INTO public.page_views VALUES (63, '/', '2026-04-02 10:40:16.52651+00');
INSERT INTO public.page_views VALUES (64, '/', '2026-04-02 10:40:17.254824+00');
INSERT INTO public.page_views VALUES (65, '/', '2026-04-02 10:40:25.710042+00');
INSERT INTO public.page_views VALUES (66, '/tools', '2026-04-02 10:41:49.316223+00');
INSERT INTO public.page_views VALUES (67, '/', '2026-04-02 10:41:52.207664+00');
INSERT INTO public.page_views VALUES (68, '/blog', '2026-04-02 10:41:56.368595+00');
INSERT INTO public.page_views VALUES (69, '/', '2026-04-02 10:42:00.488805+00');
INSERT INTO public.page_views VALUES (70, '/blog', '2026-04-02 10:42:04.711376+00');
INSERT INTO public.page_views VALUES (71, '/', '2026-04-02 10:42:11.023941+00');
INSERT INTO public.page_views VALUES (72, '/blog', '2026-04-02 10:42:18.285526+00');
INSERT INTO public.page_views VALUES (73, '/', '2026-04-02 10:42:32.031792+00');
INSERT INTO public.page_views VALUES (74, '/blog', '2026-04-02 10:46:37.012268+00');
INSERT INTO public.page_views VALUES (75, '/blog', '2026-04-02 10:46:52.197276+00');
INSERT INTO public.page_views VALUES (76, '/', '2026-04-02 10:47:19.145123+00');
INSERT INTO public.page_views VALUES (77, '/', '2026-04-02 10:58:07.739629+00');
INSERT INTO public.page_views VALUES (78, '/', '2026-04-02 10:58:07.75365+00');
INSERT INTO public.page_views VALUES (79, '/', '2026-04-02 10:58:11.076008+00');
INSERT INTO public.page_views VALUES (80, '/', '2026-04-02 10:58:18.227387+00');
INSERT INTO public.page_views VALUES (81, '/blog', '2026-04-02 10:58:27.769367+00');
INSERT INTO public.page_views VALUES (82, '/', '2026-04-02 10:58:47.645603+00');
INSERT INTO public.page_views VALUES (83, '/', '2026-04-02 10:59:22.899401+00');
INSERT INTO public.page_views VALUES (84, '/blog', '2026-04-02 11:00:26.971989+00');
INSERT INTO public.page_views VALUES (85, '/', '2026-04-02 11:00:29.501948+00');
INSERT INTO public.page_views VALUES (86, '/blog', '2026-04-02 11:00:31.60094+00');
INSERT INTO public.page_views VALUES (87, '/', '2026-04-02 11:00:34.275881+00');
INSERT INTO public.page_views VALUES (88, '/', '2026-04-02 11:00:59.246717+00');
INSERT INTO public.page_views VALUES (89, '/', '2026-04-02 11:01:15.940764+00');
INSERT INTO public.page_views VALUES (90, '/', '2026-04-02 11:01:24.650875+00');
INSERT INTO public.page_views VALUES (91, '/', '2026-04-02 11:05:02.269249+00');
INSERT INTO public.page_views VALUES (92, '/', '2026-04-02 11:05:05.391152+00');
INSERT INTO public.page_views VALUES (93, '/', '2026-04-02 11:05:12.252561+00');
INSERT INTO public.page_views VALUES (94, '/', '2026-04-02 11:05:47.109695+00');
INSERT INTO public.page_views VALUES (95, '/', '2026-04-02 11:06:01.24034+00');
INSERT INTO public.page_views VALUES (96, '/blog', '2026-04-02 11:07:41.333189+00');
INSERT INTO public.page_views VALUES (97, '/', '2026-04-02 11:10:42.542961+00');
INSERT INTO public.page_views VALUES (98, '/', '2026-04-02 11:14:30.695552+00');
INSERT INTO public.page_views VALUES (99, '/', '2026-04-02 11:20:38.632959+00');
INSERT INTO public.page_views VALUES (100, '/', '2026-04-02 11:22:46.816369+00');
INSERT INTO public.page_views VALUES (101, '/', '2026-04-02 12:12:44.032726+00');
INSERT INTO public.page_views VALUES (102, '/', '2026-04-02 12:12:48.037415+00');
INSERT INTO public.password_reset_tokens VALUES (1, '3267b5198c9f03c31f7e57726f3476fc74e882a4e7763ec7e8d9d50a3a50df1c', NULL, '2026-04-02 00:42:39.532+00', '2026-04-02 00:27:39.533166+00');
INSERT INTO public.password_reset_tokens VALUES (2, '531b83baf2346cccefac3b0da92959b93b10e9628f2b0485e10f08c4a6e020fc', NULL, '2026-04-02 00:53:06.767+00', '2026-04-02 00:38:06.786008+00');
INSERT INTO public.password_reset_tokens VALUES (3, '40118859c0be28badc973b1247f9b847f75aa791b38096ae61f34acb21961a1e', NULL, '2026-04-02 08:38:58.979+00', '2026-04-02 08:23:58.996076+00');
INSERT INTO public.password_reset_tokens VALUES (4, '9c3d7ad474651666aca21b4bc6f6b296bf06ef56c111e57489e8bebac2ee260f', '2026-04-02 08:28:32.559+00', '2026-04-02 08:41:29.296+00', '2026-04-02 08:26:29.313986+00');
INSERT INTO public.password_reset_tokens VALUES (5, 'dd407ee82947268d9478043583a76f4f477e3246279d5fff9bdc8769e0d01394', '2026-04-02 08:29:12.742+00', '2026-04-02 08:43:43.271+00', '2026-04-02 08:28:43.282738+00');
INSERT INTO public.posts VALUES (1, 'বাংলায় AI শেখার সেরা উপায় - পরীক্ষামূলক পোস্ট', 'banglay-ai-shekhar-sero-upay', 'এই পোস্টে আমরা বাংলায় আর্টিফিশিয়াল ইন্টেলিজেন্স শেখার কিছু সেরা উপায় নিয়ে আলোচনা করব।', '<p>কৃত্রিম বুদ্ধিমত্তা বা আর্টিফিশিয়াল ইন্টেলিজেন্স বর্তমান যুগে একটি গুরুত্বপূর্ণ বিষয়।</p>', 'টিউটোরিয়াল', NULL, 'published', 1, '2026-04-01 21:27:24.672+00', '2026-04-01 21:27:24.683046+00', '2026-04-01 21:27:24.683046+00');
INSERT INTO public.posts VALUES (3, 'বাংলায় ChatGPT ব্যবহার করার সম্পূর্ণ গাইড', 'banglay-chatgpt-byabohar-sampurno-guide', 'এই পোস্টে ChatGPT বাংলায় ব্যবহারের সব কৌশল শিখব', '<p>ChatGPT একটি শক্তিশালী AI টুল যা বাংলায় সহজেই ব্যবহার করা যায়।</p>', 'টিউটোরিয়াল', NULL, 'published', 1, '2026-04-01 21:29:50.449+00', '2026-04-01 21:29:50.463723+00', '2026-04-01 21:29:50.463723+00');
INSERT INTO public.site_settings VALUES (2, 'youtube_subscribe_url', 'https://www.youtube.com/@aishikhibanglay?sub_confirmation=1', '2026-04-02 11:10:33.571+00');
INSERT INTO public.site_settings VALUES (5, 'featured_youtube_video_id', 'https://youtu.be/jnqtnglQFBk?si=o0vKkoVogSc9qgJB', '2026-04-02 11:10:33.576+00');
INSERT INTO public.site_settings VALUES (24, 'featured_youtube_videos', 'https://youtu.be/jnqtnglQFBk?si=o0vKkoVogSc9qgJB, https://youtu.be/a_2Zsv89-L8?si=s99cBvzLu8H63nYm, https://youtu.be/NJrvV2Y4uBA?si=o99nr9J60BE0v-N0', '2026-04-02 11:10:33.578+00');
INSERT INTO public.site_settings VALUES (3, 'facebook_url', 'https://www.facebook.com/aishikhibanglay', '2026-04-01 23:00:22.08+00');
INSERT INTO public.site_settings VALUES (4, 'twitter_url', '', '2026-04-01 23:00:22.083+00');
INSERT INTO public.site_settings VALUES (8, 'hero_badge', 'আপনার মাতৃভাষায় ভবিষ্যতের প্রযুক্তি', '2026-04-02 11:10:33.581+00');
INSERT INTO public.site_settings VALUES (9, 'hero_title', 'বাংলায় শিখুন AI', '2026-04-02 11:10:33.584+00');
INSERT INTO public.site_settings VALUES (10, 'hero_subtitle', 'কৃত্রিম বুদ্ধিমতার এই নতুন যুগে পিছিয়ে থাকবেন না। খুব সহজেই নিজের ভাষায় শিখুন AI-এর খুঁটিনাটি এবং কাজে লাগান দৈনন্দিন জীবনে।', '2026-04-02 11:10:33.586+00');
INSERT INTO public.site_settings VALUES (6, 'admin_username_override', 'admin', '2026-04-02 08:29:12.757+00');
INSERT INTO public.site_settings VALUES (7, 'admin_password_override', 'CHANGE_ME_IN_SUPABASE');
INSERT INTO public.site_settings VALUES (11, 'hero_cta_primary', 'শেখা শুরু করুন', '2026-04-02 11:10:33.589+00');
INSERT INTO public.site_settings VALUES (12, 'hero_cta_primary_href', '/blog', '2026-04-02 11:10:33.592+00');
INSERT INTO public.site_settings VALUES (13, 'hero_cta_secondary', 'AI টুলস এক্সপ্লোর করুন', '2026-04-02 11:10:33.595+00');
INSERT INTO public.site_settings VALUES (14, 'hero_cta_secondary_href', '/tools', '2026-04-02 11:10:33.599+00');
INSERT INTO public.site_settings VALUES (22, 'brand_name', 'AI শিখি বাংলায়', '2026-04-02 11:10:33.562+00');
INSERT INTO public.site_settings VALUES (23, 'logo_url', '', '2026-04-02 11:10:33.565+00');
INSERT INTO public.site_settings VALUES (1, 'youtube_channel_url', 'https://www.youtube.com/@aishikhibanglay', '2026-04-02 11:10:33.568+00');
INSERT INTO public.site_settings VALUES (15, 'newsletter_title', 'আপডেট পেতে সাবস্ক্রাইব করুন', '2026-04-02 11:10:33.602+00');
INSERT INTO public.site_settings VALUES (16, 'newsletter_subtitle', 'নতুন ব্লগ পোস্ট ও AI আপডেট সরাসরি আপনার ইমেইলে পাঠাবো।', '2026-04-02 11:10:33.604+00');
INSERT INTO public.site_settings VALUES (17, 'footer_description', 'আপনার মাতৃভাষায় আর্টিফিশিয়াল ইন্টেলিজেন্স শেখার বিশ্বস্ত প্ল্যাটফর্ম। ভবিষ্যতের প্রযুক্তির সাথে তাল মিলিয়ে চলতে আমাদের সাথেই থাকুন।', '2026-04-02 11:10:33.607+00');
INSERT INTO public.site_settings VALUES (18, 'footer_copyright', 'AI শিখি বাংলায়। সর্বস্বত্ব সংরক্ষিত।', '2026-04-02 11:10:33.61+00');
INSERT INTO public.site_settings VALUES (19, 'footer_tagline', 'তৈরি করা হয়েছে ভালোবাসার সাথে, বাংলাদেশের জন্য।', '2026-04-02 11:10:33.616+00');
INSERT INTO public.site_settings VALUES (20, 'footer_main_title', 'গুরুত্বপূর্ণ পেজ', '2026-04-02 11:10:33.619+00');
INSERT INTO public.site_settings VALUES (21, 'footer_legal_title', 'আইনি তথ্য', '2026-04-02 11:10:33.622+00');
INSERT INTO public.social_links VALUES (1, 'YouTube', '#', 'youtube', 1);
INSERT INTO public.social_links VALUES (2, 'Facebook', '#', 'facebook', 2);
INSERT INTO public.social_links VALUES (3, 'Instagram', '#', 'instagram', 3);
INSERT INTO public.subscribers VALUES (1, 'bangla@example.com', '2026-04-01 21:45:12.819596+00');
INSERT INTO public.subscribers VALUES (2, 'test.newsletter@gmail.com', '2026-04-01 21:46:45.673151+00');
INSERT INTO public.subscribers VALUES (3, 'shahadat.ticketmaster.com@gmail.com', '2026-04-02 00:44:06.852722+00');
ALTER TABLE ONLY public.ai_tools
    ADD CONSTRAINT ai_tools_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.nav_items
    ADD CONSTRAINT nav_items_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.page_views
    ADD CONSTRAINT page_views_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_slug_unique UNIQUE (slug);
ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_token_unique UNIQUE (token);
ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_unique UNIQUE (slug);
ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_key_unique UNIQUE (key);
ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.social_links
    ADD CONSTRAINT social_links_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.subscribers
    ADD CONSTRAINT subscribers_email_unique UNIQUE (email);
ALTER TABLE ONLY public.subscribers
    ADD CONSTRAINT subscribers_pkey PRIMARY KEY (id);

-- Reset sequences to avoid primary key conflicts on new inserts
SELECT setval('public.ai_tools_id_seq', 6, true);
SELECT setval('public.nav_items_id_seq', 13, true);
SELECT setval('public.page_views_id_seq', 109, true);
SELECT setval('public.pages_id_seq', 1, false);
SELECT setval('public.password_reset_tokens_id_seq', 5, true);
SELECT setval('public.posts_id_seq', 3, true);
SELECT setval('public.site_settings_id_seq', 24, true);
SELECT setval('public.social_links_id_seq', 3, true);
SELECT setval('public.subscribers_id_seq', 3, true);
