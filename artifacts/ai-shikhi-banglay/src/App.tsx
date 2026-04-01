import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { PageLayout } from "./components/layout/page-layout";
import NotFound from "@/pages/not-found";

// Pages
import Home from "./pages/home";
import Blog from "./pages/blog";
import Tools from "./pages/tools";
import About from "./pages/about";
import Contact from "./pages/contact";
import PrivacyPolicy from "./pages/privacy-policy";
import TermsAndConditions from "./pages/terms-and-conditions";
import Disclaimer from "./pages/disclaimer";
import CookiePolicy from "./pages/cookie-policy";
import BlogChatGPTGuide from "./pages/blog-chatgpt-guide";
import CookieConsent from "./components/CookieConsent";

const queryClient = new QueryClient();

function Router() {
  return (
    <PageLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/blog" component={Blog} />
        <Route path="/tools" component={Tools} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-and-conditions" component={TermsAndConditions} />
        <Route path="/disclaimer" component={Disclaimer} />
        <Route path="/cookie-policy" component={CookiePolicy} />
        <Route path="/blog/chatgpt-bangla-guide" component={BlogChatGPTGuide} />
        <Route component={NotFound} />
      </Switch>
    </PageLayout>
  );
}

function App() {
  // Enforce dark mode globally
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
          <CookieConsent />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;