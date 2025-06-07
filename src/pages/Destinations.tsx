import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Destinations = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const destinationsPerPage = 12;

  // 50 popular travel destinations from around the world
  const allDestinations = [
    // Europe
    { name: "Paris", country: "France", flag: "🇫🇷", rating: "4.8", description: "City of Light and romance", image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop" },
    { name: "Rome", country: "Italy", flag: "🇮🇹", rating: "4.7", description: "Eternal City with ancient wonders", image: "https://images.unsplash.com/photo-1552832230-c0197047daf1?w=400&h=300&fit=crop" },
    { name: "London", country: "UK", flag: "🇬🇧", rating: "4.7", description: "Historic charm meets modern culture", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop" },
    { name: "Barcelona", country: "Spain", flag: "🇪🇸", rating: "4.8", description: "Gaudí's architectural masterpieces", image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop" },
    { name: "Amsterdam", country: "Netherlands", flag: "🇳🇱", rating: "4.7", description: "Canals, bikes, and historic charm", image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=300&fit=crop" },
    { name: "Prague", country: "Czech Republic", flag: "🇨🇿", rating: "4.8", description: "Fairy-tale city of a hundred spires", image: "https://images.unsplash.com/photo-1541849546-216549ae216d?w=400&h=300&fit=crop" },
    { name: "Santorini", country: "Greece", flag: "🇬🇷", rating: "4.9", description: "White-washed cliffs over blue seas", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop" },
    { name: "Vienna", country: "Austria", flag: "🇦🇹", rating: "4.7", description: "Imperial palaces and coffee culture", image: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=400&h=300&fit=crop" },

    // Asia
    { name: "Tokyo", country: "Japan", flag: "🇯🇵", rating: "4.9", description: "Modern metropolis meets tradition", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop" },
    { name: "Kyoto", country: "Japan", flag: "🇯🇵", rating: "4.8", description: "Ancient temples and bamboo forests", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop" },
    { name: "Bali", country: "Indonesia", flag: "🇮🇩", rating: "4.8", description: "Tropical paradise with temples", image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop" },
    { name: "Bangkok", country: "Thailand", flag: "🇹🇭", rating: "4.5", description: "Street food and golden temples", image: "https://images.unsplash.com/photo-1563492065-4dec4c534c13?w=400&h=300&fit=crop" },
    { name: "Singapore", country: "Singapore", flag: "🇸🇬", rating: "4.8", description: "Garden city of the future", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop" },
    { name: "Seoul", country: "South Korea", flag: "🇰🇷", rating: "4.6", description: "K-culture and cutting-edge tech", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop" },
    { name: "Hong Kong", country: "Hong Kong", flag: "🇭🇰", rating: "4.6", description: "Skyscrapers and dim sum", image: "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=400&h=300&fit=crop" },
    { name: "Dubai", country: "UAE", flag: "🇦🇪", rating: "4.7", description: "Luxury and futuristic architecture", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop" },

    // Americas
    { name: "New York", country: "USA", flag: "🇺🇸", rating: "4.6", description: "The city that never sleeps", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop" },
    { name: "Los Angeles", country: "USA", flag: "🇺🇸", rating: "4.4", description: "Hollywood and beaches", image: "https://images.unsplash.com/photo-1534190239940-9ba8944ea261?w=400&h=300&fit=crop" },
    { name: "San Francisco", country: "USA", flag: "🇺🇸", rating: "4.5", description: "Golden Gate and tech culture", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" },
    { name: "Toronto", country: "Canada", flag: "🇨🇦", rating: "4.6", description: "Multicultural metropolis", image: "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400&h=300&fit=crop" },
    { name: "Vancouver", country: "Canada", flag: "🇨🇦", rating: "4.7", description: "Mountains meet ocean", image: "https://images.unsplash.com/photo-1549171024-ce0ad4d5ba93?w=400&h=300&fit=crop" },
    { name: "Rio de Janeiro", country: "Brazil", flag: "🇧🇷", rating: "4.6", description: "Beaches and Christ the Redeemer", image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&h=300&fit=crop" },
    { name: "Buenos Aires", country: "Argentina", flag: "🇦🇷", rating: "4.5", description: "Tango and European architecture", image: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=400&h=300&fit=crop" },
    { name: "Mexico City", country: "Mexico", flag: "🇲🇽", rating: "4.4", description: "Ancient culture and vibrant life", image: "https://images.unsplash.com/photo-1568402102990-bc541580b59f?w=400&h=300&fit=crop" },

    // Africa & Middle East
    { name: "Cairo", country: "Egypt", flag: "🇪🇬", rating: "4.3", description: "Pyramids and ancient wonders", image: "https://images.unsplash.com/photo-1539650116574-75c0c6d89de6?w=400&h=300&fit=crop" },
    { name: "Cape Town", country: "South Africa", flag: "🇿🇦", rating: "4.7", description: "Table Mountain and wine country", image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&h=300&fit=crop" },
    { name: "Marrakech", country: "Morocco", flag: "🇲🇦", rating: "4.5", description: "Red city and vibrant souks", image: "https://images.unsplash.com/photo-1539650116574-75c0c6d89de6?w=400&h=300&fit=crop" },
    { name: "Istanbul", country: "Turkey", flag: "🇹🇷", rating: "4.6", description: "Where Europe meets Asia", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&h=300&fit=crop" },

    // Oceania
    { name: "Sydney", country: "Australia", flag: "🇦🇺", rating: "4.7", description: "Opera House and harbour views", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" },
    { name: "Melbourne", country: "Australia", flag: "🇦🇺", rating: "4.6", description: "Coffee culture and street art", image: "https://images.unsplash.com/photo-1514395462725-fb4566210144?w=400&h=300&fit=crop" },
    { name: "Auckland", country: "New Zealand", flag: "🇳🇿", rating: "4.6", description: "City of sails and nature", image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=400&h=300&fit=crop" },

    // More Asian destinations
    { name: "Mumbai", country: "India", flag: "🇮🇳", rating: "4.4", description: "Bollywood and bustling markets", image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=300&fit=crop" },
    { name: "Delhi", country: "India", flag: "🇮🇳", rating: "4.3", description: "Mughal heritage and modern India", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop" },
    { name: "Beijing", country: "China", flag: "🇨🇳", rating: "4.5", description: "Ancient capital with modern marvels", image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&h=300&fit=crop" },
    { name: "Shanghai", country: "China", flag: "🇨🇳", rating: "4.6", description: "Futuristic skyline and historic charm", image: "https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=400&h=300&fit=crop" },
    { name: "Hanoi", country: "Vietnam", flag: "🇻🇳", rating: "4.4", description: "Street food and French colonial charm", image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&h=300&fit=crop" },

    // More European destinations
    { name: "Florence", country: "Italy", flag: "🇮🇹", rating: "4.8", description: "Renaissance art and architecture", image: "https://images.unsplash.com/photo-1552820728-421d0acfe5f5?w=400&h=300&fit=crop" },
    { name: "Venice", country: "Italy", flag: "🇮🇹", rating: "4.6", description: "Floating city of canals and gondolas", image: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=400&h=300&fit=crop" },
    { name: "Lisbon", country: "Portugal", flag: "🇵🇹", rating: "4.7", description: "Trams, tiles, and fado music", image: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=400&h=300&fit=crop" },
    { name: "Stockholm", country: "Sweden", flag: "🇸🇪", rating: "4.6", description: "Nordic design and archipelago", image: "https://images.unsplash.com/photo-1508189860359-777d945909ef?w=400&h=300&fit=crop" },
    { name: "Budapest", country: "Hungary", flag: "🇭🇺", rating: "4.7", description: "Thermal baths and grand architecture", image: "https://images.unsplash.com/photo-1541849546-216549ae216d?w=400&h=300&fit=crop" },
    { name: "Edinburgh", country: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", rating: "4.6", description: "Medieval castle and Scottish culture", image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop" },
    { name: "Berlin", country: "Germany", flag: "🇩🇪", rating: "4.5", description: "History, art, and vibrant nightlife", image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop" },
    { name: "Dubrovnik", country: "Croatia", flag: "🇭🇷", rating: "4.7", description: "Pearl of the Adriatic", image: "https://images.unsplash.com/photo-1555990538-c4d5d241f45c?w=400&h=300&fit=crop" },

    // Island destinations
    { name: "Maldives", country: "Maldives", flag: "🇲🇻", rating: "4.9", description: "Overwater bungalows and crystal waters", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" },
    { name: "Hawaii", country: "USA", flag: "🇺🇸", rating: "4.8", description: "Tropical paradise and volcanoes", image: "https://images.unsplash.com/photo-1542259009477-d625272157b7?w=400&h=300&fit=crop" },
    { name: "Fiji", country: "Fiji", flag: "🇫🇯", rating: "4.7", description: "Pristine beaches and coral reefs", image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=300&fit=crop" },
    { name: "Seychelles", country: "Seychelles", flag: "🇸🇨", rating: "4.8", description: "Granite boulders and white sand", image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=300&fit=crop" },

    // Nordic and Northern destinations
    { name: "Reykjavik", country: "Iceland", flag: "🇮🇸", rating: "4.7", description: "Northern lights and geysers", image: "https://images.unsplash.com/photo-1539650116574-75c0c6d89de6?w=400&h=300&fit=crop" },
    { name: "Oslo", country: "Norway", flag: "🇳🇴", rating: "4.6", description: "Fjords and modern architecture", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },    // More unique destinations
    { name: "Petra", country: "Jordan", flag: "🇯🇴", rating: "4.8", description: "Ancient rock-carved city", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Machu Picchu", country: "Peru", flag: "🇵🇪", rating: "4.9", description: "Lost city of the Incas", image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400&h=300&fit=crop" },

    // Indian destinations
    { name: "Kolkata", country: "India", flag: "🇮🇳", rating: "4.5", description: "Cultural capital and City of Joy", image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=400&h=300&fit=crop" },
    { name: "Chennai", country: "India", flag: "🇮🇳", rating: "4.4", description: "Gateway to South India", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=300&fit=crop" },
    { name: "Bengaluru", country: "India", flag: "🇮🇳", rating: "4.3", description: "Silicon Valley of India", image: "https://images.unsplash.com/photo-1580138703529-d72d4d5ad98b?w=400&h=300&fit=crop" },
    { name: "Hyderabad", country: "India", flag: "🇮🇳", rating: "4.4", description: "City of Pearls and Nizams", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Taj Mahal (Agra)", country: "India", flag: "🇮🇳", rating: "4.9", description: "Monument of eternal love", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop" },
    { name: "Jaipur", country: "India", flag: "🇮🇳", rating: "4.6", description: "Pink City and royal palaces", image: "https://images.unsplash.com/photo-1599661046827-dacde2a942c0?w=400&h=300&fit=crop" },
    { name: "Goa", country: "India", flag: "🇮🇳", rating: "4.7", description: "Beaches and Portuguese heritage", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop" },
    { name: "Kerala", country: "India", flag: "🇮🇳", rating: "4.8", description: "God's Own Country", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=300&fit=crop" },
    { name: "Udaipur", country: "India", flag: "🇮🇳", rating: "4.7", description: "City of Lakes and palaces", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Varanasi", country: "India", flag: "🇮🇳", rating: "4.5", description: "Spiritual capital of India", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },

    // More European destinations
    { name: "Copenhagen", country: "Denmark", flag: "🇩🇰", rating: "4.7", description: "Hygge and colorful houses", image: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=400&h=300&fit=crop" },
    { name: "Helsinki", country: "Finland", flag: "🇫🇮", rating: "4.5", description: "Design capital of the North", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Zurich", country: "Switzerland", flag: "🇨🇭", rating: "4.6", description: "Alpine beauty and luxury", image: "https://images.unsplash.com/photo-1544892504-5a42d285ab6f?w=400&h=300&fit=crop" },
    { name: "Geneva", country: "Switzerland", flag: "🇨🇭", rating: "4.5", description: "International diplomacy hub", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Munich", country: "Germany", flag: "🇩🇪", rating: "4.6", description: "Beer gardens and Bavarian culture", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Frankfurt", country: "Germany", flag: "🇩🇪", rating: "4.3", description: "Financial hub and skyline", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Brussels", country: "Belgium", flag: "🇧🇪", rating: "4.4", description: "Waffles and European capital", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Warsaw", country: "Poland", flag: "🇵🇱", rating: "4.4", description: "Phoenix city risen from ashes", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Krakow", country: "Poland", flag: "🇵🇱", rating: "4.7", description: "Medieval charm and history", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },

    // More Asian destinations
    { name: "Kuala Lumpur", country: "Malaysia", flag: "🇲🇾", rating: "4.5", description: "Twin towers and street food", image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&h=300&fit=crop" },
    { name: "Manila", country: "Philippines", flag: "🇵🇭", rating: "4.2", description: "Pearl of the Orient", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Jakarta", country: "Indonesia", flag: "🇮🇩", rating: "4.1", description: "Bustling Indonesian capital", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Ho Chi Minh City", country: "Vietnam", flag: "🇻🇳", rating: "4.3", description: "Vibrant city of contrasts", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Phnom Penh", country: "Cambodia", flag: "🇰🇭", rating: "4.2", description: "Royal Palace and Khmer culture", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Yangon", country: "Myanmar", flag: "🇲🇲", rating: "4.3", description: "Golden pagodas and heritage", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Colombo", country: "Sri Lanka", flag: "🇱🇰", rating: "4.4", description: "Pearl of the Indian Ocean", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Kathmandu", country: "Nepal", flag: "🇳🇵", rating: "4.3", description: "Gateway to the Himalayas", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Dhaka", country: "Bangladesh", flag: "🇧🇩", rating: "4.1", description: "City of mosques and rickshaws", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Islamabad", country: "Pakistan", flag: "🇵🇰", rating: "4.2", description: "Modern planned capital", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },

    // More American destinations
    { name: "Chicago", country: "USA", flag: "🇺🇸", rating: "4.5", description: "Windy City and deep-dish pizza", image: "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=400&h=300&fit=crop" },
    { name: "Miami", country: "USA", flag: "🇺🇸", rating: "4.4", description: "Art Deco and beach vibes", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" },
    { name: "Las Vegas", country: "USA", flag: "🇺🇸", rating: "4.3", description: "Entertainment capital", image: "https://images.unsplash.com/photo-1605833556294-ea5c7a74f57a?w=400&h=300&fit=crop" },
    { name: "Boston", country: "USA", flag: "🇺🇸", rating: "4.5", description: "History and education hub", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Seattle", country: "USA", flag: "🇺🇸", rating: "4.4", description: "Coffee culture and tech", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Montreal", country: "Canada", flag: "🇨🇦", rating: "4.6", description: "European charm in North America", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Quebec City", country: "Canada", flag: "🇨🇦", rating: "4.7", description: "French heritage and old world charm", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Lima", country: "Peru", flag: "🇵🇪", rating: "4.4", description: "Culinary capital of South America", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Cusco", country: "Peru", flag: "🇵🇪", rating: "4.6", description: "Gateway to Machu Picchu", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Santiago", country: "Chile", flag: "🇨🇱", rating: "4.3", description: "Modern city with Andes backdrop", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Cartagena", country: "Colombia", flag: "🇨🇴", rating: "4.6", description: "Colonial Caribbean charm", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Bogotá", country: "Colombia", flag: "🇨🇴", rating: "4.2", description: "High-altitude capital", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },

    // More African destinations
    { name: "Nairobi", country: "Kenya", flag: "🇰🇪", rating: "4.3", description: "Safari gateway and green city", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Addis Ababa", country: "Ethiopia", flag: "🇪🇹", rating: "4.1", description: "Cradle of humanity", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Lagos", country: "Nigeria", flag: "🇳🇬", rating: "4.0", description: "Nollywood and economic hub", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Casablanca", country: "Morocco", flag: "🇲🇦", rating: "4.3", description: "Economic capital and Hassan II Mosque", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Tunis", country: "Tunisia", flag: "🇹🇳", rating: "4.2", description: "Ancient Carthage and medina", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Johannesburg", country: "South Africa", flag: "🇿🇦", rating: "4.2", description: "City of Gold", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },

    // More Middle Eastern destinations
    { name: "Tel Aviv", country: "Israel", flag: "🇮🇱", rating: "4.5", description: "Mediterranean beaches and tech scene", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Jerusalem", country: "Israel", flag: "🇮🇱", rating: "4.6", description: "Holy city of three religions", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Beirut", country: "Lebanon", flag: "🇱🇧", rating: "4.3", description: "Paris of the Middle East", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Doha", country: "Qatar", flag: "🇶🇦", rating: "4.4", description: "Futuristic skyline and culture", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Abu Dhabi", country: "UAE", flag: "🇦🇪", rating: "4.5", description: "Capital luxury and Sheikh Zayed Mosque", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Kuwait City", country: "Kuwait", flag: "🇰🇼", rating: "4.1", description: "Modern Gulf metropolis", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Riyadh", country: "Saudi Arabia", flag: "🇸🇦", rating: "4.2", description: "Modern capital of the Kingdom", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },

    // More Oceania destinations
    { name: "Brisbane", country: "Australia", flag: "🇦🇺", rating: "4.4", description: "River city and gateway to Gold Coast", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Perth", country: "Australia", flag: "🇦🇺", rating: "4.3", description: "Isolated beauty and beaches", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Adelaide", country: "Australia", flag: "🇦🇺", rating: "4.4", description: "Festival city and wine country", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Wellington", country: "New Zealand", flag: "🇳🇿", rating: "4.5", description: "Capital city and film industry hub", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Christchurch", country: "New Zealand", flag: "🇳🇿", rating: "4.3", description: "Garden city rebuilt after earthquake", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },

    // More Russian destinations
    { name: "St. Petersburg", country: "Russia", flag: "🇷🇺", rating: "4.6", description: "Imperial grandeur and white nights", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Moscow", country: "Russia", flag: "🇷🇺", rating: "4.4", description: "Red Square and Kremlin", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" }
  ];

  // Calculate pagination
  const totalPages = Math.ceil(allDestinations.length / destinationsPerPage);
  const startIndex = (currentPage - 1) * destinationsPerPage;
  const currentDestinations = allDestinations.slice(startIndex, startIndex + destinationsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            World's Most Popular
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}Travel Destinations
            </span>
          </h1>          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover the world's most beloved destinations, from bustling cities to pristine beaches and ancient wonders.
          </p>        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {currentDestinations.map((destination, index) => (
            <Card key={index} className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop";
                  }}
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{destination.rating}</span>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="text-2xl">{destination.flag}</span>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-blue-600" />
                    {destination.name}
                  </span>
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {destination.country}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{destination.description}</p>
                <Button variant="outline" size="sm" className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  Explore Destination
                </Button>
              </CardContent>
            </Card>
          ))}        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="w-10"
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Destinations;
