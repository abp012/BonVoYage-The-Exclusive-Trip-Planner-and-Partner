import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RedirectToSignIn, RedirectToSignUp } from "@clerk/clerk-react";
import { Wrapper } from '@googlemaps/react-wrapper';
import Home from "./pages/Home";
import TripPlanner from "./pages/TripPlanner";
import Destinations from "./pages/Destinations";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import MyCredits from "./pages/MyCredits";
import MyTrips from "./pages/MyTrips";
import MyTravelExpenses from "./pages/MyTravelExpenses";
import Profile from "./pages/Profile";
import RewardsCredits from "./pages/RewardsCredits";
import PremiumSubscription from "./pages/PremiumSubscription";
import UserDashboard from "./components/UserDashboard";
import FeedbackTest from "./pages/FeedbackTest";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Loading component for Google Maps API
const LoadingComponent = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-lg">Loading Google Maps...</div>
  </div>
);

// Error component for Google Maps API
const ErrorComponent = ({ error }: { error: Error }) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-8">
    <div className="max-w-lg text-center space-y-4">
      <div className="text-red-500 text-lg font-semibold">
        Google Maps API Issue
      </div>
      <div className="text-gray-600">
        {error.message.includes('Failed to load') 
          ? 'Google Maps API is being blocked by your browser or ad blocker. The app will continue to work, but maps may not be available.'
          : error.message
        }
      </div>
      <div className="text-sm text-gray-500">
        To enable maps, please disable your ad blocker for this site or check your browser settings.
      </div>
      <div className="pt-4">
        <AppContent />
      </div>
    </div>
  </div>
);

// Main app content
const AppContent = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/planner" element={<TripPlanner />} />
      <Route path="/destinations" element={<Destinations />} />
      <Route path="/my-credits" element={<MyCredits />} />
      <Route path="/my-trips" element={<MyTrips />} />
      <Route path="/my-expenses" element={<MyTravelExpenses />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/rewards" element={<RewardsCredits />} />
      <Route path="/premium" element={<PremiumSubscription />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/feedback-test" element={<FeedbackTest />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      
      {/* Clerk SSO Callback Routes */}
      <Route path="/signin/sso-callback" element={<SignIn />} />
      <Route path="/signup/sso-callback" element={<SignUp />} />
      
      {/* Clerk Email Verification Routes */}
      <Route path="/signup/verify-email-address" element={<SignUp />} />
      <Route path="/signin/verify-email-address" element={<SignIn />} />
      
      {/* Clerk Multi-Factor Authentication Routes */}
      <Route path="/signin/factor-one" element={<SignIn />} />
      <Route path="/signin/factor-two" element={<SignIn />} />
      <Route path="/signup/factor-one" element={<SignUp />} />
      <Route path="/signup/factor-two" element={<SignUp />} />
      
      {/* Clerk Password Reset Routes */}
      <Route path="/signin/reset-password" element={<SignIn />} />
      <Route path="/signin/reset-password-success" element={<SignIn />} />
      <Route path="/signup/continue" element={<SignUp />} />
      <Route path="/signup/verify" element={<SignUp />} />
      
      {/* Fallback routes for Clerk authentication */}
      <Route path="/sign-in/*" element={<RedirectToSignIn />} />
      <Route path="/sign-up/*" element={<RedirectToSignUp />} />
      
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

const App = () => {
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!googleMapsApiKey) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">
          Google Maps API key not found. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Wrapper
          apiKey={googleMapsApiKey}
          render={(status) => {
            switch (status) {
              case 'LOADING':
                return <LoadingComponent />;
              case 'FAILURE':
                // Still render the app even if Google Maps fails
                console.warn('Google Maps API failed to load, continuing without maps');
                return <AppContent />;
              case 'SUCCESS':
                return <AppContent />;
              default:
                return <LoadingComponent />;
            }
          }}
          libraries={['places', 'geometry']}
        >
          <AppContent />
        </Wrapper>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
