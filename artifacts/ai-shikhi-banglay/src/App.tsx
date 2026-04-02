import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageLayout } from "./components/layout/page-layout";
import NotFound from "@/pages/not-found";
import { AdminContext, useAdminState } from "@/hooks/useAdmin";
import { DBBackedPage } from "./components/DBBackedPage";
import CookieConsent from "./components/CookieConsent";
import { usePageViewTracker } from "./hooks/usePageViewTracker";

// Public pages — eager (always needed)
import Home from "./pages/home";

// Public pages — lazy (loaded on demand)
const Blog = lazy(() => import("./pages/blog"));
const Tools = lazy(() => import("./pages/tools"));
const BlogChatGPTGuide = lazy(() => import("./pages/blog-chatgpt-guide"));
const BlogPost = lazy(() => import("./pages/blog-post"));
const DynamicPage = lazy(() => import("./pages/dynamic-page"));

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
          <Route path="/about" component={() => <DBBackedPage slug="about" />} />
          <Route path="/contact" component={() => <DBBackedPage slug="contact" />} />
          <Route path="/privacy-policy" component={() => <DBBackedPage slug="privacy-policy" />} />
          <Route path="/terms-and-conditions" component={() => <DBBackedPage slug="terms-and-conditions" />} />
          <Route path="/disclaimer" component={() => <DBBackedPage slug="disclaimer" />} />
          <Route path="/cookie-policy" component={() => <DBBackedPage slug="cookie-policy" />} />
          <Route path="/blog/chatgpt-bangla-guide" component={BlogChatGPTGuide} />
          <Route path="/blog/:slug" component={BlogPost} />
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

function AppInner() {
  const adminState = useAdminState();

  return (
    <AdminContext.Provider value={adminState}>
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
    </HelmetProvider>
  );
}

export default App;
