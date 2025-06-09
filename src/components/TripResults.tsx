import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Calendar, Users, DollarSign, Utensils, Activity, PackageCheck, ArrowLeft, Trash2, Plus, Sunrise, Sun, Sunset, Clock, MapIcon, Star, MessageSquare, Send, Sparkles, Loader2, ChevronDown, ChevronUp, Info, Timer, IndianRupee, Hotel, Building2 } from "lucide-react";
import WeatherWidget from './WeatherWidget';
import PlacesMap from './PlacesMap';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { useGeminiData } from '../hooks/useGeminiData';
import { PlaceDetail } from '../services/geminiService';
import { AIBadge, AIContentWrapper } from './ui/ai-badge';
import LoadingSpinner from './ui/loading-spinner';
import ErrorFallback from './ui/error-fallback';
import { useDestinationCoordinates, useNearbyPlaces } from '../hooks/useGoogleMaps';
import { googleMapsService } from '../services/googleMapsService';
// import { allDestinations } from '../data/destinations';

// Place interface for type safety
interface Place {
  id: string;
  name: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  category: string;
  imageUrl: string;
}

// Extended Place interface to support AI-generated data
interface EnhancedPlace extends Place {
  aiData?: {
    highlights: string[];
    bestTimeToVisit: string;
    entryFee: string;
    duration: string;
    nearbyAttractions: string[];
    localTips: string[];
  };
}

interface TripData {
  destination: string;
  days: number;
  startDate?: string;
  endDate?: string;
  people: number;
  budget: { min: number; max: number } | number; // Support both formats for backward compatibility
  activities: string[];
  travelWith: string;
}

interface TripResultsProps {
  tripData: TripData;
  tripPlanId?: string | null; // Optional trip plan ID for rewards
  onReset: () => void;
}

const TripResults = ({ tripData, tripPlanId, onReset }: TripResultsProps) => {
  const { destination, days, startDate, endDate, people, budget, activities, travelWith } = tripData;
  const { user } = useUser();

  // Helper function to format budget for display and API calls
  const formatBudgetForAPI = (budget: { min: number; max: number } | number): string => {
    if (typeof budget === 'object') {
      return `₹${budget.min.toLocaleString()} - ₹${budget.max.toLocaleString()}`;
    }
    return `₹${budget.toLocaleString()}`;
  };

  // Get AI-generated content from Gemini
  const geminiData = useGeminiData({
    destination,
    days,
    budget: formatBudgetForAPI(budget),
    activities,
    travelWith,
    people,
    startDate,
    endDate
  });

  // Get coordinates from Google Maps API
  const { coordinates: destinationCoordinates, isLoading: coordinatesLoading, error: coordinatesError } = useDestinationCoordinates(destination);

  // Get nearby places from Google Places API instead of hardcoded database
  const { places: nearbyPlaces, isLoading: placesLoading, error: placesError } = useNearbyPlaces(destinationCoordinates, 'tourist_attraction');

  // Get destination image dynamically from Google Places API
  const [destinationImage, setDestinationImage] = useState<string>('');
  const [imageLoading, setImageLoading] = useState<boolean>(true);

  // Check if content is still loading
  const isContentLoading = geminiData.isLoading || coordinatesLoading || placesLoading || imageLoading;

  // Find destination in the predefined list for additional info like flag and rating
  // const foundDestination = allDestinations.find(dest => 
  //   dest.name.toLowerCase().includes(destination.toLowerCase()) || 
  //   destination.toLowerCase().includes(dest.name.toLowerCase())
  // );
  const foundDestination = null; // Temporarily disabled until destinations data is available

  // State for managing selected places - Initialize with enhanced places
  const [selectedPlaces, setSelectedPlaces] = useState<EnhancedPlace[]>(() => {
    // Return empty array initially - will be updated when AI data loads
    return [];
  });
  const [selectedPlace, setSelectedPlace] = useState<EnhancedPlace | null>(null);
  const [expandedPlaceId, setExpandedPlaceId] = useState<string | null>(null);

  // Content switcher state for Places/Hotels toggle
  const [activeContentTab, setActiveContentTab] = useState<'places' | 'hotels'>('places');

  // State for hotels and restaurants
  const [hotelsAndRestaurants, setHotelsAndRestaurants] = useState<EnhancedPlace[]>([]);
  const [selectedHotelRestaurant, setSelectedHotelRestaurant] = useState<EnhancedPlace | null>(null);
  const [loadingHotelsRestaurants, setLoadingHotelsRestaurants] = useState(false);

  // Active section tracking for navigation
  const [activeSection, setActiveSection] = useState<string>('destination-image');

  // Feedback form state
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    fromWhere: '',
    comments: '',
    rating: 0
  });
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set());

  // Convex mutations and queries
  const submitFeedback = useMutation(api.feedback.submitFeedback);
  const awardFeedbackPoints = useMutation(api.users.awardFeedbackPoints);
  const destinationFeedback = useQuery(api.feedback.getFeedbackByDestination, { destination });
  
  // Check if user has already been rewarded for this trip plan
  const hasBeenRewarded = useQuery(
    api.users.hasUserBeenRewardedForTrip,
    user && tripPlanId ? { 
      clerkId: user.id, 
      tripPlanId: tripPlanId as any 
    } : "skip"
  );

  // Check if user has premium subscription
  const isPremiumUser = useQuery(
    api.subscriptions.isPremiumUser,
    user ? { clerkId: user.id } : "skip"
  );

  // Auto-populate user data when component mounts
  useEffect(() => {
    if (user) {
      setFeedbackForm(prev => ({
        ...prev,
        name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || '',
        email: user.primaryEmailAddress?.emailAddress || ''
      }));
    }
  }, [user]);

  // Scroll to top when component mounts to ensure proper display
  useEffect(() => {
    // Use immediate scroll without animation to prevent conflicts
    window.scrollTo(0, 0);
    
    // Set initial active section after a short delay to ensure DOM is ready
    setTimeout(() => {
      setActiveSection('destination-image');
    }, 100);
  }, []);

  // Auto-detect active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['destination-image', 'about', 'activities', 'weather', 'places', 'cuisine', 'itinerary', 'packing', 'best-time', 'testimonials', 'feedback'];
      const navbarHeight = 64 + 32; // navbar height + offset
      
      // Check if we're near the bottom of the page
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const isNearBottom = windowHeight + scrollTop >= documentHeight - 100; // 100px threshold
      
      // If near bottom, always highlight the last section (feedback)
      if (isNearBottom) {
        setActiveSection('feedback');
        return;
      }
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= navbarHeight && rect.bottom >= navbarHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    // Add scroll listener with a delay to allow page to settle
    const timer = setTimeout(() => {
      window.addEventListener('scroll', handleScroll);
    }, 500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Get destination testimonials combining real feedback with AI-generated and static fallback
  const getDestinationTestimonials = () => {
    // Convert real feedback from database to testimonial format
    const realFeedback = destinationFeedback?.map(feedback => ({
      name: feedback.name,
      location: feedback.fromWhere,
      text: feedback.comments,
      rating: feedback.rating,
      isReal: true, // Flag to distinguish real feedback
      isAI: false // Real feedback is not AI-generated
    })) || [];

    // Use AI-generated testimonials if available
    if (geminiData.testimonials && geminiData.testimonials.length > 0) {
      const aiTestimonials = geminiData.testimonials.map(testimonial => ({
        ...testimonial,
        isReal: false,
        isAI: true // Flag to distinguish AI-generated content
      }));
      
      // Combine real feedback with AI testimonials
      const combined = [...realFeedback];
      if (combined.length < 3) {
        const needed = 3 - combined.length;
        combined.push(...aiTestimonials.slice(0, needed));
      }
      return combined.length > 0 ? combined : aiTestimonials.slice(0, 3);
    }

    // Fallback testimonials if no AI data is available
    const fallbackTestimonials = [
      {
        name: "Travel Enthusiast",
        location: "India",
        text: "Amazing destination with incredible experiences!",
        rating: 5,
        isReal: false,
        isAI: false
      },
      {
        name: "Adventure Seeker",
        location: "India", 
        text: "Perfect place for an unforgettable journey!",
        rating: 4,
        isReal: false,
        isAI: false
      },
      {
        name: "Culture Explorer",
        location: "India",
        text: "Rich culture and beautiful landscapes await!",
        rating: 5,
        isReal: false,
        isAI: false
      }
    ];

    // Use real feedback combined with fallback if needed
    const combined = [...realFeedback];
    if (combined.length < 3) {
      const needed = 3 - combined.length;
      combined.push(...fallbackTestimonials.slice(0, needed));
    }
    
    return combined.length > 0 ? combined : fallbackTestimonials;
  };

  const destinationTestimonials = getDestinationTestimonials();

  // Handle feedback form submission
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user has already been rewarded for this trip plan (non-premium users only)
    if (tripPlanId && user && hasBeenRewarded && !isPremiumUser) {
      toast.error("You have already submitted feedback for this trip plan and received your reward points.");
      return;
    }
    
    // Check if user data is available (auto-populated)
    if (!feedbackForm.name.trim() || !feedbackForm.email.trim()) {
      toast.error("Please sign in to submit feedback");
      return;
    }

    if (!feedbackForm.fromWhere.trim()) {
      toast.error("Please enter where you are from");
      return;
    }

    if (feedbackForm.rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    if (!feedbackForm.comments.trim()) {
      toast.error("Please enter your feedback before submitting");
      return;
    }

    setIsSubmittingFeedback(true);
    
    try {
      const result = await submitFeedback({
        name: feedbackForm.name.trim(),
        email: feedbackForm.email.trim(),
        fromWhere: feedbackForm.fromWhere.trim(),
        comments: feedbackForm.comments.trim(),
        rating: feedbackForm.rating,
        destination: destination,
        clerkUserId: user?.id || undefined,
        tripPlanId: tripPlanId as any || undefined, // Include trip plan ID if available
      });

      if (result.success) {
        toast.success("Thank you for your feedback! 🎉");
        
        // Award reward points if tripPlanId is available and user is authenticated
        if (tripPlanId && user && result.feedbackId) {
          try {
            const rewardResult = await awardFeedbackPoints({
              clerkId: user.id,
              tripPlanId: tripPlanId as any, // Type conversion for Convex ID
              feedbackId: result.feedbackId as any, // Type conversion for Convex ID
            });
            
            if (rewardResult.success) {
              toast.success(
                `🎉 Congratulations! You earned ${rewardResult.pointsAwarded} reward points for your feedback!`,
                { duration: 5000 }
              );
              toast.info(
                `💰 You now have ${rewardResult.totalPoints} total reward points. Redeem them for credits in the Rewards page!`,
                { duration: 5000 }
              );
            } else if (rewardResult.message) {
              // Check if this is a premium user restriction message
              if (rewardResult.message.includes("Premium subscribers do not receive reward points")) {
                toast.info(
                  "👑 As a premium subscriber, you enjoy unlimited access without needing reward points. Thank you for your valuable feedback!",
                  { duration: 4000 }
                );
              } else {
                toast.info(rewardResult.message, { duration: 4000 });
              }
            }
          } catch (rewardError) {
            console.error("Error awarding reward points:", rewardError);
            // Don't show error to user since feedback was still successful
          }
        }
        
        // Reset form
        setFeedbackForm({
          name: '',
          email: '',
          fromWhere: '',
          comments: '',
          rating: 0
        });
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Handle feedback form input changes
  const handleFeedbackChange = (field: string, value: string | number) => {
    setFeedbackForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper functions for destination image handling
  const getDestinationImage = async (destination: string): Promise<string> => {
    try {
      // Use Google Maps API to get actual destination photo
      const imageUrl = await googleMapsService.getDestinationImage(destination);
      return imageUrl;
    } catch (error) {
      console.error('Error fetching destination image:', error);
      return getDefaultDestinationImage();
    }
  };

  const getDefaultDestinationImage = (): string => {
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop&q=80';
  };

  // Load destination image when component mounts
  useEffect(() => {
    const loadDestinationImage = async () => {
      setImageLoading(true);
      try {
        const image = await getDestinationImage(destination);
        setDestinationImage(image);
      } catch (error) {
        console.error('Failed to load destination image:', error);
        // Fallback to a generic travel image
        setDestinationImage('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop');
      } finally {
        setImageLoading(false);
      }
    };
    
    loadDestinationImage();
  }, [destination]);

  // Add place to selected list (works with both AI and database places)
  const addPlace = async (placeName: string) => {
    // Find exact match from enhanced places
    let placeToAdd = enhancedPlaces.find(place => 
      place.name.toLowerCase() === placeName.toLowerCase()
    );

    // If place found, check if it's not already added (by ID or name)
    if (placeToAdd) {
      const isAlreadyAdded = selectedPlaces.some(place => 
        place.id === placeToAdd.id || 
        place.name.toLowerCase().trim() === placeToAdd.name.toLowerCase().trim()
      );
      
      if (isAlreadyAdded) {
        toast.info(`${placeName} is already in your list`);
        return;
      }

      // Check if the place has default coordinates and try to get better ones
      const hasDefaultCoords = placeToAdd.coordinates.lat === 28.6139 && placeToAdd.coordinates.lng === 77.2090;
      const hasDestinationCoords = destinationCoordinates && 
        placeToAdd.coordinates.lat === destinationCoordinates.lat && 
        placeToAdd.coordinates.lng === destinationCoordinates.lng;

      if (hasDefaultCoords || hasDestinationCoords) {
        try {
          // Try to get proper coordinates by geocoding the place name with destination
          const { googleMapsService } = await import('../services/googleMapsService');
          const searchQuery = `${placeName}, ${destination}`;
          const properCoordinates = await googleMapsService.getDestinationCoordinates(searchQuery);
          
          // Update the place with proper coordinates
          placeToAdd = {
            ...placeToAdd,
            coordinates: properCoordinates
          };
        } catch (error) {
          console.warn(`Failed to geocode ${placeName}:`, error);
          // Continue with existing coordinates as fallback
        }
      }

      setSelectedPlaces(prev => [...prev, placeToAdd]);
      toast.success(`${placeName} added to your trip!`);
    } else {
      toast.error(`Place "${placeName}" not found`);
    }
  };

  // Remove place from selected list
  const removePlace = (placeId: string) => {
    setSelectedPlaces(prev => prev.filter(place => place.id !== placeId));
    if (selectedPlace?.id === placeId) {
      setSelectedPlace(null);
    }
  };

  // Handle place click for map zoom
  const handlePlaceClick = (place: EnhancedPlace) => {
    setSelectedPlace(place);
  };

  // Handle hotel/restaurant click for map zoom
  const handleHotelRestaurantClick = (place: EnhancedPlace) => {
    setSelectedHotelRestaurant(place);
  };

  // Handle content tab switching
  const handleContentTabSwitch = (tab: 'places' | 'hotels') => {
    setActiveContentTab(tab);
    // Clear selections when switching tabs
    if (tab === 'places') {
      setSelectedHotelRestaurant(null);
    } else {
      setSelectedPlace(null);
    }
  };

  // Toggle day expansion for itinerary
  const toggleDayExpansion = (dayNumber: number) => {
    setExpandedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dayNumber)) {
        newSet.delete(dayNumber);
      } else {
        newSet.add(dayNumber);
      }
      return newSet;
    });
  };

  // Function to merge AI-generated places with Google Places API data
  const mergeAIPlacesWithGooglePlaces = (aiPlaces: PlaceDetail[] | null): EnhancedPlace[] => {
    const mergedPlaces: EnhancedPlace[] = [];
    
    // Convert AI places to EnhancedPlace objects
    if (aiPlaces && aiPlaces.length > 0) {
      aiPlaces.forEach((aiPlace, index) => {
        // Improved matching logic for Google places
        const googleMatch = nearbyPlaces.find(googlePlace => {
          const aiPlaceName = aiPlace.name.toLowerCase().trim();
          const googlePlaceName = googlePlace.name.toLowerCase().trim();
          
          // Check for exact match
          if (aiPlaceName === googlePlaceName) return true;
          
          // Check for partial matches (either direction)
          if (aiPlaceName.includes(googlePlaceName) || googlePlaceName.includes(aiPlaceName)) return true;
          
          // Check for common landmark patterns
          const aiPlaceWords = aiPlaceName.split(/\s+/);
          const googlePlaceWords = googlePlaceName.split(/\s+/);
          
          // If both have more than one word, check if they share significant words
          if (aiPlaceWords.length > 1 && googlePlaceWords.length > 1) {
            const sharedWords = aiPlaceWords.filter(word => 
              word.length > 3 && googlePlaceWords.some(gWord => gWord.includes(word) || word.includes(gWord))
            );
            if (sharedWords.length >= 1) return true;
          }
          
          return false;
        });

        // Create EnhancedPlace object from AI data with better coordinate handling
        const place: EnhancedPlace = {
          id: `ai-${index}`,
          name: aiPlace.name,
          description: aiPlace.description,
          category: aiPlace.category,
          coordinates: googleMatch?.coordinates || destinationCoordinates || { lat: 28.6139, lng: 77.2090 },
          imageUrl: googleMatch?.photoUrl || "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=250&fit=crop",
          // Store additional AI data
          aiData: {
            highlights: aiPlace.highlights,
            bestTimeToVisit: aiPlace.bestTimeToVisit,
            entryFee: aiPlace.entryFee,
            duration: aiPlace.duration,
            nearbyAttractions: aiPlace.nearbyAttractions,
            localTips: aiPlace.localTips
          }
        };

        mergedPlaces.push(place);
      });
    }

    // Add Google Places if we have fewer than 8 places and Google Places API has data
    if (nearbyPlaces && nearbyPlaces.length > 0) {
      const remainingSlots = Math.max(0, 8 - mergedPlaces.length);
      const remainingGooglePlaces = nearbyPlaces
        .filter(googlePlace => !mergedPlaces.some(merged => 
          merged.name.toLowerCase().includes(googlePlace.name.toLowerCase()) ||
          googlePlace.name.toLowerCase().includes(merged.name.toLowerCase())
        ))
        .slice(0, remainingSlots)
        .map((googlePlace, index) => ({
          id: `google-${index}`,
          name: googlePlace.name,
          description: `${googlePlace.types?.join(', ') || 'Tourist attraction'} rated ${googlePlace.rating || 'N/A'}/5`,
          category: googlePlace.types?.[0]?.replace(/_/g, ' ') || 'attraction',
          coordinates: googlePlace.coordinates || destinationCoordinates || { lat: 28.6139, lng: 77.2090 },
          imageUrl: googlePlace.photoUrl || "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=250&fit=crop"
        }));

      mergedPlaces.push(...remainingGooglePlaces);
    }

    // Fallback to empty array if no data is available
    return mergedPlaces;
  };

  // Get enhanced places list combining AI and Google Places API
  const enhancedPlaces = mergeAIPlacesWithGooglePlaces(geminiData.placesDetails);

  // Update selected places when enhanced places change
  useEffect(() => {
    if (enhancedPlaces.length > 0 && selectedPlaces.length === 0) {
      setSelectedPlaces(enhancedPlaces.slice(0, Math.min(6, enhancedPlaces.length)));
    }
  }, [enhancedPlaces, selectedPlaces.length]);

  // Fetch hotels and restaurants when destination coordinates are available
  useEffect(() => {
    const fetchHotelsAndRestaurants = async () => {
      if (!destinationCoordinates || coordinatesLoading) return;

      setLoadingHotelsRestaurants(true);
      try {
        // Fetch both hotels and restaurants
        const [hotelsPromise, restaurantsPromise] = await Promise.allSettled([
          googleMapsService.getNearbyPlaces(destinationCoordinates, 'lodging', 5000),
          googleMapsService.getNearbyPlaces(destinationCoordinates, 'restaurant', 5000)
        ]);

        const hotels = hotelsPromise.status === 'fulfilled' ? hotelsPromise.value : [];
        const restaurants = restaurantsPromise.status === 'fulfilled' ? restaurantsPromise.value : [];

        // Convert to EnhancedPlace format
        const convertToEnhancedPlace = (place: any, type: 'hotel' | 'restaurant'): EnhancedPlace => ({
          id: place.placeId || `${type}-${Math.random()}`,
          name: place.name,
          description: `${type === 'hotel' ? 'Hotel' : 'Restaurant'} • ${place.vicinity || place.address}`,
          coordinates: place.coordinates,
          category: type === 'hotel' ? 'Accommodation' : 'Dining',
          imageUrl: place.photoUrl || `/placeholder.svg`,
          aiData: {
            highlights: place.rating ? [`Rating: ${place.rating.toFixed(1)} stars`] : [],
            bestTimeToVisit: type === 'hotel' ? 'Check-in after 3 PM' : 'Peak hours: 7-9 PM',
            entryFee: place.priceLevel ? `Price level: ${place.priceLevel}/4` : 'Price varies',
            duration: type === 'hotel' ? 'Overnight stay' : '1-2 hours',
            nearbyAttractions: ['Located in city center'],
            localTips: [place.address || 'Contact for more details']
          }
        });

        // Combine and limit results
        const combinedResults = [
          ...hotels.slice(0, 5).map(hotel => convertToEnhancedPlace(hotel, 'hotel')),
          ...restaurants.slice(0, 5).map(restaurant => convertToEnhancedPlace(restaurant, 'restaurant'))
        ];

        setHotelsAndRestaurants(combinedResults);
      } catch (error) {
        console.error('Error fetching hotels and restaurants:', error);
        setHotelsAndRestaurants([]);
      } finally {
        setLoadingHotelsRestaurants(false);
      }
    };

    fetchHotelsAndRestaurants();
  }, [destinationCoordinates, coordinatesLoading]);

  // Generate date range for the trip using user-selected dates or fallback
  const generateDateRange = () => {
    if (startDate && endDate) {
      // Use user-selected dates
      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        });
      };
      
      return `${formatDate(startDate)} – ${formatDate(endDate)}`;
    } else {
      // Fallback to generated dates if user didn't select specific dates
      const start = new Date();
      start.setDate(start.getDate() + 30); // Start 30 days from now
      const end = new Date(start);
      end.setDate(end.getDate() + days - 1); // Add trip duration
      
      const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        });
      };
      
      return `${formatDate(start)} – ${formatDate(end)}`;
    }
  };

  const tripDateRange = generateDateRange();

  // Generate a comprehensive description about the destination using AI when available
  const generateCityDescription = () => {
    // Use AI-generated overview if available
    if (geminiData.destinationInfo?.overview) {
      return geminiData.destinationInfo.overview;
    }

    // Final fallback for completely unknown destinations
    return `${destination} is a captivating destination that seamlessly blends rich cultural heritage with modern attractions, creating an unforgettable experience for every type of traveler. This remarkable city boasts a fascinating history that unfolds through its stunning architecture, from ancient monuments to contemporary masterpieces that tell the story of civilizations past and present.

The local culture is vibrant and welcoming, offering visitors authentic experiences through traditional festivals, bustling markets, and warm hospitality that reflects the genuine spirit of the region. Food enthusiasts will be delighted by the diverse culinary landscape, featuring everything from street food vendors serving authentic local specialties to fine dining establishments that showcase innovative interpretations of traditional flavors.

Nature lovers will find plenty to explore, with scenic landscapes, parks, and natural attractions that provide peaceful respites from urban excitement. The city's strategic location offers easy access to surrounding areas of natural beauty and historical significance.

Whether you're interested in exploring museums and galleries, experiencing nightlife and entertainment, shopping for unique local crafts, or simply wandering through charming neighborhoods, ${destination} provides endless opportunities for discovery. The perfect blend of tradition and modernity makes this destination truly special for travelers seeking authentic cultural experiences.`;
  };



  const cityDescription = generateCityDescription();

  // Generate top activities using AI data or fallback to generic activities
  const generateTopActivities = () => {
    // Use AI-generated activities if available
    if (geminiData.destinationInfo?.activities && geminiData.destinationInfo.activities.length > 0) {
      return geminiData.destinationInfo.activities.slice(0, 7);
    }

    // Generic fallback activities
    return [
      "Explore historic landmarks and cultural sites",
      "Experience local cuisine and traditional cooking",
      "Discover vibrant markets and artisan workshops",
      "Take guided tours of architectural wonders",
      "Enjoy scenic walks and photography opportunities",
      "Participate in local festivals and cultural events",
      "Visit museums and art galleries"
    ];
  };

  const topActivities = generateTopActivities();

  const topPlaces = [
    {
      name: "Historic Old Town",
      description: "Explore centuries-old architecture and charming cobblestone streets",
      image: "photo-1472396961693-142e6e269027"
    },
    {
      name: "Central Market District",
      description: "Vibrant local markets with authentic crafts and delicious street food",
      image: "photo-1465146344425-f00d5f5c8f07"
    },
    {
      name: "Scenic Viewpoint",
      description: "Breathtaking panoramic views of the city and surrounding landscape",
      image: "photo-1470071459604-3b5ec3a7fe05"
    },
    {
      name: "Cultural Museum",
      description: "Learn about local history, art, and traditions",
      image: "photo-1513836279014-a89f7a76ae86"
    }
  ];

  const generateItinerary = () => {
    // Use AI-generated detailed itinerary if available from tripDetails
    if (geminiData.tripDetails?.detailedItinerary && geminiData.tripDetails.detailedItinerary.length > 0) {
      return geminiData.tripDetails.detailedItinerary.slice(0, days).map((dayData) => ({
        day: dayData.day,
        title: dayData.title || `Day ${dayData.day}: AI-Recommended Experience`,
        morning: dayData.morning || `Explore ${destination} morning attractions and start your day with local breakfast.`,
        afternoon: dayData.afternoon || `Continue discovering ${destination} with afternoon activities and local experiences.`,
        evening: dayData.evening || `End your day with dinner and evening entertainment in ${destination}.`,
        isAI: true,
        hasAIContent: true
      }));
    }

    // Fallback to legacy AI itinerary format if available
    if (geminiData.itinerary && geminiData.itinerary.length > 0) {
      return geminiData.itinerary.slice(0, days).map((dayPlan, index) => {
        // Ensure dayPlan is a string
        const planText = typeof dayPlan === 'string' ? dayPlan : String(dayPlan);
        
        // Enhanced parsing logic for better time period extraction
        const parseTimePeriod = (text: string, period: string): string => {
          // Create regex patterns for different period formats
          const patterns = [
            new RegExp(`${period}:\\s*([^\\n]*(?:\\n(?!(?:Morning|Afternoon|Evening):)[^\\n]*)*)`, 'i'),
            new RegExp(`${period}\\s*-\\s*([^\\n]*(?:\\n(?!(?:Morning|Afternoon|Evening):)[^\\n]*)*)`, 'i'),
            new RegExp(`${period}\\s*:([^A-Z]*?)(?=Morning:|Afternoon:|Evening:|$)`, 'i')
          ];
          
          for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
              const extracted = match[1].trim();
              // Clean up the text and ensure it's substantial
              if (extracted.length > 20) {
                return extracted.replace(/\s+/g, ' ').trim();
              }
            }
          }
          
          // Fallback: look for content after the period keyword
          const simpleFallback = text.toLowerCase();
          const periodIndex = simpleFallback.indexOf(period.toLowerCase() + ':');
          if (periodIndex !== -1) {
            let content = text.substring(periodIndex + period.length + 1);
            // Get content until next period or reasonable length
            const nextPeriodMatch = content.match(/(morning|afternoon|evening):/i);
            if (nextPeriodMatch) {
              content = content.substring(0, nextPeriodMatch.index);
            }
            content = content.trim();
            if (content.length > 20) {
              return content.substring(0, 300) + (content.length > 300 ? '...' : '');
            }
          }
          
          return null;
        };

        // Parse each time period
        const morning = parseTimePeriod(planText, 'Morning');
        const afternoon = parseTimePeriod(planText, 'Afternoon');
        const evening = parseTimePeriod(planText, 'Evening');

        // Generate fallbacks for missing periods
        const generateFallback = (period: string): string => {
          const fallbacks = {
            morning: [
              `Start your day ${index + 1} with breakfast at a local café, then explore the main attractions of ${destination}. Visit key landmarks and take in the morning atmosphere.`,
              `Begin with an early morning walk through ${destination}'s historic center. Enjoy local breakfast specialties and visit the most important cultural sites.`,
              `Morning exploration of ${destination}'s highlights. Start with the main square, visit important monuments, and experience the local morning culture.`
            ],
            afternoon: [
              `After lunch, continue discovering ${destination} with visits to museums, markets, or scenic areas. Take your time to explore local neighborhoods and hidden gems.`,
              `Post-lunch exploration of ${destination}'s cultural attractions. Visit local markets, take guided tours, and enjoy the vibrant afternoon atmosphere.`,
              `Afternoon activities in ${destination} include visiting art galleries, exploring local districts, and experiencing the authentic culture of the area.`
            ],
            evening: [
              `End your day with dinner at a traditional restaurant, enjoy local entertainment, and take an evening stroll through the illuminated streets of ${destination}.`,
              `Evening relaxation with local cuisine, cultural performances, and a peaceful walk through ${destination}'s evening ambiance.`,
              `Conclude your day with authentic dining experiences, local nightlife, and enjoying the evening charm of ${destination}.`
            ]
          };
          
          const options = fallbacks[period as keyof typeof fallbacks] || [];
          return options[index % options.length] || `Enjoy ${period} activities in ${destination}.`;
        };

        return {
          day: index + 1,
          title: `Day ${index + 1}: AI-Recommended Experience`,
          morning: morning || generateFallback('morning'),
          afternoon: afternoon || generateFallback('afternoon'),
          evening: evening || generateFallback('evening'),
          isAI: true,
          hasAIContent: !!(morning || afternoon || evening)
        };
      });
    }

    // Generic fallback itinerary for any destination
    const genericDayPlans = [
      {
        title: "Cultural Heritage & History",
        morning: "Explore historical monuments and cultural landmarks (9:00 AM - 12:00 PM)",
        afternoon: "Visit local museums and heritage sites (1:00 PM - 4:00 PM)",
        evening: "Traditional dinner and cultural performances (6:00 PM - 9:00 PM)"
      },
      {
        title: "Local Markets & Shopping",
        morning: "Traditional markets and handicraft exploration (9:00 AM - 12:00 PM)",
        afternoon: "Artisan workshops and local craft shopping (1:00 PM - 4:00 PM)",
        evening: "Cooking class and authentic cuisine experience (5:00 PM - 8:00 PM)"
      },
      {
        title: "Nature & Adventure",
        morning: "Outdoor activities and nature exploration (8:00 AM - 12:00 PM)",
        afternoon: "Scenic viewpoints and photography spots (1:00 PM - 5:00 PM)",
        evening: "Sunset viewing and local specialties dinner (6:00 PM - 9:00 PM)"
      },
      {
        title: "Spiritual & Wellness",
        morning: "Visit temples, churches, or spiritual sites (8:00 AM - 11:00 AM)",
        afternoon: "Wellness activities and relaxation (12:00 PM - 4:00 PM)",
        evening: "Peaceful dinner at scenic location (6:00 PM - 9:00 PM)"
      },
      {
        title: "Photography & Hidden Gems",
        morning: "Photography tour of iconic landmarks (7:00 AM - 11:00 AM)",
        afternoon: "Explore lesser-known attractions and secret spots (12:00 PM - 5:00 PM)",
        evening: "Local nightlife and entertainment districts (7:00 PM - 10:00 PM)"
      },
      {
        title: "Cultural Immersion",
        morning: "Meet local families and community visits (9:00 AM - 12:00 PM)",
        afternoon: "Traditional arts and crafts learning session (1:00 PM - 4:00 PM)",
        evening: "Folk music and dance performance with dinner (6:00 PM - 9:00 PM)"
      },
      {
        title: "Relaxation & Leisure",
        morning: "Leisure breakfast and gentle sightseeing (9:00 AM - 12:00 PM)",
        afternoon: "Museums, galleries, and cultural exhibitions (1:00 PM - 4:00 PM)",
        evening: "Fine dining and reflection on the journey (6:00 PM - 9:00 PM)"
      }
    ];

    // Generate itinerary based on number of days, cycling through generic plans
    const itinerary = [];
    for (let day = 1; day <= days; day++) {
      const planIndex = (day - 1) % genericDayPlans.length;
      const dayData = genericDayPlans[planIndex];
      
      itinerary.push({
        day,
        title: `Day ${day}: ${dayData.title}`,
        morning: dayData.morning,
        afternoon: dayData.afternoon,
        evening: dayData.evening
      });
    }
    return itinerary;
  };

  // Generate local cuisine recommendations based on destination
  const generateLocalCuisine = () => {
    // First priority: Use AI-generated cuisine from comprehensive trip details
    if (geminiData.tripDetails?.localCuisine && geminiData.tripDetails.localCuisine.length > 0) {
      return geminiData.tripDetails.localCuisine.slice(0, 5).map((item, index) => {
        if (typeof item === 'string') {
          // Handle string format from tripDetails
          const parts = item.split(' - ');
          return {
            dish: parts[0] || `Local Specialty ${index + 1}`,
            description: parts[1] || 'Delicious local cuisine with authentic flavors',
            restaurant: 'Local Restaurant',
            image: `https://images.unsplash.com/photo-${getRandomImageId()}?w=400&h=250&fit=crop`,
            isAI: true
          };
        }
        return {
          dish: `Local Specialty ${index + 1}`,
          description: 'Traditional local dish',
          restaurant: 'Local Restaurant',
          image: `https://images.unsplash.com/photo-${getRandomImageId()}?w=400&h=250&fit=crop`,
          isAI: true
        };
      });
    }

    // Second priority: Use legacy AI-generated cuisine recommendations
    if (geminiData.cuisineRecommendations && geminiData.cuisineRecommendations.length > 0) {
      return geminiData.cuisineRecommendations.slice(0, 5).map((item, index) => {
        if (typeof item === 'string') {
          // Handle string array format
          return {
            dish: item,
            description: 'Delicious local cuisine with authentic flavors',
            restaurant: 'Local Restaurant',
            image: `https://images.unsplash.com/photo-${getRandomImageId()}?w=400&h=250&fit=crop`,
            isAI: true
          };
        } else {
          // Handle object format - cast to any to handle the type uncertainty
          const cuisineItem = item as any;
          return {
            dish: cuisineItem.dish || cuisineItem.name || `Local Specialty ${index + 1}`,
            description: cuisineItem.description || 'Delicious local cuisine with authentic flavors',
            restaurant: cuisineItem.restaurant || cuisineItem.location || 'Local Restaurant',
            image: cuisineItem.image || `https://images.unsplash.com/photo-${getRandomImageId()}?w=400&h=250&fit=crop`,
            isAI: true
          };
        }
      });
    }

    // Generic fallback cuisine recommendations
    return [
      { 
        dish: "Local Specialty", 
        description: "Traditional dish representing the regional flavors and cooking techniques", 
        restaurant: "Heritage Restaurant", 
        image: "https://images.unsplash.com/photo-1574653853027-5b0ab6b1b5b9?w=400&h=250&fit=crop" 
      },
      { 
        dish: "Street Food Delight", 
        description: "Popular local street food that captures the essence of the area", 
        restaurant: "Street Food Markets", 
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=250&fit=crop" 
      },
      { 
        dish: "Regional Curry", 
        description: "Signature curry dish with local spices and ingredients", 
        restaurant: "Traditional Restaurant", 
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop" 
      },
      { 
        dish: "Local Sweet", 
        description: "Traditional dessert unique to this region", 
        restaurant: "Local Sweet Shop", 
        image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=250&fit=crop" 
      },
      { 
        dish: "Refreshing Drink", 
        description: "Traditional beverage perfect for the local climate", 
        restaurant: "Local Cafes", 
        image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=250&fit=crop" 
      }
    ];
  };

  // Helper function to get random image IDs for fallback images
  const getRandomImageId = () => {
    const imageIds = [
      '1574653853027-5b0ab6b1b5b9',
      '1601050690597-df0568f70950', 
      '1565299624946-b28f40a0ca4b',
      '1571115764595-644a1f56a55c',
      '1544145945-f90425340c7e',
      '1596797038530-2c107229654b',
      '1588166524941-3bf61a9c41db'
    ];
    return imageIds[Math.floor(Math.random() * imageIds.length)];
  };

  // Get cuisine recommendations for the destination
  const localCuisineRecommendations = generateLocalCuisine();

  const packingList = geminiData.tripDetails?.packingList || [
    "🧳 Comfortable walking shoes",
    "👕 Light, breathable clothing", 
    "🧥 Light jacket for evenings",
    "🕶️ Sunglasses and sunscreen",
    "📱 Portable phone charger",
    "💊 Basic medications",
    "📷 Camera for memories",
    "💰 Local currency and cards",
    "📄 Travel documents",
    "🎒 Day backpack"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Content Loading Overlay */}
      {isContentLoading && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="relative mb-6">
              <div className="w-24 h-24 mx-auto">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping"></div>
                <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Preparing Your Trip</h3>
            <p className="text-gray-600 mb-4">
              We're gathering the latest information about {destination} to create your perfect itinerary.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span>Loading content...</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        {/* Left Sidebar - Navigation Menu (1/4 width) */}
        <div className="w-1/4 sticky top-20 h-fit">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Plan</h3>
            
            <nav className="space-y-2">
              {[
                { id: 'destination-image', label: 'Your Imagination', icon: '✨' },
                { id: 'about', label: 'About the Place', icon: '📍' },
                { id: 'activities', label: 'Top Activities', icon: '🎯' },
                { id: 'weather', label: 'Weather', icon: '🌤️' },
                { id: 'places', label: 'Places to Visit', icon: '🗺️' },
                { id: 'cuisine', label: 'Local Cuisine', icon: '🍽️' },
                { id: 'itinerary', label: 'Day Itinerary', icon: '📅' },
                { id: 'packing', label: 'Packing Checklist', icon: '🧳' },
                { id: 'best-time', label: 'Best Time to Visit', icon: '🗓️' },
                { id: 'testimonials', label: 'Shared Experiences', icon: '⭐' },
                { id: 'feedback', label: 'Share Feedback', icon: '💬' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    const element = document.getElementById(item.id);
                    if (element) {
                      // Calculate offset to account for navbar height (64px) plus some padding (16px)
                      const navbarHeight = 64 + 16; // 64px navbar + 16px padding
                      const elementPosition = element.offsetTop - navbarHeight;
                      
                      window.scrollTo({
                        top: elementPosition,
                        behavior: 'smooth'
                      });
                      
                      // Update active section
                      setActiveSection(item.id);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors duration-200 group ${
                    activeSection === item.id 
                      ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-600' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-medium group-hover:font-semibold">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Right Main Content Area (3/4 width) */}
        <div className="w-3/4 space-y-8">
          {/* Date Range and Destination Image Section */}
          <div id="destination-image" className="space-y-6">
            {/* Date Range Display */}
            <div className="flex justify-start">
              <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-lg">{tripDateRange}</span>
                </div>
              </div>
            </div>

            {/* Destination Image with Overlay */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {imageLoading ? (
                <div className="w-full h-80 md:h-96 lg:h-[450px] bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 text-gray-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading destination image...</p>
                  </div>
                </div>
              ) : (
                <>
                  <img 
                    src={destinationImage} 
                    alt={`Beautiful view of ${destination}`}
                    className="w-full h-80 md:h-96 lg:h-[450px] object-cover"
                    onError={(e) => {
                      e.currentTarget.src = getDefaultDestinationImage();
                    }}
                  />
                  {/* Dark overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Destination name overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-3">
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">
                        {destination}
                      </h2>
                      {foundDestination && (
                        <span className="text-4xl md:text-5xl drop-shadow-lg">
                          {foundDestination.flag}
                        </span>
                      )}
                    </div>
                    {foundDestination && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-white/90 text-lg font-medium">
                          {foundDestination.country}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-white/90 font-semibold">
                            {foundDestination.rating}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* About the Place - Simple Description */}
          <Card id="about" className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                About {destination}
                {foundDestination && (
                  <span className="text-xl ml-2">{foundDestination.flag}</span>
                )}
                {geminiData.isLoading && (
                  <LoadingSpinner size="sm" />
                )}
                {/* AI Badge hidden as requested */}
                {geminiData.destinationInfo && !geminiData.isLoading && (
                  // <AIBadge label="AI Enhanced" />
                  null
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AIContentWrapper
                isLoading={geminiData.isLoading}
                isAI={!!geminiData.destinationInfo}
                loadingText="Generating destination insights..."
                badgePosition="top-right"
              >
                <p className="text-gray-700 leading-relaxed text-lg">
                  {cityDescription}
                </p>
              </AIContentWrapper>
              {geminiData.error && (
                <div className="mt-4">
                  <ErrorFallback 
                    error={geminiData.error}
                    onRetry={() => window.location.reload()}
                    title="AI Content Generation Failed"
                    description="Using enhanced fallback information for this destination."
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Activities */}
          <Card id="activities" className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-600" />
                Top Activities in {destination}
                {geminiData.isLoading && (
                  <LoadingSpinner size="sm" />
                )}
                {/* Note: Activities are generated from destination info rather than separate property */}
                {/* AI Badge hidden as requested */}
                {geminiData.destinationInfo && !geminiData.isLoading && (
                  // <AIBadge label="AI Enhanced" />
                  null
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AIContentWrapper
                isLoading={geminiData.isLoading}
                isAI={!!geminiData.destinationInfo}
                loadingText="Discovering top activities..."
                badgePosition="top-right"
              >
                <div className="space-y-2">
                  {/* Use fallback activities - AI activities would come from destinationInfo */}
                  {topActivities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 relative">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 flex-1">{activity}</span>
                      {/* AI badge when destination info is available - Hidden as requested */}
                      {geminiData.destinationInfo && (
                        // <AIBadge size="sm" className="absolute -top-1 -right-1" />
                        null
                      )}
                    </div>
                  ))}
                </div>
              </AIContentWrapper>
              {geminiData.error && (
                <div className="mt-4">
                  <ErrorFallback 
                    error={geminiData.error}
                    onRetry={() => window.location.reload()}
                    title="AI Activity Recommendations Failed"
                    description="Using popular activities database for this destination."
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weather with AI Integration */}
          <Card id="weather" className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-yellow-500" />
                Weather Information
                {geminiData.isLoading && (
                  <LoadingSpinner size="sm" />
                )}
                {/* AI Badge hidden as requested */}
                {geminiData.weatherAdvice && !geminiData.isLoading && (
                  // <AIBadge label="AI Enhanced" />
                  null
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Weather Widget */}
                <WeatherWidget destination={destination} showHeader={false} />
                
                {/* AI Weather Advice */}
                <AIContentWrapper
                  isLoading={geminiData.isLoading}
                  isAI={!!geminiData.weatherAdvice}
                  loadingText="Generating weather advice..."
                  badgePosition="top-right"
                >
                  {geminiData.weatherAdvice && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Sparkles className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-blue-900 mb-2">AI Weather Recommendations</h4>
                          <p className="text-blue-800 text-sm leading-relaxed">
                            {geminiData.weatherAdvice}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </AIContentWrapper>
                {geminiData.error && (
                  <div className="mt-4">
                    <ErrorFallback 
                      error={geminiData.error}
                      onRetry={() => window.location.reload()}
                      title="AI Weather Advice Failed"
                      description="Weather widget is still available above."
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Places & Hotels Content Switcher */}
          <Card id="places" className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Explore {destination}
                {(geminiData.isLoading || loadingHotelsRestaurants) && (
                  <LoadingSpinner size="sm" />
                )}
              </CardTitle>
              
              {/* Content Toggle Buttons */}
              <div className="flex gap-2 mt-4">
                <Button
                  variant={activeContentTab === 'places' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleContentTabSwitch('places')}
                  className="flex items-center gap-2"
                >
                  🏞️ Top Places
                </Button>
                <Button
                  variant={activeContentTab === 'hotels' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleContentTabSwitch('hotels')}
                  className="flex items-center gap-2"
                >
                  🏨 Hotels & Restaurants
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {activeContentTab === 'places' ? (
                /* Places Tab Content */
                <AIContentWrapper
                  isLoading={geminiData.isLoading}
                  isAI={!!(geminiData.placesDetails && geminiData.placesDetails.length > 0)}
                  loadingText="Discovering amazing places..."
                  badgePosition="top-right"
                >
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Left Side - Places List */}
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-700">
                          Top Places in {destination} ({selectedPlaces.length})
                        </h4>
                        {selectedPlaces.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                            <p>No places available for this destination</p>
                            <p className="text-sm">Search and add custom places to see them on the map</p>
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            {selectedPlaces.map((place, index) => (
                              <div 
                                key={place.id} 
                                className={`border rounded-lg transition-all ${
                                  selectedPlace?.id === place.id 
                                    ? 'bg-green-50 border-green-200 shadow-sm' 
                                    : 'bg-white border-gray-200 hover:bg-gray-50'
                                }`}
                              >
                                {/* Main Place Card */}
                                <div 
                                  className="flex items-center gap-3 p-3 cursor-pointer"
                                  onClick={() => handlePlaceClick(place)}
                                >
                                  {/* Sequential Number */}
                                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                                    {index + 1}
                                  </div>
                                  
                                  {/* Place Info */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <h5 className="font-medium text-gray-900 truncate">{place.name}</h5>
                                    </div>
                                    <p className="text-sm text-gray-600 truncate">{place.description}</p>
                                    <Badge variant="outline" className="text-xs mt-1">
                                      {place.category}
                                    </Badge>
                                  </div>
                                  
                                  {/* Action Buttons */}
                                  <div className="flex items-center gap-1">
                                    {/* Expand/Collapse Button for AI places */}
                                    {place.aiData && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setExpandedPlaceId(expandedPlaceId === place.id ? null : place.id);
                                        }}
                                        className="flex-shrink-0 h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                      >
                                        {expandedPlaceId === place.id ? (
                                          <ChevronUp className="h-4 w-4" />
                                        ) : (
                                          <ChevronDown className="h-4 w-4" />
                                        )}
                                      </Button>
                                    )}
                                    
                                    {/* Delete Button */}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removePlace(place.id);
                                      }}
                                      className="flex-shrink-0 h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>

                                {/* AI Details Expansion */}
                                {place.aiData && expandedPlaceId === place.id && (
                                  <div className="px-3 pb-3 border-t border-gray-100 bg-blue-50/30">
                                    <div className="pt-3 space-y-3 text-sm">
                                      {/* Highlights */}
                                      {place.aiData.highlights && place.aiData.highlights.length > 0 && (
                                        <div>
                                          <div className="flex items-center gap-2 mb-2">
                                            <Star className="h-4 w-4 text-yellow-500" />
                                            <span className="font-medium text-gray-700">Highlights</span>
                                          </div>
                                          <ul className="list-disc list-inside space-y-1 ml-6 text-gray-600">
                                            {place.aiData.highlights.slice(0, 3).map((highlight, idx) => (
                                              <li key={idx} className="text-xs">{highlight}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}

                                      {/* Quick Info Grid */}
                                      <div className="grid grid-cols-2 gap-3">
                                        {/* Entry Fee */}
                                        {place.aiData.entryFee && (
                                          <div className="flex items-center gap-2">
                                            <IndianRupee className="h-3 w-3 text-green-600" />
                                            <span className="text-xs text-gray-600">
                                              <span className="font-medium">Fee:</span> {place.aiData.entryFee}
                                            </span>
                                          </div>
                                        )}

                                        {/* Duration */}
                                        {place.aiData.duration && (
                                          <div className="flex items-center gap-2">
                                            <Timer className="h-3 w-3 text-blue-600" />
                                            <span className="text-xs text-gray-600">
                                              <span className="font-medium">Duration:</span> {place.aiData.duration}
                                            </span>
                                          </div>
                                        )}
                                      </div>

                                      {/* Best Time to Visit */}
                                      {place.aiData.bestTimeToVisit && (
                                        <div className="flex items-center gap-2">
                                          <Calendar className="h-3 w-3 text-purple-600" />
                                          <span className="text-xs text-gray-600">
                                            <span className="font-medium">Best Time:</span> {place.aiData.bestTimeToVisit}
                                          </span>
                                        </div>
                                      )}

                                      {/* Local Tips */}
                                      {place.aiData.localTips && place.aiData.localTips.length > 0 && (
                                        <div>
                                          <div className="flex items-center gap-2 mb-1">
                                            <Info className="h-4 w-4 text-orange-500" />
                                            <span className="font-medium text-gray-700">Pro Tips</span>
                                          </div>
                                          <div className="ml-6 text-xs text-gray-600">
                                            {place.aiData.localTips[0]}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Quick Add More Places */}
                      {enhancedPlaces.length > selectedPlaces.length && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-700">Add More Places</h4>
                          <div className="flex flex-wrap gap-2">
                            {enhancedPlaces
                              .filter(place => {
                                const isSelectedById = selectedPlaces.some(selected => selected.id === place.id);
                                const isSelectedByName = selectedPlaces.some(selected => 
                                  selected.name.toLowerCase().trim() === place.name.toLowerCase().trim()
                                );
                                return !isSelectedById && !isSelectedByName;
                              })
                              .slice(0, 6)
                              .map((place) => (
                              <Button
                                key={place.id}
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                  try {
                                    await addPlace(place.name);
                                  } catch (error) {
                                    console.error('Failed to add place:', error);
                                    toast.error('Failed to add place. Please try again.');
                                  }
                                }}
                                className="text-xs"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                {place.name}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Side - Interactive Map */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-800">Places Map</h3>
                      <div className="bg-gray-100 rounded-lg overflow-hidden">
                        <PlacesMap
                          destination={destination}
                          center={destinationCoordinates || { lat: 28.6139, lng: 77.2090 }}
                          className="w-full h-96 rounded-lg"
                          selectedPlaces={selectedPlaces}
                          selectedPlace={selectedPlace}
                          onPlaceClick={handlePlaceClick}
                        />
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>• Click on places in the list to zoom to their location</p>
                        <p>• Click on map markers to see place details</p>
                        <p>• Use map controls to switch between Map/Satellite view</p>
                      </div>
                    </div>
                  </div>
                </AIContentWrapper>
              ) : (
                /* Hotels & Restaurants Tab Content */
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Left Side - Hotels & Restaurants List */}
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-700">
                        Hotels & Restaurants in {destination} ({hotelsAndRestaurants.length})
                      </h4>
                      {loadingHotelsRestaurants ? (
                        <div className="text-center py-8">
                          <Loader2 className="h-8 w-8 mx-auto mb-3 animate-spin text-blue-600" />
                          <p className="text-gray-600">Finding hotels and restaurants...</p>
                        </div>
                      ) : hotelsAndRestaurants.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Hotel className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                          <p>No hotels or restaurants found for this destination</p>
                          <p className="text-sm">Try searching for nearby accommodations and dining options</p>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {hotelsAndRestaurants.map((place, index) => (
                            <div 
                              key={place.id} 
                              className={`border rounded-lg transition-all ${
                                selectedHotelRestaurant?.id === place.id 
                                  ? 'bg-blue-50 border-blue-200 shadow-sm' 
                                  : 'bg-white border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              <div 
                                className="flex items-center gap-3 p-3 cursor-pointer"
                                onClick={() => handleHotelRestaurantClick(place)}
                              >
                                {/* Sequential Number */}
                                <div className={`flex-shrink-0 w-8 h-8 text-white rounded-full flex items-center justify-center font-semibold text-sm ${
                                  place.category === 'Accommodation' ? 'bg-blue-600' : 'bg-orange-600'
                                }`}>
                                  {index + 1}
                                </div>
                                
                                {/* Place Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h5 className="font-medium text-gray-900 truncate">{place.name}</h5>
                                    <span className="text-xs text-gray-500">
                                      {place.category === 'Accommodation' ? '🏨' : '🍽️'}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 truncate">{place.description}</p>
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs mt-1 ${
                                      place.category === 'Accommodation' 
                                        ? 'border-blue-200 text-blue-700' 
                                        : 'border-orange-200 text-orange-700'
                                    }`}
                                  >
                                    {place.category}
                                  </Badge>
                                </div>
                                
                                {/* Rating Info */}
                                {place.aiData?.highlights && place.aiData.highlights.length > 0 && (
                                  <div className="text-xs text-gray-500">
                                    {place.aiData.highlights[0]}
                                  </div>
                                )}
                              </div>

                              {/* Expanded Details */}
                              {selectedHotelRestaurant?.id === place.id && place.aiData && (
                                <div className="px-3 pb-3 border-t border-gray-100 bg-blue-50/30">
                                  <div className="pt-3 space-y-2 text-sm">
                                    {/* Address/Contact */}
                                    {place.aiData.localTips && place.aiData.localTips.length > 0 && (
                                      <div className="flex items-center gap-2">
                                        <MapPin className="h-3 w-3 text-gray-600" />
                                        <span className="text-xs text-gray-600">{place.aiData.localTips[0]}</span>
                                      </div>
                                    )}
                                    
                                    {/* Pricing & Hours */}
                                    <div className="grid grid-cols-2 gap-3">
                                      {place.aiData.entryFee && (
                                        <div className="flex items-center gap-2">
                                          <IndianRupee className="h-3 w-3 text-green-600" />
                                          <span className="text-xs text-gray-600">{place.aiData.entryFee}</span>
                                        </div>
                                      )}
                                      {place.aiData.bestTimeToVisit && (
                                        <div className="flex items-center gap-2">
                                          <Clock className="h-3 w-3 text-blue-600" />
                                          <span className="text-xs text-gray-600">{place.aiData.bestTimeToVisit}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side - Hotels & Restaurants Map */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800">Hotels & Restaurants Map</h3>
                    <div className="bg-gray-100 rounded-lg overflow-hidden">
                      <PlacesMap
                        destination={destination}
                        center={destinationCoordinates || { lat: 28.6139, lng: 77.2090 }}
                        className="w-full h-96 rounded-lg"
                        selectedPlaces={hotelsAndRestaurants}
                        selectedPlace={selectedHotelRestaurant}
                        onPlaceClick={handleHotelRestaurantClick}
                      />
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>• Click on items in the list to zoom to their location</p>
                      <p>• 🏨 Blue markers = Hotels, 🍽️ Orange markers = Restaurants</p>
                      <p>• Use map controls to switch between Map/Satellite view</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Handling */}
              {geminiData.error && activeContentTab === 'places' && (
                <div className="mt-4">
                  <ErrorFallback 
                    error={geminiData.error}
                    onRetry={() => window.location.reload()}
                    title="AI Places Enhancement Failed"
                    description="Using local places database for this destination."
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Local Cuisine Recommendations */}
          <Card id="cuisine" className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-red-600" />
                Local Cuisine Recommendations
                {geminiData.isLoading && (
                  <LoadingSpinner size="sm" />
                )}
                {/* AI Badge hidden as requested */}
                {(geminiData.tripDetails?.localCuisine || (geminiData.cuisineRecommendations && geminiData.cuisineRecommendations.length > 0)) && !geminiData.isLoading && (
                  // <AIBadge label="AI Enhanced" />
                  null
                )}
              </CardTitle>
            </CardHeader>
          <CardContent>
            <AIContentWrapper
              isLoading={geminiData.isLoading}
              isAI={!!(geminiData.tripDetails?.localCuisine || (geminiData.cuisineRecommendations && geminiData.cuisineRecommendations.length > 0))}
              loadingText="Discovering local cuisine..."
              badgePosition="top-right"
            >
              <div className="space-y-2">
                {localCuisineRecommendations.slice(0, 6).map((cuisine, index) => (
                  <div key={index} className="flex items-center gap-3 p-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{cuisine.dish}</span>
                  </div>
                ))}
              </div>
            </AIContentWrapper>
            {geminiData.error && (
              <div className="mt-4">
                <ErrorFallback 
                  error={geminiData.error}
                  onRetry={() => window.location.reload()}
                  title="AI Cuisine Recommendations Failed"
                  description="Using local cuisine database for this destination."
                />
              </div>
            )}
          </CardContent>
        </Card>

          {/* Day Itinerary */}
          <Card id="itinerary" className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                {days}-Day Itinerary
                {geminiData.isLoading && (
                  <LoadingSpinner size="sm" />
                )}
                {/* AI Badge hidden as requested */}
                {(geminiData.tripDetails?.detailedItinerary || (geminiData.itinerary && geminiData.itinerary.length > 0)) && !geminiData.isLoading && (
                  // <AIBadge label="AI Generated" />
                  null
                )}
              </CardTitle>
            </CardHeader>
          <CardContent>
            {geminiData.isLoading ? (
              <AIContentWrapper
                isLoading={true}
                loadingText="Creating personalized itinerary..."
                className="py-12"
                isAI={false}
              >
                <div></div>
              </AIContentWrapper>
            ) : (
              <div className="space-y-4">
                {generateItinerary().map((day, dayIndex) => {
                  const isExpanded = expandedDays.has(day.day);
                  return (
                    <div key={day.day} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                      {/* Day Header - Always Visible */}
                      <div 
                        className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-colors duration-200"
                        onClick={() => toggleDayExpansion(day.day)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                              {day.day}
                            </span>
                            <h3 className="font-bold text-lg text-blue-700">{day.title}</h3>
                            {/* AI Badge hidden as requested */}
                            {day.isAI && day.hasAIContent && (
                              // <AIBadge size="sm" label="AI Generated" />
                              null
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              {isExpanded ? 'Hide Details' : 'Show Details'}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                        </div>
                        
                        {/* Quick Preview - Visible when collapsed */}
                        {!isExpanded && (
                          <div className="mt-2 text-sm text-gray-600">
                            <p className="line-clamp-2">
                              {day.morning.substring(0, 120)}...
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Expandable Content */}
                      {isExpanded && (
                        <div className="p-4 space-y-4 bg-white">
                          {/* Morning Section */}
                          <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400">
                            <div className="flex items-center gap-2 mb-3">
                              <Sunrise className="h-5 w-5 text-yellow-600" />
                              <h4 className="font-semibold text-gray-800">Morning (9:00 AM - 12:00 PM)</h4>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{day.morning}</p>
                          </div>

                          {/* Afternoon Section */}
                          <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-400">
                            <div className="flex items-center gap-2 mb-3">
                              <Sun className="h-5 w-5 text-orange-600" />
                              <h4 className="font-semibold text-gray-800">Afternoon (1:00 PM - 5:00 PM)</h4>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{day.afternoon}</p>
                          </div>

                          {/* Evening Section - Only show if evening activities exist */}
                          {day.evening && (
                          <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400">
                            <div className="flex items-center gap-2 mb-3">
                              <Sunset className="h-5 w-5 text-purple-600" />
                              <h4 className="font-semibold text-gray-800">Evening (6:00 PM - 9:00 PM)</h4>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{day.evening}</p>
                          </div>
                          )}

                          {/* Optional: Add tips or notes if AI content is available */}
                          {day.isAI && day.hasAIContent && (
                            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                              <div className="flex items-center gap-2 mb-2">
                                <Info className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-800">AI Travel Tips</span>
                              </div>
                              <p className="text-sm text-blue-700">
                                This itinerary has been personalized based on your preferences for {destination}. 
                                Times are flexible and can be adjusted based on your energy levels and interests.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Expand/Collapse All Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const allDays = generateItinerary().map(d => d.day);
                      const allExpanded = allDays.every(day => expandedDays.has(day));
                      
                      if (allExpanded) {
                        setExpandedDays(new Set());
                      } else {
                        setExpandedDays(new Set(allDays));
                      }
                    }}
                    className="text-sm"
                  >
                    {generateItinerary().every(d => expandedDays.has(d.day)) ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-2" />
                        Collapse All Days
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-2" />
                        Expand All Days
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
            {geminiData.error && (
              <div className="mt-4">
                <ErrorFallback 
                  error={geminiData.error}
                  onRetry={() => window.location.reload()}
                  title="AI Itinerary Generation Failed"
                  description="Using enhanced fallback itinerary for this destination."
                />
              </div>
            )}
          </CardContent>
        </Card>

          {/* Packing Checklist */}
          <Card id="packing" className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PackageCheck className="h-5 w-5 text-teal-600" />
                Packing Checklist
                {geminiData.isLoading && (
                  <LoadingSpinner size="sm" />
                )}
                {/* AI Badge hidden as requested */}
                {geminiData.tripDetails?.packingList && !geminiData.isLoading && (
                  // <AIBadge label="AI Enhanced" />
                  null
                )}
              </CardTitle>
            </CardHeader>
          <CardContent>
            <AIContentWrapper
              isLoading={geminiData.isLoading}
              isAI={!!(geminiData.tripDetails?.packingList)}
              loadingText="Generating personalized packing list..."
              badgePosition="top-right"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                {packingList.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </AIContentWrapper>
            {geminiData.error && (
              <div className="mt-4">
                <ErrorFallback 
                  error={geminiData.error}
                  onRetry={() => window.location.reload()}
                  title="AI Packing List Generation Failed"
                  description="Using general packing recommendations."
                />
              </div>
            )}
          </CardContent>
        </Card>

          {/* Best Time to Visit */}
          <Card id="best-time" className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                Best Time to Visit
                {geminiData.isLoading && (
                  <LoadingSpinner size="sm" />
                )}
                {/* AI Badge hidden as requested */}
                {geminiData.tripDetails?.bestTimeToVisit && !geminiData.isLoading && (
                  // <AIBadge label="AI Enhanced" />
                  null
                )}
              </CardTitle>
            </CardHeader>
          <CardContent>
            <AIContentWrapper
              isLoading={geminiData.isLoading}
              isAI={!!(geminiData.tripDetails?.bestTimeToVisit)}
              loadingText="Analyzing best travel times..."
              badgePosition="top-right"
            >
              <p className="text-gray-700 leading-relaxed">
                {geminiData.tripDetails?.bestTimeToVisit || 
                  `The best time to visit ${destination} is typically during the pleasant weather months when you can fully enjoy outdoor activities and sightseeing. Consider local climate patterns, seasonal festivals, and tourist seasons when planning your trip for the optimal experience.`
                }
              </p>
            </AIContentWrapper>
            {geminiData.error && (
              <div className="mt-4">
                <ErrorFallback 
                  error={geminiData.error}
                  onRetry={() => window.location.reload()}
                  title="AI Travel Time Analysis Failed"
                  description="Using general travel time recommendations."
                />
              </div>
            )}
          </CardContent>
        </Card>

          {/* Shared Experiences */}
          <Card id="testimonials" className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Shared Experiences
                {geminiData.isLoading && (
                  <LoadingSpinner size="sm" />
                )}
                {/* AI Badge hidden as requested */}
                {geminiData.testimonials && geminiData.testimonials.length > 0 && !geminiData.isLoading && (
                  // <AIBadge label="AI Enhanced" />
                  null
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                See what fellow travelers say about their experiences in {destination}
              </p>
            {geminiData.isLoading ? (
              <AIContentWrapper
                isLoading={true}
                loadingText="Generating user testimonials..."
                className="py-12"
                isAI={false}
              >
                <div></div>
              </AIContentWrapper>
            ) : destinationTestimonials.length === 0 ? (
              // No feedback message
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg mb-2">Till now, I have no feedback about this destination.</p>
                <p className="text-gray-400 text-sm">Be the first to share your experience with {destination}!</p>
              </div>
            ) : (
              <>
                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(showAllTestimonials ? destinationTestimonials : destinationTestimonials.slice(0, 3)).map((testimonial, index) => (
                    <Card key={`${testimonial.name}-${testimonial.location}-${index}`} className="border-0 shadow-md bg-gray-50 relative">
                      <CardContent className="pt-6">
                        {/* AI Badge for AI-generated testimonials - Hidden as requested */}
                        {testimonial.isAI && (
                          <div className="absolute top-2 right-2">
                            {/* <AIBadge size="sm" label="AI" /> */}
                          </div>
                        )}
                        
                        <div className="flex mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={`${testimonial.name}-${testimonial.location}-${index}-star-${i}`} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                          {testimonial.isReal && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-4 italic text-sm">"{testimonial.text}"</p>
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3 text-sm">
                            {testimonial.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{testimonial.name}</div>
                            <div className="text-xs text-gray-500">{testimonial.location}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Show More/Less Button */}
                {destinationTestimonials.length > 3 && (
                  <div className="text-center mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowAllTestimonials(!showAllTestimonials)}
                      className="px-6"
                    >
                      {showAllTestimonials ? (
                        <>
                          Show Less
                          <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                          </svg>
                        </>
                      ) : (
                        <>
                          More... ({destinationTestimonials.length - 3} more)
                          <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

          {/* Feedback Form */}
          <Card id="feedback" className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Share Your Experiences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Help us improve your travel planning experience by sharing your thoughts about {destination} or our platform.
              </p>
              
              {/* Reward Points Information */}
              {tripPlanId && user && (
                <div className={`border rounded-lg p-4 mb-6 ${
                  isPremiumUser
                    ? "bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200"
                    : hasBeenRewarded 
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200" 
                      : "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
                }`}>
                  <div className={`flex items-center gap-2 ${
                    isPremiumUser
                      ? "text-purple-800"
                      : hasBeenRewarded ? "text-green-800" : "text-yellow-800"
                  }`}>
                    <span className="text-lg">
                      {isPremiumUser ? "👑" : hasBeenRewarded ? "✅" : "🎁"}
                    </span>
                    <span className="font-medium">
                      {isPremiumUser 
                        ? "Premium Subscriber" 
                        : hasBeenRewarded ? "Reward Points Earned!" : "Earn Reward Points!"
                      }
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${
                    isPremiumUser
                      ? "text-purple-700"
                      : hasBeenRewarded ? "text-green-700" : "text-yellow-700"
                  }`}>
                    {isPremiumUser
                      ? "As a premium subscriber, you already enjoy unlimited trip generations! Reward points are not available for premium users."
                      : hasBeenRewarded 
                        ? "You have already submitted feedback for this trip plan and received your 100 reward points!"
                        : "Submit feedback for this trip plan and earn 100 reward points! Use points to get free credits in our Rewards page."
                    }
                  </p>
                </div>
              )}
              
            <form onSubmit={handleFeedbackSubmit} className="space-y-6">
              {/* Hidden fields for auto-populated user data */}
              <input type="hidden" value={feedbackForm.name} />
              <input type="hidden" value={feedbackForm.email} />
              
              {/* Show user info if available */}
              {user && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Submitting as:</span> {feedbackForm.name} ({feedbackForm.email})
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="feedback-from-where" className="text-sm font-medium text-gray-700">
                    From Where <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="feedback-from-where"
                    type="text"
                    placeholder="e.g., Mumbai, India"
                    value={feedbackForm.fromWhere}
                    onChange={(e) => handleFeedbackChange('fromWhere', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Rate Us <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleFeedbackChange('rating', star)}
                        className={`text-2xl transition-colors duration-200 hover:scale-110 transform ${
                          star <= feedbackForm.rating 
                            ? 'text-yellow-400' 
                            : 'text-gray-300 hover:text-yellow-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {feedbackForm.rating > 0 
                        ? `${feedbackForm.rating} star${feedbackForm.rating > 1 ? 's' : ''}`
                        : 'Click to rate'
                      }
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="feedback-comments" className="text-sm font-medium text-gray-700">
                  Feedback/Comments <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="feedback-comments"
                  placeholder="Share your thoughts about your trip planning experience, destination insights, or suggestions for improvement..."
                  value={feedbackForm.comments}
                  onChange={(e) => handleFeedbackChange('comments', e.target.value)}
                  className="mt-1 min-h-[100px]"
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSubmittingFeedback || !feedbackForm.comments.trim() || !feedbackForm.fromWhere.trim() || feedbackForm.rating === 0 || !user || hasBeenRewarded}
                  className={`px-6 ${
                    hasBeenRewarded 
                      ? "bg-green-600 hover:bg-green-600 cursor-not-allowed opacity-75" 
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white`}
                >
                  {isSubmittingFeedback ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : hasBeenRewarded ? (
                    <>
                      <span className="mr-2">✅</span>
                      Feedback Already Submitted
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Feedback
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default TripResults;
