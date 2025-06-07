import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Star, TestTube, Database, Check, X } from "lucide-react";
import { toast } from "sonner";

const FeedbackTester = () => {
  const [testFeedback, setTestFeedback] = useState({
    name: "Test User",
    email: "test@example.com",
    fromWhere: "Test City",
    comments: "This is a test feedback to verify database storage functionality.",
    rating: 5,
    destination: "Paris"
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmissionId, setLastSubmissionId] = useState<string>("");

  const submitFeedback = useMutation(api.feedback.submitFeedback);
  const allFeedback = useQuery(api.feedback.getAllFeedback);

  const handleTestSubmission = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitFeedback({
        name: testFeedback.name,
        email: testFeedback.email,
        fromWhere: testFeedback.fromWhere,
        comments: testFeedback.comments,
        rating: testFeedback.rating,
        destination: testFeedback.destination,
        clerkUserId: undefined, // Test without user authentication
      });

      if (result.success) {
        setLastSubmissionId(result.feedbackId);
        toast.success("✅ Test feedback submitted successfully!");
      } else {
        toast.error("❌ Failed to submit test feedback");
      }
    } catch (error) {
      console.error("Test submission error:", error);
      toast.error("❌ Error during test submission");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateRandomTestData = () => {
    const names = ["Alice Johnson", "Bob Smith", "Carol Davis", "David Wilson", "Emma Brown"];
    const cities = ["New York", "London", "Tokyo", "Mumbai", "Sydney"];
    const destinations = ["Paris", "Bali", "Tokyo", "New York", "London"];
    const comments = [
      "Amazing experience! Highly recommended.",
      "Great service and wonderful recommendations.",
      "The trip planning was excellent and very detailed.",
      "Perfect itinerary, everything was well organized.",
      "Outstanding support and beautiful destinations."
    ];

    setTestFeedback({
      name: names[Math.floor(Math.random() * names.length)],
      email: `test${Date.now()}@example.com`,
      fromWhere: cities[Math.floor(Math.random() * cities.length)],
      comments: comments[Math.floor(Math.random() * comments.length)],
      rating: Math.floor(Math.random() * 5) + 1,
      destination: destinations[Math.floor(Math.random() * destinations.length)]
    });
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <TestTube className="h-8 w-8 text-blue-600" />
          Feedback Database Testing
        </h1>
        <p className="text-gray-600">
          Test feedback submission and verify database storage functionality.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Submission Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5 text-green-600" />
              Submit Test Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <Input
                value={testFeedback.name}
                onChange={(e) => setTestFeedback({...testFeedback, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={testFeedback.email}
                onChange={(e) => setTestFeedback({...testFeedback, email: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Where
              </label>
              <Input
                value={testFeedback.fromWhere}
                onChange={(e) => setTestFeedback({...testFeedback, fromWhere: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination
              </label>
              <Input
                value={testFeedback.destination}
                onChange={(e) => setTestFeedback({...testFeedback, destination: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 cursor-pointer ${
                      star <= testFeedback.rating 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "text-gray-300 hover:text-yellow-400"
                    }`}
                    onClick={() => setTestFeedback({...testFeedback, rating: star})}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {testFeedback.rating}/5
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comments
              </label>
              <Textarea
                value={testFeedback.comments}
                onChange={(e) => setTestFeedback({...testFeedback, comments: e.target.value})}
                rows={3}
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleTestSubmission}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Submitting..." : "Submit Test Feedback"}
              </Button>
              <Button
                variant="outline"
                onClick={generateRandomTestData}
                className="whitespace-nowrap"
              >
                Random Data
              </Button>
            </div>
            
            {lastSubmissionId && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-800">
                  <Check className="h-4 w-4" />
                  <span className="font-medium">Success!</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Feedback ID: {lastSubmissionId}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Database Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              Database Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allFeedback === undefined ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Loading...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-900">
                      Total Feedback Entries
                    </span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {allFeedback.length}
                    </Badge>
                  </div>
                </div>
                
                {allFeedback.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Recent Entries:</h4>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {allFeedback.slice(0, 5).map((feedback) => (
                        <div
                          key={feedback._id}
                          className="bg-gray-50 border rounded-lg p-3"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">
                              {feedback.name}
                            </span>
                            <div className="flex items-center gap-1">
                              {renderStars(feedback.rating)}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 truncate">
                            {feedback.comments}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(feedback.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {allFeedback.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <X className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No feedback entries found</p>
                    <p className="text-sm">Submit test feedback to verify database storage</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeedbackTester;
