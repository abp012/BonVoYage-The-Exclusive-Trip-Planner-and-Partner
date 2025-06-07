import React from 'react';
import { SignUp } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Globe, ArrowLeft } from "lucide-react";

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Navigation Back */}
      <div className="absolute top-6 left-6">
        <Link to="/" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Brand Header */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-2">
          <Globe className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">BonVoyage : The Trip Planner</span>
        </div>
      </div>

      {/* Clerk Sign Up Component */}
      <div className="mt-16">
        <SignUp 
          routing="path"
          path="/signup"
          signInUrl="/signin"
          redirectUrl="/"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl border-0 bg-white/95 backdrop-blur-sm",
              headerTitle: "text-2xl font-bold text-gray-900",
              headerSubtitle: "text-gray-600",
              socialButtonsBlockButton: "border-gray-300 hover:bg-gray-50 text-gray-700",
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-medium h-11",
              formResendCodeLink: "text-blue-600 hover:text-blue-700",
              footerActionLink: "text-blue-600 hover:text-blue-700 font-medium",
              formFieldInput: "border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-11",
              formFieldLabel: "text-gray-700 font-medium",
              identityPreviewText: "text-gray-600",
              identityPreviewEditButton: "text-blue-600 hover:text-blue-700"
            },
            variables: {
              colorPrimary: "#2563eb",
              colorBackground: "#ffffff",
              colorInputBackground: "#ffffff",
              colorInputText: "#1f2937",
              colorText: "#1f2937",
              colorTextSecondary: "#6b7280",
              borderRadius: "0.5rem"
            }
          }}
        />
      </div>
    </div>
  );
};

export default SignUpPage;
