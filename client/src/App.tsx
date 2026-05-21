import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "./pages/LandingPage";
import ExplorePage from "./pages/ExplorePage";
import UploadPage from "./pages/UploadPage";
import PricingPage from "./pages/PricingPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundCancellation from "./pages/RefundCancellation";
import ContactUs from "./pages/ContactUs";
import ShippingDelivery from "./pages/ShippingDelivery";
import TermsAndConditions from "./pages/TermsAndConditions";
import DashboardPage from "./pages/DashboardPage";
import HistoryPage from "./pages/HistoryPage";
import BillingPage from "./pages/BillingPage";
import SettingsPage from "./pages/SettingsPage";
import APIKeysPage from "./pages/APIKeysPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import TextToImagePage from "./pages/tools/TextToImagePage";
import TextToAudioPage from "./pages/tools/TextToAudioPage";
import QRCodeGeneratorPage from "./pages/tools/QRCodePage";
import PhotoEnhancementPage from "./pages/tools/PhotoEnhancementPage";
import TextToVideoPage from "./pages/tools/TextToVideoPage";
import GIFCreatorPage from "./pages/tools/GIFCreatorPage";
import TextToTemplatePage from "./pages/tools/TextToTemplatePage";
import MagicAIPage from "./pages/tools/MagicAIPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refund-cancellation" element={<RefundCancellation />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/shipping-delivery" element={<ShippingDelivery />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/tools/text-to-image" element={<TextToImagePage />} />
          <Route path="/tools/text-to-audio" element={<TextToAudioPage />} />
          <Route path="/tools/text-to-video" element={<TextToVideoPage />} />
          <Route path="/tools/gif-creator" element={<GIFCreatorPage />} />
          <Route path="/tools/qr-code" element={<QRCodeGeneratorPage />} />
          <Route
            path="/tools/photo-enhancement"
            element={<PhotoEnhancementPage />}
          />
          <Route path="/tools/text-template" element={<TextToTemplatePage />} />
          <Route path="/tools/magic-ai" element={<MagicAIPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/api-keys" element={<APIKeysPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
