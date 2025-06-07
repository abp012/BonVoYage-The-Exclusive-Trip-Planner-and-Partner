import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Star, MapPin, User, Mail, Calendar } from "lucide-react";

const FeedbackAdmin = () => {
  const feedback = useQuery(api.feedback.getAllFeedback);

  if (!feedback) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading feedback...</p>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
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
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Feedback Dashboard
        </h1>
        <p className="text-gray-600">
          Total feedback entries: {feedback.length}
        </p>
      </div>

      {feedback.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-lg text-gray-600">No feedback submissions found.</p>
            <p className="text-sm text-gray-500 mt-2">
              Feedback will appear here once users submit their reviews.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {feedback.map((item) => (
            <Card key={item._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-600" />
                      {item.name}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {item.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {item.fromWhere}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(item.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1">
                      {renderStars(item.rating)}
                      <span className="ml-1 text-sm font-medium">
                        {item.rating}/5
                      </span>
                    </div>
                    {item.destination && (
                      <Badge variant="secondary" className="text-xs">
                        {item.destination}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800 leading-relaxed">
                    {item.comments}
                  </p>
                </div>
                {item.userId && (
                  <p className="text-xs text-gray-500 mt-2">
                    User ID: {item.userId}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackAdmin;
