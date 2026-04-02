import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageLayout } from "./components/layout/page-layout";
import NotFound from "@/pages/not-found";
import { AdminContext, useAdminState } from "@/hooks/useAdmin";

// Pages
import Home from "./pages/home";
import Blog from "./pages/blog";
import Tools from "./pages/tools";
import BlogChatGPTGuide from "./pages/blog-chatgpt-guide";
import BlogPost from "./pages/blog-post";
import DynamicPage from "./pages/dynamic-page";
import CookieConsent from "./components/CookieConsent";
import { DBBackedPage } from "./components/DBBackedPage";
import { usePageViewTracker } from "./hooks/usePageViewTracker";

// Admin Pages
import AdminLogin from "./pages/admin/login";
import AdminDashboard from "./pages/admin/index";
import PostEditorPage from "./pages/admin/post-editor";
import AdminSettingsPage from "./pages/admin/settings";
import NavManagerPage from "./pages/admin/nav-manager";
import PagesManagerPage from "./pages/admin/pages-manager";
import PageEditorPage from "./pages/admin/page-editor";
import SubscriberListPage from "./pages/admin/subscribers";
import ResetPasswordPage from "./pages/admin/reset-password";
import AdminSocialLinksPage from "./pages/admin/social-links";
import AdminToolsManagerPage from "./pages/admin/tools-manager";
import FooterManagerPage from "./pages/admin/footer-manager";
import NavbarManagerPage from "./pages/admin/navbar-manager";

const queryClient = new QueryClient();

function PublicRouter() {
  usePageViewTracker();
  return (
    <PageLayout>
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
    </PageLayout>
  );
}

function AdminRouter() {
  return (
    <Switch>
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route
        path="/admin/posts/new"
        component={() => <PostEditorPage />}
      />
      <Route
        path="/admin/posts/:id/edit"
        component={({ params }) => <PostEditorPage params={params} />}
      />
      <Route path="/admin/settings" component={AdminSettingsPage} />
      <Route path="/admin/nav" component={NavManagerPage} />
      <Route path="/admin/pages" component={PagesManagerPage} />
      <Route
        path="/admin/pages/new"
        component={() => <PageEditorPage />}
      />
      <Route
        path="/admin/pages/:id/edit"
        component={({ params }) => <PageEditorPage params={params} />}
      />
      <Route path="/admin/subscribers" component={SubscriberListPage} />
      <Route path="/admin/social-links" component={AdminSocialLinksPage} />
      <Route path="/admin/tools" component={AdminToolsManagerPage} />
      <Route path="/admin/footer" component={FooterManagerPage} />
      <Route path="/admin/navbar" component={NavbarManagerPage} />
      <Route path="/admin/reset-password" component={ResetPasswordPage} />
    </Switch>
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
