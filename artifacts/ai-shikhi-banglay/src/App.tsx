import { lazy, Suspense, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageLayout } from "./components/layout/page-layout";
import NotFound from "@/pages/not-found";
import { AdminContext, useAdminState } from "@/hooks/useAdmin";
import { DBBackedPage } from "./components/DBBackedPage";
import CookieConsent from "./components/CookieConsent";
import { usePageViewTracker } from "./hooks/usePageViewTracker";
import { useSiteSettings } from "./lib/useSiteSettings";

// Public pages — eager (always needed)
import Home from "./pages/home";
import Contact from "./pages/contact";

// Public pages — lazy (loaded on demand)
const FAQ = lazy(() => import("./pages/faq"));
const Blog = lazy(() => import("./pages/blog"));
const Tools = lazy(() => import("./pages/tools"));
const BlogChatGPTGuide = lazy(() => import("./pages/blog-chatgpt-guide"));
const BlogPost = lazy(() => import("./pages/blog-post"));
const DynamicPage = lazy(() => import("./pages/dynamic-page"));
const About = lazy(() => import("./pages/about"));
const PrivacyPolicy = lazy(() => import("./pages/privacy-policy"));
const TermsAndConditions = lazy(() => import("./pages/terms-and-conditions"));
const Disclaimer = lazy(() => import("./pages/disclaimer"));
const CookiePolicy = lazy(() => import("./pages/cookie-policy"));

// Admin pages — all lazy (never needed on public routes)
const AdminLogin = lazy(() => import("./pages/admin/login"));
const AdminDashboard = lazy(() => import("./pages/admin/index"));
const PostEditorPage = lazy(() => import("./pages/admin/post-editor"));
const AdminSettingsPage = lazy(() => import("./pages/admin/settings"));
const NavManagerPage = lazy(() => import("./pages/admin/nav-manager"));
const PagesManagerPage = lazy(() => import("./pages/admin/pages-manager"));
const PageEditorPage = lazy(() => import("./pages/admin/page-editor"));
const SubscriberListPage = lazy(() => import("./pages/admin/subscribers"));
const ResetPasswordPage = lazy(() => import("./pages/admin/reset-password"));
const AdminSocialLinksPage = lazy(() => import("./pages/admin/social-links"));
const AdminToolsManagerPage = lazy(() => import("./pages/admin/tools-manager"));
const FooterManagerPage = lazy(() => import("./pages/admin/footer-manager"));
const NavbarManagerPage = lazy(() => import("./pages/admin/navbar-manager"));
const FaqManagerPage = lazy(() => import("./pages/admin/faq-manager"));
const BlogSettingsPage = lazy(() => import("./pages/admin/blog-settings"));
const CommunityPage = lazy(() => import("./pages/community"));
const CommunityPostPage = lazy(() => import("./pages/community-post"));
const CommunityManagerPage = lazy(() => import("./pages/admin/community-manager"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
    },
  },
});

const PageFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

function PublicRouter() {
  usePageViewTracker();
  return (
    <PageLayout>
      <Suspense fallback={<PageFallback />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/blog" component={Blog} />
          <Route path="/tools" component={Tools} />
          <Route path="/faq" component={FAQ} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-and-conditions" component={TermsAndConditions} />
          <Route path="/disclaimer" component={Disclaimer} />
          <Route path="/cookie-policy" component={CookiePolicy} />
          <Route path="/blog/chatgpt-bangla-guide" component={BlogChatGPTGuide} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/community" component={CommunityPage} />
          <Route path="/community/post/:id" component={CommunityPostPage} />
          <Route path="/pages/:slug" component={DynamicPage} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </PageLayout>
  );
}

function AdminRouter() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Switch>
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/posts/new" component={() => <PostEditorPage />} />
        <Route path="/admin/posts/:id/edit" component={({ params }) => <PostEditorPage params={params} />} />
        <Route path="/admin/settings" component={AdminSettingsPage} />
        <Route path="/admin/nav" component={NavManagerPage} />
        <Route path="/admin/pages" component={PagesManagerPage} />
        <Route path="/admin/pages/new" component={() => <PageEditorPage />} />
        <Route path="/admin/pages/:id/edit" component={({ params }) => <PageEditorPage params={params} />} />
        <Route path="/admin/subscribers" component={SubscriberListPage} />
        <Route path="/admin/social-links" component={AdminSocialLinksPage} />
        <Route path="/admin/tools" component={AdminToolsManagerPage} />
        <Route path="/admin/footer" component={FooterManagerPage} />
        <Route path="/admin/navbar" component={NavbarManagerPage} />
        <Route path="/admin/faq" component={FaqManagerPage} />
        <Route path="/admin/blog-settings" component={BlogSettingsPage} />
        <Route path="/admin/community" component={CommunityManagerPage} />
        <Route path="/admin/reset-password" component={ResetPasswordPage} />
      </Switch>
    </Suspense>
  );
}

function Router() {
  const path = window.location.pathname;
  const isAdmin = path.startsWith("/admin");

  if (isAdmin) {
    return <AdminRouter />;
  }
  return (
    <>
      <PublicRouter />
      <CookieConsent />
    </>
  );
}

function CustomHeadScript() {
  const { settings } = useSiteSettings();

  useEffect(() => {
    if (!settings.custom_head_script) return;

    const container = document.createElement("div");
    container.innerHTML = settings.custom_head_script;
    const scripts = container.querySelectorAll("script");
    const metas = container.querySelectorAll("meta, link");

    const injected: HTMLElement[] = [];

    metas.forEach((el) => {
      const clone = el.cloneNode(true) as HTMLElement;
      document.head.appendChild(clone);
      injected.push(clone);
    });

    scripts.forEach((el) => {
      const s = document.createElement("script");
      Array.from(el.attributes).forEach((attr) => s.setAttribute(attr.name, attr.value));
      if (!el.src) s.textContent = el.textContent;
      document.head.appendChild(s);
      injected.push(s);
    });

    return () => { injected.forEach((el) => el.remove()); };
  }, [settings.custom_head_script]);

  return null;
}

function AppInner() {
  const adminState = useAdminState();

  return (
    <AdminContext.Provider value={adminState}>
      <CustomHeadScript />
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
      <Toaster />
    </AdminContext.Provider>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AppInner />
        </TooltipProvider>
      </QueryClientProvider>
      <Analytics />
    </HelmetProvider>
  );
}

export default App;
