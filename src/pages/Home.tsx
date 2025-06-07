import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, DollarSign, Compass, Star, Globe, Clock, Shield, Heart, CloudSun, ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
import useEmblaCarousel from 'embla-carousel-react';

const Home = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  
  // Carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'start',
      skipSnaps: false,
      dragFree: false,
    }
  );

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  // Auto-scroll functionality
  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    emblaApi.on('select', onSelect);
    
    // Auto-scroll every 4 seconds
    const autoScrollInterval = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0); // Go back to first slide
      }
    }, 4000);

    return () => {
      clearInterval(autoScrollInterval);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);
    // Handle Start Planning button click with conditional redirection
  const handleStartPlanning = () => {
    if (isSignedIn) {
      navigate('/planner');
    } else {
      navigate('/signin');
    }
  };

  // Handle Explore Destinations button click
  const handleExploreDestinations = () => {
    navigate('/destinations');
  };
  // Enhanced destinations data with images - Expanded collection of 80+ destinations
  const allDestinations = [
    // Europe
    { name: "Paris", country: "France", flag: "🇫🇷", rating: "4.8", description: "City of Light and romance", image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=600&fit=crop" },
    { name: "Rome", country: "Italy", flag: "🇮🇹", rating: "4.7", description: "Eternal City with ancient wonders", image: "https://images.unsplash.com/photo-1552832230-c0197047daf1?w=800&h=600&fit=crop" },
    { name: "London", country: "UK", flag: "🇬🇧", rating: "4.7", description: "Historic charm meets modern culture", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop" },
    { name: "Barcelona", country: "Spain", flag: "🇪🇸", rating: "4.8", description: "Gaudí's architectural masterpieces", image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop" },
    { name: "Amsterdam", country: "Netherlands", flag: "🇳🇱", rating: "4.7", description: "Canals, bikes, and historic charm", image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&h=600&fit=crop" },
    { name: "Prague", country: "Czech Republic", flag: "🇨🇿", rating: "4.8", description: "Fairy-tale city of a hundred spires", image: "https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&h=600&fit=crop" },
    { name: "Santorini", country: "Greece", flag: "🇬🇷", rating: "4.9", description: "White-washed cliffs over blue seas", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop" },
    { name: "Vienna", country: "Austria", flag: "🇦🇹", rating: "4.7", description: "Imperial palaces and coffee culture", image: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&h=600&fit=crop" },
    { name: "Florence", country: "Italy", flag: "🇮🇹", rating: "4.8", description: "Renaissance art and architecture", image: "https://images.unsplash.com/photo-1552820728-421d0acfe5f5?w=800&h=600&fit=crop" },
    { name: "Lisbon", country: "Portugal", flag: "🇵🇹", rating: "4.7", description: "Trams, tiles, and fado music", image: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&h=600&fit=crop" },
    { name: "Stockholm", country: "Sweden", flag: "🇸🇪", rating: "4.6", description: "Nordic design and archipelago", image: "https://images.unsplash.com/photo-1508189860359-777d945909ef?w=800&h=600&fit=crop" },
    { name: "Budapest", country: "Hungary", flag: "🇭🇺", rating: "4.7", description: "Thermal baths and grand architecture", image: "https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&h=600&fit=crop" },
    { name: "Edinburgh", country: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", rating: "4.6", description: "Medieval castle and Scottish culture", image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop" },
    { name: "Berlin", country: "Germany", flag: "🇩🇪", rating: "4.5", description: "History, art, and vibrant nightlife", image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=600&fit=crop" },
    { name: "Venice", country: "Italy", flag: "🇮🇹", rating: "4.6", description: "Floating city of canals and gondolas", image: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=800&h=600&fit=crop" },
    { name: "Dubrovnik", country: "Croatia", flag: "🇭🇷", rating: "4.7", description: "Pearl of the Adriatic", image: "https://images.unsplash.com/photo-1555990538-c4d5d241f45c?w=800&h=600&fit=crop" },

    // Asia
    { name: "Tokyo", country: "Japan", flag: "🇯🇵", rating: "4.9", description: "Modern metropolis meets tradition", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop" },
    { name: "Kyoto", country: "Japan", flag: "🇯🇵", rating: "4.8", description: "Ancient temples and bamboo forests", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop" },
    { name: "Bali", country: "Indonesia", flag: "🇮🇩", rating: "4.8", description: "Tropical paradise with temples", image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop" },
    { name: "Bangkok", country: "Thailand", flag: "🇹🇭", rating: "4.5", description: "Street food and golden temples", image: "https://images.unsplash.com/photo-1563492065-4dec4c534c13?w=800&h=600&fit=crop" },
    { name: "Singapore", country: "Singapore", flag: "🇸🇬", rating: "4.8", description: "Garden city of the future", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=600&fit=crop" },
    { name: "Seoul", country: "South Korea", flag: "🇰🇷", rating: "4.6", description: "K-culture and cutting-edge tech", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop" },
    { name: "Hong Kong", country: "Hong Kong", flag: "🇭🇰", rating: "4.6", description: "Skyscrapers and dim sum", image: "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=800&h=600&fit=crop" },
    { name: "Mumbai", country: "India", flag: "🇮🇳", rating: "4.4", description: "Bollywood and bustling markets", image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop" },
    { name: "Delhi", country: "India", flag: "🇮🇳", rating: "4.3", description: "Mughal heritage and modern India", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=600&fit=crop" },
    { name: "Agra", country: "India", flag: "🇮🇳", rating: "4.7", description: "Home to the magnificent Taj Mahal", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop" },
    { name: "Kathmandu", country: "Nepal", flag: "🇳🇵", rating: "4.4", description: "Gateway to the Himalayas", image: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&h=600&fit=crop" },
    { name: "Beijing", country: "China", flag: "🇨🇳", rating: "4.5", description: "Ancient capital with modern marvels", image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&h=600&fit=crop" },
    { name: "Shanghai", country: "China", flag: "🇨🇳", rating: "4.6", description: "Futuristic skyline and historic charm", image: "https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=800&h=600&fit=crop" },
    { name: "Hanoi", country: "Vietnam", flag: "🇻🇳", rating: "4.4", description: "Street food and French colonial charm", image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&h=600&fit=crop" },
    { name: "Ho Chi Minh City", country: "Vietnam", flag: "🇻🇳", rating: "4.3", description: "Bustling metropolis with rich history", image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=600&fit=crop" },
    { name: "Siem Reap", country: "Cambodia", flag: "🇰🇭", rating: "4.6", description: "Gateway to Angkor Wat temples", image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop" },

    // Middle East & Turkey
    { name: "Dubai", country: "UAE", flag: "🇦🇪", rating: "4.7", description: "Luxury and innovation in the desert", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop" },
    { name: "Istanbul", country: "Turkey", flag: "🇹🇷", rating: "4.6", description: "Where Europe meets Asia", image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&h=600&fit=crop" },
    { name: "Jerusalem", country: "Israel", flag: "🇮🇱", rating: "4.5", description: "Sacred city of three religions", image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=800&h=600&fit=crop" },
    { name: "Petra", country: "Jordan", flag: "🇯🇴", rating: "4.8", description: "Rose-red city carved in stone", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Doha", country: "Qatar", flag: "🇶🇦", rating: "4.4", description: "Modern oasis in the Arabian Gulf", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },

    // Africa
    { name: "Cape Town", country: "South Africa", flag: "🇿🇦", rating: "4.7", description: "Table Mountain and wine country", image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&h=600&fit=crop" },
    { name: "Cairo", country: "Egypt", flag: "🇪🇬", rating: "4.5", description: "Pyramids and ancient mysteries", image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73100?w=800&h=600&fit=crop" },
    { name: "Marrakech", country: "Morocco", flag: "🇲🇦", rating: "4.6", description: "Red city of souks and riads", image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73100?w=800&h=600&fit=crop" },
    { name: "Casablanca", country: "Morocco", flag: "🇲🇦", rating: "4.3", description: "Modern Morocco meets tradition", image: "https://images.unsplash.com/photo-1558642891-54be180ea339?w=800&h=600&fit=crop" },
    { name: "Luxor", country: "Egypt", flag: "🇪🇬", rating: "4.6", description: "Valley of the Kings and Queens", image: "https://images.unsplash.com/photo-1598646506291-0c3014b1db23?w=800&h=600&fit=crop" },
    { name: "Zanzibar", country: "Tanzania", flag: "🇹🇿", rating: "4.5", description: "Spice island paradise", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },

    // Americas
    { name: "New York", country: "USA", flag: "🇺🇸", rating: "4.6", description: "The city that never sleeps", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop" },
    { name: "Los Angeles", country: "USA", flag: "🇺🇸", rating: "4.4", description: "Hollywood glamour and beaches", image: "https://images.unsplash.com/photo-1534190239940-9ba8944ea261?w=800&h=600&fit=crop" },
    { name: "San Francisco", country: "USA", flag: "🇺🇸", rating: "4.5", description: "Golden Gate and tech innovation", image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop" },
    { name: "Las Vegas", country: "USA", flag: "🇺🇸", rating: "4.3", description: "Entertainment capital of the world", image: "https://images.unsplash.com/photo-1605833556294-ea5c7a74f57a?w=800&h=600&fit=crop" },
    { name: "Chicago", country: "USA", flag: "🇺🇸", rating: "4.4", description: "Architecture and deep-dish pizza", image: "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=800&h=600&fit=crop" },
    { name: "Vancouver", country: "Canada", flag: "🇨🇦", rating: "4.7", description: "Mountains meet ocean", image: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&h=600&fit=crop" },
    { name: "Toronto", country: "Canada", flag: "🇨🇦", rating: "4.5", description: "Multicultural metropolis", image: "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=800&h=600&fit=crop" },
    { name: "Montreal", country: "Canada", flag: "🇨🇦", rating: "4.6", description: "European charm in North America", image: "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=800&h=600&fit=crop" },
    { name: "Mexico City", country: "Mexico", flag: "🇲🇽", rating: "4.4", description: "Aztec heritage and vibrant culture", image: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&h=600&fit=crop" },
    { name: "Cancún", country: "Mexico", flag: "🇲🇽", rating: "4.5", description: "Caribbean beaches and Mayan ruins", image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop" },
    { name: "Rio de Janeiro", country: "Brazil", flag: "🇧🇷", rating: "4.6", description: "Carnival capital with stunning beaches", image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&h=600&fit=crop" },
    { name: "São Paulo", country: "Brazil", flag: "🇧🇷", rating: "4.3", description: "Cultural and culinary powerhouse", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Buenos Aires", country: "Argentina", flag: "🇦🇷", rating: "4.5", description: "Tango capital and European elegance", image: "https://images.unsplash.com/photo-1512488716506-8ad0db11b6d5?w=800&h=600&fit=crop" },
    { name: "Lima", country: "Peru", flag: "🇵🇪", rating: "4.4", description: "Culinary capital of South America", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Machu Picchu", country: "Peru", flag: "🇵🇪", rating: "4.8", description: "Lost city of the Incas", image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&h=600&fit=crop" },
    { name: "Cusco", country: "Peru", flag: "🇵🇪", rating: "4.6", description: "Gateway to ancient Inca empire", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Cartagena", country: "Colombia", flag: "🇨🇴", rating: "4.5", description: "Colonial charm on Caribbean coast", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Havana", country: "Cuba", flag: "🇨🇺", rating: "4.4", description: "Vintage cars and salsa rhythms", image: "https://images.unsplash.com/photo-1546552299-20c1b5c2ad3e?w=800&h=600&fit=crop" },

    // Oceania
    { name: "Sydney", country: "Australia", flag: "🇦🇺", rating: "4.7", description: "Iconic harbor and beaches", image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop" },
    { name: "Melbourne", country: "Australia", flag: "🇦🇺", rating: "4.6", description: "Coffee culture and street art", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Auckland", country: "New Zealand", flag: "🇳🇿", rating: "4.5", description: "City of sails and volcanoes", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop" },
    { name: "Queenstown", country: "New Zealand", flag: "🇳🇿", rating: "4.7", description: "Adventure capital of the world", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Perth", country: "Australia", flag: "🇦🇺", rating: "4.4", description: "Sun, sand, and swan river", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },

    // Island Destinations
    { name: "Maldives", country: "Maldives", flag: "🇲🇻", rating: "4.9", description: "Overwater paradise", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop" },
    { name: "Seychelles", country: "Seychelles", flag: "🇸🇨", rating: "4.8", description: "Pristine beaches and granite boulders", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Mauritius", country: "Mauritius", flag: "🇲🇺", rating: "4.6", description: "Tropical luxury in Indian Ocean", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Bora Bora", country: "French Polynesia", flag: "🇵🇫", rating: "4.8", description: "Pearl of the Pacific", image: "https://images.unsplash.com/photo-1514237487632-d386816d5be8?w=800&h=600&fit=crop" },
    { name: "Tahiti", country: "French Polynesia", flag: "🇵🇫", rating: "4.7", description: "Queen of the Pacific islands", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Fiji", country: "Fiji", flag: "🇫🇯", rating: "4.6", description: "Bula spirit and coral reefs", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Hawaii", country: "USA", flag: "🇺🇸", rating: "4.7", description: "Aloha spirit and volcanic wonders", image: "https://images.unsplash.com/photo-1542259009477-d625272157b7?w=800&h=600&fit=crop" },
    { name: "Mykonos", country: "Greece", flag: "🇬🇷", rating: "4.6", description: "Windmills and vibrant nightlife", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Crete", country: "Greece", flag: "🇬🇷", rating: "4.5", description: "Minoan palaces and pristine beaches", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Ibiza", country: "Spain", flag: "🇪🇸", rating: "4.4", description: "Electronic music and sunset beaches", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Mallorca", country: "Spain", flag: "🇪🇸", rating: "4.5", description: "Serra de Tramuntana mountains and coves", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },

    // Northern Europe & Scandinavia
    { name: "Reykjavik", country: "Iceland", flag: "🇮🇸", rating: "4.6", description: "Northern lights and geysers", image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73100?w=800&h=600&fit=crop" },
    { name: "Oslo", country: "Norway", flag: "🇳🇴", rating: "4.5", description: "Fjords and Viking heritage", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Bergen", country: "Norway", flag: "🇳🇴", rating: "4.6", description: "Gateway to the fjords", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Copenhagen", country: "Denmark", flag: "🇩🇰", rating: "4.6", description: "Hygge lifestyle and royal palaces", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Helsinki", country: "Finland", flag: "🇫🇮", rating: "4.4", description: "Design capital of the north", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "St. Petersburg", country: "Russia", flag: "🇷🇺", rating: "4.6", description: "Imperial grandeur and white nights", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Moscow", country: "Russia", flag: "🇷🇺", rating: "4.4", description: "Red Square and Kremlin towers", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },

    // Eastern Europe
    { name: "Krakow", country: "Poland", flag: "🇵🇱", rating: "4.7", description: "Medieval market square", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Warsaw", country: "Poland", flag: "🇵🇱", rating: "4.4", description: "Phoenix city risen from ashes", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Bucharest", country: "Romania", flag: "🇷🇴", rating: "4.3", description: "Little Paris of the East", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Sofia", country: "Bulgaria", flag: "🇧🇬", rating: "4.2", description: "Ancient crossroads of cultures", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Tallinn", country: "Estonia", flag: "🇪🇪", rating: "4.5", description: "Medieval UNESCO World Heritage", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Riga", country: "Latvia", flag: "🇱🇻", rating: "4.4", description: "Art Nouveau architectural gems", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },    { name: "Vilnius", country: "Lithuania", flag: "🇱🇹", rating: "4.5", description: "Baroque Old Town beauty", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },

    // More European Gems
    { name: "Bruges", country: "Belgium", flag: "🇧🇪", rating: "4.7", description: "Fairy-tale medieval city", image: "https://images.unsplash.com/photo-1563292103-b4e881115c79?w=800&h=600&fit=crop" },
    { name: "Brussels", country: "Belgium", flag: "🇧🇪", rating: "4.4", description: "Waffles, chocolates, and EU capital", image: "https://images.unsplash.com/photo-1559113202-c916b8e44373?w=800&h=600&fit=crop" },
    { name: "Luxembourg City", country: "Luxembourg", flag: "🇱🇺", rating: "4.5", description: "Fortified medieval town", image: "https://images.unsplash.com/photo-1551854838-48fd8da949bd?w=800&h=600&fit=crop" },
    { name: "Zurich", country: "Switzerland", flag: "🇨🇭", rating: "4.6", description: "Alpine beauty and luxury", image: "https://images.unsplash.com/photo-1544892504-5a42d285ab6f?w=800&h=600&fit=crop" },
    { name: "Geneva", country: "Switzerland", flag: "🇨🇭", rating: "4.5", description: "International diplomacy hub", image: "https://images.unsplash.com/photo-1575881875361-6cb510084447?w=800&h=600&fit=crop" },
    { name: "Salzburg", country: "Austria", flag: "🇦🇹", rating: "4.7", description: "Mozart's birthplace", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Innsbruck", country: "Austria", flag: "🇦🇹", rating: "4.6", description: "Alpine skiing paradise", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Naples", country: "Italy", flag: "🇮🇹", rating: "4.4", description: "Birthplace of pizza", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Milan", country: "Italy", flag: "🇮🇹", rating: "4.5", description: "Fashion and design capital", image: "https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=800&h=600&fit=crop" },
    { name: "Bologna", country: "Italy", flag: "🇮🇹", rating: "4.6", description: "Culinary capital of Italy", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Porto", country: "Portugal", flag: "🇵🇹", rating: "4.7", description: "Port wine and azulejo tiles", image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop" },
    { name: "Seville", country: "Spain", flag: "🇪🇸", rating: "4.6", description: "Flamenco and Moorish architecture", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Granada", country: "Spain", flag: "🇪🇸", rating: "4.7", description: "Alhambra palace marvel", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Bilbao", country: "Spain", flag: "🇪🇸", rating: "4.5", description: "Guggenheim and Basque culture", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Valencia", country: "Spain", flag: "🇪🇸", rating: "4.5", description: "City of Arts and Sciences", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Nice", country: "France", flag: "🇫🇷", rating: "4.6", description: "French Riviera elegance", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Cannes", country: "France", flag: "🇫🇷", rating: "4.5", description: "Film festival glamour", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Lyon", country: "France", flag: "🇫🇷", rating: "4.6", description: "Gastronomic capital of France", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Marseille", country: "France", flag: "🇫🇷", rating: "4.4", description: "Mediterranean port city", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Hamburg", country: "Germany", flag: "🇩🇪", rating: "4.5", description: "Harbor city with nightlife", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Munich", country: "Germany", flag: "🇩🇪", rating: "4.6", description: "Oktoberfest and Alpine charm", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Cologne", country: "Germany", flag: "🇩🇪", rating: "4.4", description: "Gothic cathedral and art scene", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Dresden", country: "Germany", flag: "🇩🇪", rating: "4.5", description: "Baroque splendor on the Elbe", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },

    // Additional Asian Destinations
    { name: "Osaka", country: "Japan", flag: "🇯🇵", rating: "4.7", description: "Kitchen of Japan", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Hiroshima", country: "Japan", flag: "🇯🇵", rating: "4.6", description: "Peace memorial and resilience", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Nara", country: "Japan", flag: "🇯🇵", rating: "4.5", description: "Ancient capital with sacred deer", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Busan", country: "South Korea", flag: "🇰🇷", rating: "4.5", description: "Coastal city with beaches", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Jeju Island", country: "South Korea", flag: "🇰🇷", rating: "4.6", description: "Volcanic island paradise", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Taipei", country: "Taiwan", flag: "🇹🇼", rating: "4.5", description: "Night markets and hot springs", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Kuala Lumpur", country: "Malaysia", flag: "🇲🇾", rating: "4.4", description: "Twin towers and street food", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Penang", country: "Malaysia", flag: "🇲🇾", rating: "4.5", description: "UNESCO heritage and cuisine", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Manila", country: "Philippines", flag: "🇵🇭", rating: "4.2", description: "Historic Intramuros district", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Cebu", country: "Philippines", flag: "🇵🇭", rating: "4.4", description: "Queen City of the South", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Palawan", country: "Philippines", flag: "🇵🇭", rating: "4.8", description: "Last frontier paradise", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Boracay", country: "Philippines", flag: "🇵🇭", rating: "4.6", description: "White beach perfection", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Langkawi", country: "Malaysia", flag: "🇲🇾", rating: "4.5", description: "Legendary island getaway", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Phuket", country: "Thailand", flag: "🇹🇭", rating: "4.5", description: "Pearl of the Andaman", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Chiang Mai", country: "Thailand", flag: "🇹🇭", rating: "4.6", description: "Rose of the North", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Krabi", country: "Thailand", flag: "🇹🇭", rating: "4.7", description: "Limestone cliffs and beaches", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Colombo", country: "Sri Lanka", flag: "🇱🇰", rating: "4.3", description: "Commercial capital by the sea", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Kandy", country: "Sri Lanka", flag: "🇱🇰", rating: "4.5", description: "Cultural capital in hills", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Galle", country: "Sri Lanka", flag: "🇱🇰", rating: "4.6", description: "Dutch colonial fort city", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },

    // More Middle East & Central Asia
    { name: "Abu Dhabi", country: "UAE", flag: "🇦🇪", rating: "4.6", description: "Capital of luxury and culture", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Sharjah", country: "UAE", flag: "🇦🇪", rating: "4.4", description: "Cultural capital of UAE", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Muscat", country: "Oman", flag: "🇴🇲", rating: "4.5", description: "Arabian Gulf hidden gem", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Kuwait City", country: "Kuwait", flag: "🇰🇼", rating: "4.2", description: "Pearl diving heritage", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Manama", country: "Bahrain", flag: "🇧🇭", rating: "4.3", description: "Pearl of the Gulf", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Riyadh", country: "Saudi Arabia", flag: "🇸🇦", rating: "4.1", description: "Modern desert metropolis", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Jeddah", country: "Saudi Arabia", flag: "🇸🇦", rating: "4.2", description: "Gateway to Mecca", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Tehran", country: "Iran", flag: "🇮🇷", rating: "4.1", description: "Persian capital in mountains", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Isfahan", country: "Iran", flag: "🇮🇷", rating: "4.6", description: "Half of the world", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Shiraz", country: "Iran", flag: "🇮🇷", rating: "4.5", description: "City of poetry and wine", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Tashkent", country: "Uzbekistan", flag: "🇺🇿", rating: "4.3", description: "Silk Road crossroads", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Samarkand", country: "Uzbekistan", flag: "🇺🇿", rating: "4.7", description: "Jewel of the Silk Road", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Bukhara", country: "Uzbekistan", flag: "🇺🇿", rating: "4.6", description: "Living museum of architecture", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Almaty", country: "Kazakhstan", flag: "🇰🇿", rating: "4.4", description: "City of apples in mountains", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Nur-Sultan", country: "Kazakhstan", flag: "🇰🇿", rating: "4.2", description: "Futuristic capital city", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },

    // More African Destinations
    { name: "Lagos", country: "Nigeria", flag: "🇳🇬", rating: "4.2", description: "Economic powerhouse of Africa", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Abuja", country: "Nigeria", flag: "🇳🇬", rating: "4.1", description: "Planned capital city", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Accra", country: "Ghana", flag: "🇬🇭", rating: "4.3", description: "Gateway to West Africa", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Nairobi", country: "Kenya", flag: "🇰🇪", rating: "4.4", description: "Safari capital of Africa", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Mombasa", country: "Kenya", flag: "🇰🇪", rating: "4.3", description: "Swahili coast culture", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Dar es Salaam", country: "Tanzania", flag: "🇹🇿", rating: "4.2", description: "Haven of peace", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Arusha", country: "Tanzania", flag: "🇹🇿", rating: "4.4", description: "Safari gateway to Serengeti", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Kigali", country: "Rwanda", flag: "🇷🇼", rating: "4.5", description: "Land of a thousand hills", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Kampala", country: "Uganda", flag: "🇺🇬", rating: "4.2", description: "Pearl of Africa capital", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Addis Ababa", country: "Ethiopia", flag: "🇪🇹", rating: "4.3", description: "Diplomatic capital of Africa", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Tunis", country: "Tunisia", flag: "🇹🇳", rating: "4.4", description: "Carthaginian heritage", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Algiers", country: "Algeria", flag: "🇩🇿", rating: "4.2", description: "White city by the sea", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },

    // More Americas
    { name: "Miami", country: "USA", flag: "🇺🇸", rating: "4.5", description: "Art Deco and beach vibes", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Orlando", country: "USA", flag: "🇺🇸", rating: "4.4", description: "Theme park capital", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Seattle", country: "USA", flag: "🇺🇸", rating: "4.5", description: "Emerald city by the sound", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Portland", country: "USA", flag: "🇺🇸", rating: "4.4", description: "Keep it weird culture", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Austin", country: "USA", flag: "🇺🇸", rating: "4.5", description: "Live music capital", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Nashville", country: "USA", flag: "🇺🇸", rating: "4.4", description: "Country music heart", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "New Orleans", country: "USA", flag: "🇺🇸", rating: "4.6", description: "Jazz birthplace and Creole culture", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Boston", country: "USA", flag: "🇺🇸", rating: "4.5", description: "Cradle of American liberty", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Philadelphia", country: "USA", flag: "🇺🇸", rating: "4.3", description: "City of brotherly love", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Denver", country: "USA", flag: "🇺🇸", rating: "4.4", description: "Mile high city adventures", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Calgary", country: "Canada", flag: "🇨🇦", rating: "4.3", description: "Gateway to the Rockies", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Quebec City", country: "Canada", flag: "🇨🇦", rating: "4.6", description: "European charm in America", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Ottawa", country: "Canada", flag: "🇨🇦", rating: "4.4", description: "Capital with tulips and canals", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Guadalajara", country: "Mexico", flag: "🇲🇽", rating: "4.4", description: "Birthplace of mariachi", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Puerto Vallarta", country: "Mexico", flag: "🇲🇽", rating: "4.5", description: "Pacific coast paradise", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
    { name: "Playa del Carmen", country: "Mexico", flag: "🇲🇽", rating: "4.4", description: "Riviera Maya hotspot", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" }  ];

  // Organize destinations into chunks for two-row display (8 destinations per slide, 4 per row)
  const destinationsPerSlide = 8;
  const chunkedDestinations = [];
  for (let i = 0; i < allDestinations.length; i += destinationsPerSlide) {
    chunkedDestinations.push(allDestinations.slice(i, i + destinationsPerSlide));
  }

  const handleDestinationClick = (destination: any) => {
    console.log('Selected destination:', destination);
  };
  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-blue-600" />,
      title: "Interactive Maps",
      description: "Explore destinations with Google Maps integration and real-time location data."
    },
    {
      icon: <CloudSun className="h-8 w-8 text-blue-600" />,
      title: "Weather Insights",
      description: "Get 5-day weather forecasts to plan your activities and packing list."
    },
    {
      icon: <Compass className="h-8 w-8 text-blue-600" />,
      title: "Smart Planning",
      description: "AI-powered recommendations based on your preferences and budget."
    },    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Group Travel",
      description: "Perfect for families, couples, friends, or solo adventures."
    },
    {
      icon: <Star className="h-8 w-8 text-blue-600" />,
      title: "Curated Experiences",
      description: "Discover hidden gems and popular attractions tailored to your interests."
    }
  ];

  const testimonials = [    {      name: "Sarah Johnson",
      location: "New York, USA",
      text: "BonVoyage made planning our family vacation so easy! The weather integration helped us pack perfectly.",
      rating: 5
    },
    {
      name: "Marco Rodriguez",
      location: "Barcelona, Spain",
      text: "Amazing tool for solo travelers. The budget planning feature saved me hundreds of dollars!",
      rating: 5
    },
    {
      name: "Emily Chen",
      location: "Tokyo, Japan",
      text: "The interactive maps and local recommendations were spot-on. Best trip planner I've used!",
      rating: 5
    }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">          <div className="mb-8">
            <Badge variant="outline" className="mb-4">
              ✨ Exclusive AI-Powered Travel Planning
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Welcome to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}BonVoyage
              </span>            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Your exclusive AI-powered trip planner and travel partner. Experience personalized luxury travel planning with intelligent recommendations, real-time weather insights, and curated premium destinations.
            </p>
          </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="text-lg px-8 py-3"
              onClick={handleStartPlanning}
            >
              <MapPin className="mr-2 h-5 w-5" />
              Start Planning Now
            </Button>            <Button size="lg" variant="outline" className="text-lg px-8 py-3" onClick={handleExploreDestinations}>
              <Globe className="mr-2 h-5 w-5" />
              Explore Destinations
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">50K+</div>
              <div className="text-gray-600">Happy Travelers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">200+</div>
              <div className="text-gray-600">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">4.9★</div>
              <div className="text-gray-600">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Perfect Travel
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From planning to execution, we've got every aspect of your journey covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-blue-50 rounded-full w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>        </div>
      </section>      {/* Enhanced Popular Destinations with Auto-Sliding Carousel */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              World's Most Popular Travel Destinations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the most sought-after destinations around the globe. From iconic landmarks to hidden gems,
              explore places that captivate millions of travelers every year.
            </p>
          </div>

          {/* Auto-Sliding Carousel Container */}
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-white hover:scale-110 ${
                !prevBtnEnabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'
              }`}
              onClick={scrollPrev}
              disabled={!prevBtnEnabled}
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            
            <button
              className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-white hover:scale-110 ${
                !nextBtnEnabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'
              }`}
              onClick={scrollNext}
              disabled={!nextBtnEnabled}
            >
              <ArrowRight className="h-6 w-6 text-gray-700" />
            </button>

            {/* Embla Carousel */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {chunkedDestinations.map((slideDestinations, slideIndex) => (
                  <div key={slideIndex} className="flex-[0_0_100%] min-w-0">
                    {/* Two Rows Layout */}
                    <div className="grid grid-rows-2 gap-6">
                      {/* First Row - 4 destinations */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {slideDestinations.slice(0, 4).map((destination, index) => (
                          <div
                            key={`${slideIndex}-${index}`}
                            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer group hover:scale-105"
                            onClick={() => handleDestinationClick(destination)}
                          >
                            {/* Image Container */}
                            <div className="relative h-40 overflow-hidden">
                              <img
                                src={destination.image}
                                alt={destination.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = `https://images.unsplash.com/800x600/?${destination.name.replace(' ', '%20')}`;
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                                <span className="text-lg">{destination.flag}</span>
                              </div>
                              <div className="absolute bottom-3 left-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="flex items-center text-yellow-400 text-sm">
                                  <span className="mr-1">⭐</span>
                                  <span>{destination.rating}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Content */}
                            <div className="p-4">
                              <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                                {destination.name}
                              </h3>
                              <p className="text-gray-600 mb-2 text-sm">{destination.country}</p>
                              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{destination.description}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center text-yellow-500">
                                  <span className="mr-1 text-sm">⭐</span>
                                  <span className="font-semibold text-sm">{destination.rating}</span>
                                </div>
                                <span className="text-blue-600 text-xs font-medium group-hover:underline">
                                  Explore →
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Second Row - 4 destinations */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {slideDestinations.slice(4, 8).map((destination, index) => (
                          <div
                            key={`${slideIndex}-${index + 4}`}
                            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer group hover:scale-105"
                            onClick={() => handleDestinationClick(destination)}
                          >
                            {/* Image Container */}
                            <div className="relative h-40 overflow-hidden">
                              <img
                                src={destination.image}
                                alt={destination.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = `https://images.unsplash.com/800x600/?${destination.name.replace(' ', '%20')}`;
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                                <span className="text-lg">{destination.flag}</span>
                              </div>
                              <div className="absolute bottom-3 left-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="flex items-center text-yellow-400 text-sm">
                                  <span className="mr-1">⭐</span>
                                  <span>{destination.rating}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Content */}
                            <div className="p-4">
                              <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                                {destination.name}
                              </h3>
                              <p className="text-gray-600 mb-2 text-sm">{destination.country}</p>
                              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{destination.description}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center text-yellow-500">
                                  <span className="mr-1 text-sm">⭐</span>
                                  <span className="font-semibold text-sm">{destination.rating}</span>
                                </div>
                                <span className="text-blue-600 text-xs font-medium group-hover:underline">
                                  Explore →
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>            {/* Carousel Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {chunkedDestinations.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    selectedIndex === index
                      ? 'bg-blue-600 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  onClick={() => emblaApi && emblaApi.scrollTo(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to your perfect journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-6 p-4 bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Tell Us Your Dreams</h3>
              <p className="text-gray-600">
                Enter your destination, dates, budget, and preferences. Our AI understands what makes your perfect trip.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-6 p-4 bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Smart Recommendations</h3>
              <p className="text-gray-600">
                Receive personalized itineraries with weather insights, interactive maps, and budget-friendly options.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-6 p-4 bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Enjoy Your Journey</h3>
              <p className="text-gray-600">
                Travel with confidence knowing every detail is planned. Make memories that last a lifetime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Loved by Travelers Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our community says about their experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Start Your Adventure?
          </h2>          <p className="text-xl text-blue-100 mb-8">
            Join thousands of travelers who trust BonVoyage : The Trip Planner to plan their perfect trips.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/planner">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                <Calendar className="mr-2 h-5 w-5" />
                Plan Your Trip Now
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600">
              <Heart className="mr-2 h-5 w-5" />
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>              <div className="flex items-center space-x-2 mb-4">
                <Globe className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">BonVoyage : The Trip Planner</span>
              </div>
              <p className="text-gray-400">
                Making travel planning simple, smart, and spectacular.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/planner" className="hover:text-white">Trip Planner</Link></li>
                <li><a href="#" className="hover:text-white">Destinations</a></li>
                <li><a href="#" className="hover:text-white">Weather</a></li>
                <li><a href="#" className="hover:text-white">Maps</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
          </div>          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 BonVoyage : The Trip Planner. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
