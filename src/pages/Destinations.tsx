import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { MapPin, Star, ArrowLeft, ArrowRight, Globe, Camera, Activity, Calendar, Heart, Users, ChefHat, Landmark, Mountain, Plane, Eye, X } from "lucide-react";
import Navbar from "../components/Navbar";

const Destinations = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDestination, setSelectedDestination] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const destinationsPerPage = 12;
  // Enhanced destination data with detailed information
  const getDestinationDetails = (destination: any) => {
    const detailsMap: { [key: string]: any } = {
      // Indian Destinations
      "Mumbai": {
        about: "The financial capital of India, Mumbai is a bustling metropolis where colonial architecture meets modern skyscrapers. Known as the city of dreams, it's home to Bollywood and offers an incredible mix of street food, luxury shopping, and vibrant nightlife.",
        attractions: ["Gateway of India", "Marine Drive", "Elephanta Caves", "Chhatrapati Shivaji Terminus", "Dhobi Ghat", "Bollywood Studios"],
        activities: ["Bollywood Studio Tours", "Street Food Walking Tour", "Marine Drive Sunset Walk", "Ferry to Elephanta Caves", "Shopping at Colaba Causeway", "Local Train Experience"],
        culturalFacts: [
          "Mumbai is home to the world's largest film industry by number of films produced",
          "The city's local trains carry over 7.5 million passengers daily",
          "Mumbai contributes over 6% of India's GDP",
          "The famous Dabbawalas have a delivery accuracy rate of 99.999999%"
        ],
        whyVisit: "Experience the pulse of modern India in a city that never sleeps, where dreams are made and fortunes are built, offering an authentic glimpse into India's economic and cultural powerhouse.",
        bestTime: "October to March for pleasant weather and outdoor activities",
        foodSpecialties: ["Vada Pav", "Pav Bhaji", "Bhel Puri", "Butter Chicken", "Modak"],
        transportation: "Extensive local train network, buses, taxis, and auto-rickshaws"
      },
      "Delhi": {
        about: "India's capital territory, Delhi is a perfect blend of ancient history and modern development. From Mughal monuments to contemporary shopping malls, this city offers layers of history spanning over a millennium.",
        attractions: ["Red Fort", "India Gate", "Qutub Minar", "Lotus Temple", "Humayun's Tomb", "Akshardham Temple"],
        activities: ["Heritage Walking Tours", "Rickshaw Rides in Old Delhi", "Street Food Tours", "Metro Rides", "Garden Picnics", "Museum Visits"],
        culturalFacts: [
          "Delhi has been continuously inhabited for over 2,500 years",
          "The city has been the capital of several empires including the Mughals",
          "Delhi Metro is one of the largest metro networks in the world",
          "The city houses 3 UNESCO World Heritage Sites"
        ],
        whyVisit: "Walk through millennia of Indian history while experiencing the political and cultural heart of modern India, where ancient monuments coexist with bustling markets and government institutions.",
        bestTime: "October to March for comfortable sightseeing weather",
        foodSpecialties: ["Chole Bhature", "Paranthas", "Kebabs", "Chaat", "Kulfi"],
        transportation: "Delhi Metro, buses, auto-rickshaws, and cycle rickshaws"
      },
      "Agra": {
        about: "Home to the iconic Taj Mahal, Agra is synonymous with eternal love and Mughal grandeur. This historic city on the banks of River Yamuna showcases some of the finest examples of Mughal architecture in the world.",
        attractions: ["Taj Mahal", "Agra Fort", "Fatehpur Sikri", "Mehtab Bagh", "Tomb of Itimad-ud-Daulah", "Jama Masjid"],
        activities: ["Taj Mahal Sunrise Tour", "Heritage Walks", "Marble Inlay Workshops", "Yamuna River Views", "Photography Tours", "Local Bazaar Shopping"],
        culturalFacts: [
          "The Taj Mahal took 22 years to complete and employed 20,000 artisans",
          "Agra was the capital of the Mughal Empire from 1556 to 1658",
          "The city is famous for its marble inlay work called 'Pietra Dura'",
          "Agra is part of the Golden Triangle tourist circuit"
        ],
        whyVisit: "Witness one of the Seven Wonders of the World and immerse yourself in the romantic history of the Mughal Empire while exploring architectural masterpieces that represent the pinnacle of Indian craftsmanship.",
        bestTime: "October to March for ideal viewing conditions and comfortable weather",
        foodSpecialties: ["Petha", "Mughlai Cuisine", "Dalmoth", "Bedai", "Jalebi"],
        transportation: "Auto-rickshaws, cycle rickshaws, taxis, and walking for local sightseeing"
      },
      "Jaipur": {
        about: "Known as the Pink City, Jaipur is the capital of Rajasthan and a living testament to royal Indian heritage. The city's distinctive pink sandstone architecture and majestic palaces make it one of India's most photogenic destinations.",
        attractions: ["Hawa Mahal", "City Palace", "Amber Fort", "Jantar Mantar", "Nahargarh Fort", "Jal Mahal"],
        activities: ["Elephant Rides at Amber Fort", "Hot Air Ballooning", "Palace Tours", "Puppet Shows", "Gem and Jewelry Shopping", "Camel Safaris"],
        culturalFacts: [
          "Jaipur was planned according to Indian Vastu Shastra architecture",
          "The city was painted pink in 1876 to welcome Prince Albert",
          "Jaipur is part of UNESCO World Heritage Sites since 2019",
          "The city is famous for its traditional textiles and gemstones"
        ],
        whyVisit: "Step into a fairy-tale world of royal palaces, vibrant bazaars, and stunning architecture while experiencing the grandeur of Rajasthani culture and hospitality.",
        bestTime: "October to March for pleasant weather and outdoor activities",
        foodSpecialties: ["Dal Baati Churma", "Ghevar", "Laal Maas", "Kachori", "Rajasthani Thali"],
        transportation: "Auto-rickshaws, cycle rickshaws, buses, and hired cars for fort visits"
      },
      "Goa": {
        about: "India's smallest state by area, Goa is a tropical paradise known for its pristine beaches, Portuguese colonial architecture, and vibrant nightlife. This former Portuguese colony offers a unique blend of Indian and European cultures.",
        attractions: ["Baga Beach", "Old Goa Churches", "Dudhsagar Falls", "Anjuna Flea Market", "Fort Aguada", "Dona Paula"],
        activities: ["Beach Hopping", "Water Sports", "Spice Plantation Tours", "Church Heritage Tours", "Sunset Cruises", "Cashew Feni Tasting"],
        culturalFacts: [
          "Goa was a Portuguese colony for over 450 years",
          "The state has the highest GDP per capita in India",
          "Goa's churches and convents are UNESCO World Heritage Sites",
          "The state celebrates unique festivals like Carnival and Shigmo"
        ],
        whyVisit: "Relax on India's most beautiful beaches while experiencing a unique Indo-Portuguese culture, delicious seafood, and some of the country's most laid-back vibes.",
        bestTime: "November to February for perfect beach weather",
        foodSpecialties: ["Fish Curry Rice", "Bebinca", "Feni", "Prawn Balchão", "Xacuti"],
        transportation: "Motorcycles, buses, taxis, and auto-rickshaws"
      },
      "Kerala": {
        about: "Called 'God's Own Country,' Kerala is a tropical paradise with serene backwaters, lush hill stations, pristine beaches, and rich cultural traditions. This southern Indian state offers some of the most diverse and beautiful landscapes in the country.",
        attractions: ["Kerala Backwaters", "Munnar Tea Gardens", "Periyar Wildlife Sanctuary", "Fort Kochi", "Varkala Beach", "Wayanad Hills"],
        activities: ["Houseboat Cruises", "Ayurvedic Treatments", "Tea Plantation Tours", "Kathakali Performances", "Spice Garden Visits", "Wildlife Safaris"],
        culturalFacts: [
          "Kerala has 100% literacy rate, the highest in India",
          "The state is known for its unique martial art form Kalaripayattu",
          "Kerala's backwaters are formed by 41 west-flowing rivers",
          "The state is the origin of Ayurveda, the ancient healing system"
        ],
        whyVisit: "Experience India's most eco-friendly destination with its pristine nature, ancient wellness traditions, and a culture that perfectly balances development with environmental conservation.",
        bestTime: "September to March for ideal weather and backwater cruises",
        foodSpecialties: ["Appam with Stew", "Fish Moilee", "Puttu", "Banana Chips", "Kerala Sadya"],
        transportation: "Boats for backwaters, buses, auto-rickshaws, and hired cars"
      },
      "Udaipur": {
        about: "Known as the City of Lakes, Udaipur is one of India's most romantic cities. With its stunning palaces, serene lakes, and magnificent architecture, this Rajasthani gem offers a glimpse into royal Indian heritage.",
        attractions: ["City Palace", "Lake Pichola", "Jag Mandir", "Saheliyon Ki Bari", "Jagdish Temple", "Fateh Sagar Lake"],
        activities: ["Lake Palace Tours", "Boat Rides", "Palace Photography", "Cultural Shows", "Heritage Walks", "Miniature Painting Workshops"],
        culturalFacts: [
          "Udaipur was founded in 1559 by Maharana Udai Singh II",
          "The city has been featured in numerous Bollywood films",
          "Udaipur's City Palace is one of the largest palace complexes in the world",
          "The city is known for its miniature paintings and crafts"
        ],
        whyVisit: "Immerse yourself in royal luxury and romance in a city where every corner tells tales of valor and love, surrounded by stunning lakes and majestic palaces.",
        bestTime: "September to March for pleasant weather and lake activities",
        foodSpecialties: ["Dal Baati Churma", "Gatte Ki Sabzi", "Malpua", "Kachori", "Rajasthani Thali"],
        transportation: "Auto-rickshaws, cycle rickshaws, boats for lake travel, and walking"
      },
      "Varanasi": {
        about: "One of the world's oldest continuously inhabited cities, Varanasi is the spiritual capital of India. This sacred city on the banks of the Ganges River offers profound spiritual experiences and ancient traditions.",
        attractions: ["Dashashwamedh Ghat", "Kashi Vishwanath Temple", "Sarnath", "Manikarnika Ghat", "Banaras Hindu University", "Ramnagar Fort"],
        activities: ["Ganges Aarti Ceremony", "Boat Rides on Ganges", "Temple Visits", "Silk Weaving Tours", "Classical Music Concerts", "Yoga and Meditation"],
        culturalFacts: [
          "Varanasi is considered the holiest city in Hinduism",
          "The city is over 3,000 years old",
          "Buddha gave his first sermon in nearby Sarnath",
          "Varanasi is famous for its Banarasi silk sarees"
        ],
        whyVisit: "Experience the spiritual heart of India where ancient rituals continue unchanged, offering profound insights into Hindu philosophy and the cycle of life and death.",
        bestTime: "October to March for comfortable weather and clear river views",
        foodSpecialties: ["Banarasi Paan", "Kachori Sabzi", "Lassi", "Rabri", "Tamatar Chaat"],
        transportation: "Cycle rickshaws, auto-rickshaws, boats on the Ganges, and walking"
      },
      "Kolkata": {
        about: "Once the capital of British India, Kolkata is the cultural capital of modern India. Known for its intellectual heritage, artistic traditions, and colonial architecture, this city is a paradise for culture enthusiasts.",
        attractions: ["Victoria Memorial", "Howrah Bridge", "Dakshineswar Temple", "Indian Museum", "Eden Gardens", "Kalighat Temple"],
        activities: ["Heritage Tram Rides", "Literary Tours", "Art Gallery Visits", "Cultural Performances", "Street Food Tours", "Durga Puja Celebrations"],
        culturalFacts: [
          "Kolkata is known as the 'City of Joy' and cultural capital of India",
          "The city was the first in Asia to have a metro railway",
          "Kolkata is home to three Nobel Prize winners",
          "The city hosts Asia's largest book fair annually"
        ],
        whyVisit: "Dive into India's intellectual and cultural heritage in a city that has produced Nobel laureates, renowned artists, and revolutionary thinkers while enjoying its famous sweets and warm hospitality.",
        bestTime: "October to February for pleasant weather and festival season",
        foodSpecialties: ["Rosogolla", "Machher Jhol", "Kosha Mangsho", "Puchka", "Mishti Doi"],
        transportation: "Metro, trams, buses, auto-rickshaws, and yellow taxis"
      },
      "Chennai": {
        about: "Known as the 'Detroit of India,' Chennai is a major cultural, economic and educational center of South India. This coastal city beautifully blends traditional Tamil culture with modern metropolitan life.",
        attractions: ["Marina Beach", "Kapaleeshwarar Temple", "Fort St. George", "San Thome Cathedral", "Mahabalipuram", "DakshinaChitra"],
        activities: ["Classical Dance Performances", "Temple Tours", "Beach Walks", "Heritage Museum Visits", "Silk Shopping", "South Indian Cooking Classes"],
        culturalFacts: [
          "Chennai is considered the gateway to South Indian culture",
          "The city is the health capital of India with world-class medical facilities",
          "Chennai hosts the largest classical music festival in the world",
          "The city is a major center for Tamil cinema (Kollywood)"
        ],
        whyVisit: "Experience authentic South Indian culture, classical arts, and traditions while enjoying one of India's longest urban beaches and exploring ancient temples and colonial heritage.",
        bestTime: "November to February for comfortable weather",
        foodSpecialities: ["Idli Sambar", "Dosa", "Chettinad Chicken", "Filter Coffee", "Payasam"],
        transportation: "Metro, buses, auto-rickshaws, and suburban trains"
      },
      "Bengaluru": {
        about: "Known as the Silicon Valley of India, Bengaluru is the country's IT capital and a major cosmopolitan city. Beyond its tech reputation, the city offers pleasant weather, beautiful parks, and vibrant nightlife.",
        attractions: ["Lalbagh Botanical Garden", "Bangalore Palace", "ISKCON Temple", "Cubbon Park", "Vidhana Soudha", "Bull Temple"],
        activities: ["Brewery Tours", "Garden Walks", "Palace Tours", "Shopping at Brigade Road", "Nightlife Exploration", "Tech Park Visits"],
        culturalFacts: [
          "Bengaluru is known as the 'Garden City of India'",
          "The city houses India's largest IT companies",
          "Bengaluru has the most number of pubs and breweries in India",
          "The city is a major aerospace and defense hub"
        ],
        whyVisit: "Experience India's technology capital while enjoying its year-round pleasant climate, cosmopolitan culture, and vibrant nightlife scene that attracts young professionals from across the globe.",
        bestTime: "Year-round destination with pleasant climate",
        foodSpecialties: ["Masala Dosa", "Bisi Bele Bath", "Mysore Pak", "Filter Coffee", "South Indian Thali"],
        transportation: "Metro (Namma Metro), buses, auto-rickshaws, and app-based cabs"
      },
      "Hyderabad": {
        about: "The City of Pearls and Nizams, Hyderabad is a historic city known for its rich cultural heritage, magnificent architecture, and famous biryani. Modern Hyderabad is also a major IT and pharmaceutical hub.",
        attractions: ["Charminar", "Golconda Fort", "Ramoji Film City", "Hussain Sagar Lake", "Chowmahalla Palace", "Salar Jung Museum"],
        activities: ["Heritage Walks", "Biryani Trails", "Film City Tours", "Pearl and Bangles Shopping", "Boat Rides", "Nizami Culture Tours"],
        culturalFacts: [
          "Hyderabad was ruled by the Nizams for over 200 years",
          "The city is famous for its Kohinoor diamond and pearl trade",
          "Hyderabad hosts the largest film studio complex in the world",
          "The city is known for its unique Dakhni Urdu culture"
        ],
        whyVisit: "Discover the grandeur of Nizami culture while savoring the world's best biryani in a city that perfectly balances its regal heritage with modern technological advancement.",
        bestTime: "October to February for pleasant sightseeing weather",
        foodSpecialties: ["Hyderabadi Biryani", "Haleem", "Nihari", "Qubani Ka Meetha", "Osmania Biscuits"],
        transportation: "Metro, buses, auto-rickshaws, and app-based cabs"
      },
      "Rishikesh": {
        about: "Known as the 'Yoga Capital of the World,' Rishikesh is a spiritual haven nestled in the foothills of the Himalayas. This sacred city on the banks of the Ganges attracts seekers, adventurers, and nature lovers.",
        attractions: ["Laxman Jhula", "Ram Jhula", "Triveni Ghat", "Neelkanth Mahadev Temple", "Beatles Ashram", "Rajaji National Park"],
        activities: ["Yoga and Meditation", "River Rafting", "Ganga Aarti", "Trekking", "Bungee Jumping", "Spiritual Retreats"],
        culturalFacts: [
          "Rishikesh is considered the gateway to the Himalayas",
          "The Beatles stayed here in 1968 and composed songs",
          "The city is alcohol and meat-free",
          "Rishikesh is the starting point for the Char Dham Yatra"
        ],
        whyVisit: "Find inner peace and adventure in equal measure at the birthplace of yoga, where the Ganges flows pristine from the Himalayas and spiritual energy permeates every corner.",
        bestTime: "February to May and September to November for ideal weather",
        foodSpecialties: ["Sattvic Vegetarian Food", "Rajma Chawal", "Aloo Puri", "Lassi", "Ayurvedic Herbal Teas"],
        transportation: "Auto-rickshaws, cycle rickshaws, and walking across suspension bridges"
      },
      "Mysore": {
        about: "The cultural capital of Karnataka, Mysore is renowned for its royal heritage, magnificent palaces, and traditional arts. This city perfectly preserves its royal charm while embracing modernity.",
        attractions: ["Mysore Palace", "Chamundi Hills", "St. Philomena's Church", "Krishnarajasagar Dam", "Mysore Zoo", "Jaganmohan Palace"],
        activities: ["Palace Illumination Tours", "Silk Saree Shopping", "Sandalwood Products", "Yoga Classes", "Traditional Arts Workshops", "Dasara Festival"],
        culturalFacts: [
          "Mysore was the capital of the Kingdom of Mysore",
          "The city is famous for Mysore silk sarees and sandalwood",
          "Mysore Palace is the second most visited monument after Taj Mahal",
          "The city celebrates the grandest Dasara festival in India"
        ],
        whyVisit: "Experience royal grandeur and traditional Indian arts in a city that has maintained its cultural authenticity while showcasing some of India's finest palace architecture.",
        bestTime: "October to March, especially during Dasara festival",
        foodSpecialties: ["Mysore Pak", "Masala Dosa", "Mysore Rasam", "Traditional South Indian Meals", "Filter Coffee"],
        transportation: "City buses, auto-rickshaws, and hired cars for outstation trips"
      },
      "Pushkar": {
        about: "One of the oldest cities in India, Pushkar is a sacred pilgrimage site famous for its holy lake, temples, and the world's only Brahma temple. This small desert town offers spiritual experiences and vibrant culture.",
        attractions: ["Pushkar Lake", "Brahma Temple", "Savitri Temple", "Pushkar Camel Fair", "Rose Gardens", "Varaha Temple"],
        activities: ["Holy Lake Dips", "Camel Safaris", "Desert Camping", "Temple Visits", "Hot Air Ballooning", "Shopping at Bazaars"],
        culturalFacts: [
          "Pushkar has the world's only temple dedicated to Lord Brahma",
          "The city hosts the famous Pushkar Camel Fair annually",
          "Pushkar Lake is considered one of the most sacred lakes in India",
          "The city is mentioned in ancient Hindu scriptures"
        ],
        whyVisit: "Experience authentic Rajasthani desert culture and spirituality in one of India's most sacred cities, where ancient traditions blend seamlessly with colorful desert life.",
        bestTime: "October to March, especially during the Camel Fair in November",
        foodSpecialties: ["Dal Baati Churma", "Malpua", "Rabri", "Rajasthani Thali", "Lassi"],
        transportation: "Auto-rickshaws, cycle rickshaws, camels for desert exploration, and walking"
      },

      // International Destinations
      "Paris": {
        about: "The City of Light captivates visitors with its romantic atmosphere, world-class museums, and architectural marvels. From the iconic Eiffel Tower to the charming cobblestone streets of Montmartre, Paris offers an unparalleled blend of history, culture, and sophistication.",
        attractions: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Arc de Triomphe", "Sacré-Cœur", "Champs-Élysées"],
        activities: ["Seine River Cruise", "Wine Tasting", "Museum Tours", "Walking Tours", "Shopping at Le Marais", "Picnic in Luxembourg Gardens"],
        culturalFacts: [
          "Paris has over 130 museums and monuments",
          "The city has 20 arrondissements (districts) spiraling outward from the center",
          "French café culture is a UNESCO-recognized cultural practice",
          "Paris is home to 40+ Michelin-starred restaurants"
        ],
        whyVisit: "Paris combines world-renowned art, exquisite cuisine, stunning architecture, and an ineffable romantic charm that has inspired artists and lovers for centuries.",
        bestTime: "April-June and September-October for pleasant weather and fewer crowds",
        foodSpecialties: ["Croissants", "Macarons", "Coq au Vin", "French Onion Soup", "Crème Brûlée"],
        transportation: "Excellent Metro system, walkable districts, bike-sharing programs"
      },
      "Tokyo": {
        about: "A mesmerizing blend of ultra-modern technology and ancient traditions, Tokyo is where neon-lit skyscrapers stand alongside serene temples. This dynamic metropolis offers everything from cutting-edge fashion and cuisine to peaceful gardens and historic shrines.",
        attractions: ["Senso-ji Temple", "Tokyo Skytree", "Shibuya Crossing", "Tsukiji Outer Market", "Imperial Palace", "Meiji Shrine"],
        activities: ["Sushi Making Class", "Karaoke", "Shopping in Harajuku", "Cherry Blossom Viewing", "Robot Restaurant Show", "Sumo Wrestling Match"],
        culturalFacts: [
          "Tokyo has the world's largest metropolitan economy",
          "The city has over 80,000 restaurants",
          "Bowing is still a common greeting and sign of respect",
          "Tokyo hosts more Michelin-starred restaurants than any other city"
        ],
        whyVisit: "Experience the future today while honoring the past in a city that perfectly balances tradition with innovation, offering unique cultural experiences found nowhere else on Earth.",
        bestTime: "March-May for cherry blossoms or September-November for comfortable weather",
        foodSpecialties: ["Sushi", "Ramen", "Tempura", "Yakitori", "Mochi"],
        transportation: "World's most efficient train system, clean and punctual"
      },
      "Rome": {
        about: "The Eternal City is a living museum where ancient history meets vibrant modern life. Every corner tells a story spanning over 2,000 years, from Roman ruins to Renaissance masterpieces and contemporary art.",
        attractions: ["Colosseum", "Vatican City", "Trevi Fountain", "Roman Forum", "Pantheon", "Spanish Steps"],
        activities: ["Gladiator School", "Food Tours", "Vespa Tours", "Vatican Museums Tour", "Cooking Classes", "Catacombs Exploration"],
        culturalFacts: [
          "Rome has more Christian churches than any other city",
          "The city center is a UNESCO World Heritage Site",
          "Romans invented concrete and the arch",
          "The Vatican is the world's smallest sovereign state"
        ],
        whyVisit: "Walk through millennia of history while enjoying some of the world's best cuisine, art, and architecture in a city that shaped Western civilization.",
        bestTime: "April-June and September-October for ideal weather",
        foodSpecialties: ["Carbonara", "Cacio e Pepe", "Gelato", "Maritozzi", "Supplì"],
        transportation: "Metro system, extensive bus network, very walkable historic center"
      },
      "London": {
        about: "A global metropolis steeped in history, London seamlessly blends royal heritage with cutting-edge culture. From world-class museums and theaters to charming pubs and markets, this cosmopolitan city offers endless discoveries.",
        attractions: ["Big Ben", "Tower of London", "British Museum", "Buckingham Palace", "London Eye", "Westminster Abbey"],
        activities: ["Thames River Cruise", "West End Shows", "Afternoon Tea", "Markets Exploration", "Royal Parks Walking", "Pub Crawls"],
        culturalFacts: [
          "London has over 300 languages spoken within its borders",
          "The city has more parks than any other major city",
          "The London Underground is the world's oldest subway system",
          "London hosts over 250 festivals annually"
        ],
        whyVisit: "Immerse yourself in centuries of royal history while enjoying world-class theater, museums, and multicultural cuisine in one of the world's most influential cities.",
        bestTime: "May-September for warmest weather and longest days",
        foodSpecialties: ["Fish and Chips", "Bangers and Mash", "Shepherd's Pie", "Afternoon Tea", "Sunday Roast"],
        transportation: "Extensive Underground system, iconic red buses, black cabs, bike rentals"
      },
      "Bali": {
        about: "Known as the Island of the Gods, Bali is a tropical paradise that combines stunning natural beauty with rich spiritual traditions. From volcanic mountains and terraced rice fields to pristine beaches and ancient temples, Bali offers a perfect escape from the modern world.",
        attractions: ["Uluwatu Temple", "Tegallalang Rice Terraces", "Mount Batur", "Ubud Monkey Forest", "Tanah Lot", "Sekumpul Waterfall"],
        activities: ["Yoga Retreats", "Surfing", "Temple Hopping", "Rice Terrace Trekking", "Traditional Dance Shows", "Volcano Hiking"],
        culturalFacts: [
          "Bali is the only Hindu-majority island in Indonesia",
          "The island celebrates Nyepi (Day of Silence) annually",
          "Traditional Balinese architecture never uses nails",
          "Bali has over 20,000 temples"
        ],
        whyVisit: "Experience spiritual awakening in a tropical paradise that offers world-class beaches, ancient temples, lush landscapes, and a culture centered on harmony and balance.",
        bestTime: "April-October for dry season, ideal for outdoor activities",
        foodSpecialties: ["Nasi Goreng", "Satay", "Gado-Gado", "Rendang", "Bebek Betutu"],
        transportation: "Scooter rentals, private drivers, traditional boats for island hopping"
      },      "Barcelona": {
        about: "A vibrant Mediterranean city where Gothic and modernist architecture create a unique skyline. Barcelona perfectly balances beach culture with urban sophistication, art with nightlife, and tradition with innovation.",
        attractions: ["Sagrada Familia", "Park Güell", "Las Ramblas", "Gothic Quarter", "Casa Batlló", "Camp Nou"],
        activities: ["Gaudí Architecture Tours", "Beach Relaxation", "Tapas Tours", "Flamenco Shows", "Football Matches", "Market Visits"],
        culturalFacts: [
          "Barcelona hosted the 1992 Summer Olympics",
          "The city is home to 9 UNESCO World Heritage Sites",
          "Catalan is the primary language alongside Spanish",
          "Barcelona has more than 20 beaches within city limits"
        ],
        whyVisit: "Discover Gaudí's architectural masterpieces while enjoying Mediterranean cuisine, beautiful beaches, and one of Europe's most vibrant cultural scenes.",        bestTime: "May-June and September-October for perfect weather",
        foodSpecialties: ["Paella", "Tapas", "Jamón Ibérico", "Crema Catalana", "Cava"],
        transportation: "Excellent metro system, buses, bikes, and very walkable"
      },
      // Additional foreign destinations
      "New York": {
        about: "The city that never sleeps, New York is a global metropolis that embodies the American dream. From towering skyscrapers to world-class museums, Broadway shows, and diverse neighborhoods, NYC offers an unparalleled urban experience.",
        attractions: ["Statue of Liberty", "Empire State Building", "Central Park", "Times Square", "Brooklyn Bridge", "9/11 Memorial"],
        activities: ["Broadway Shows", "Museum Visits", "Walking Tours", "Food Tours", "Shopping", "Architecture Tours"],
        culturalFacts: [
          "NYC is home to over 8 million people speaking 200+ languages",
          "The city has more than 500 art galleries and 150 museums",
          "Central Park was the first landscaped public park in America",
          "NYC's subway system operates 24/7 and has 472 stations"
        ],
        whyVisit: "Experience the energy of the world's most famous city where every street corner offers new discoveries, from world-class culture to incredible food scenes.",
        bestTime: "April-June and September-November for pleasant weather",
        foodSpecialties: ["New York Pizza", "Bagels", "Pastrami Sandwich", "Hot Dogs", "Cheesecake"],
        transportation: "Extensive subway system, taxis, buses, and walking"
      },
      "Dubai": {
        about: "A futuristic oasis in the desert, Dubai represents the pinnacle of luxury and innovation. This emirate seamlessly blends traditional Arabian culture with cutting-edge architecture and world-class shopping.",
        attractions: ["Burj Khalifa", "Palm Jumeirah", "Dubai Mall", "Burj Al Arab", "Dubai Fountain", "Gold Souk"],
        activities: ["Desert Safari", "Luxury Shopping", "Skydiving", "Yacht Cruises", "Fine Dining", "Spa Treatments"],
        culturalFacts: [
          "Dubai has the world's tallest building and largest shopping mall",
          "The city is built on trade and has been a trading hub for centuries",
          "Dubai has no income tax and is a global business hub",
          "Over 85% of Dubai's population consists of expatriates"
        ],
        whyVisit: "Experience unparalleled luxury and innovation in a city that has transformed from a fishing village to a global metropolis in just a few decades.",
        bestTime: "November-March for comfortable outdoor activities",
        foodSpecialties: ["Shawarma", "Hummus", "Falafel", "Machboos", "Luqaimat"],
        transportation: "Modern metro system, luxury taxis, and ride-sharing apps"
      },
      "Singapore": {
        about: "A garden city-state that perfectly balances modernity with nature, Singapore is renowned for its efficient urban planning, diverse culture, and incredible food scene. This small island nation punches well above its weight in terms of attractions and experiences.",
        attractions: ["Marina Bay Sands", "Gardens by the Bay", "Sentosa Island", "Chinatown", "Little India", "Orchard Road"],
        activities: ["Food Tours", "Night Safari", "Shopping", "Architecture Tours", "Cultural District Walks", "Rooftop Bar Hopping"],
        culturalFacts: [
          "Singapore has four official languages: English, Mandarin, Malay, and Tamil",
          "The city-state is known for its strict but effective laws",
          "Singapore has one of the world's highest concentrations of millionaires",
          "The country transforms into a garden city with over 47% green cover"
        ],
        whyVisit: "Discover a perfectly planned city where East meets West, offering world-class attractions, incredible food, and a glimpse into the future of urban living.",
        bestTime: "February-April for drier weather, though year-round destination",
        foodSpecialties: ["Hainanese Chicken Rice", "Laksa", "Chili Crab", "Satay", "Bak Kut Teh"],
        transportation: "Excellent MRT system, buses, and taxis"
      },
      "Amsterdam": {
        about: "The Venice of the North, Amsterdam charms visitors with its intricate canal system, historic architecture, and liberal culture. This Dutch capital seamlessly blends rich history with a progressive, artistic spirit.",
        attractions: ["Anne Frank House", "Van Gogh Museum", "Rijksmuseum", "Jordaan District", "Vondelpark", "Red Light District"],
        activities: ["Canal Cruises", "Bike Tours", "Museum Visits", "Coffee Shop Culture", "Market Shopping", "Architecture Tours"],
        culturalFacts: [
          "Amsterdam has more canals than Venice and over 1,500 bridges",
          "The city has more bikes than residents",
          "Amsterdam is built on 11 million wooden poles",
          "The city has over 60 museums within its borders"
        ],
        whyVisit: "Experience one of Europe's most liberal and artistic cities while cycling through historic canals and enjoying world-class museums and vibrant nightlife.",
        bestTime: "April-May and September-November for mild weather and fewer crowds",
        foodSpecialties: ["Stroopwafel", "Dutch Cheese", "Herring", "Bitterballen", "Pancakes"],
        transportation: "Extensive bike paths, trams, buses, and canal boats"
      },
      "Bangkok": {
        about: "A vibrant metropolis where ancient temples coexist with modern skyscrapers, Bangkok offers an sensory overload of sights, sounds, and flavors. This bustling capital of Thailand is famous for its street food, ornate shrines, and vibrant street life.",
        attractions: ["Grand Palace", "Wat Pho", "Wat Arun", "Chatuchak Market", "Khao San Road", "Chao Phraya River"],
        activities: ["Street Food Tours", "Temple Hopping", "River Cruises", "Traditional Massage", "Market Shopping", "Tuk-tuk Rides"],
        culturalFacts: [
          "Bangkok's full name has 169 letters and is the longest city name in the world",
          "The city has over 400 Buddhist temples",
          "Bangkok is built on a network of canals called 'klongs'",
          "The city is one of the world's top tourist destinations"
        ],
        whyVisit: "Immerse yourself in a city where tradition meets chaos in the most delightful way, offering incredible food, stunning temples, and unforgettable experiences.",
        bestTime: "November-February for cooler, drier weather",
        foodSpecialties: ["Pad Thai", "Tom Yum Goong", "Green Curry", "Mango Sticky Rice", "Som Tam"],
        transportation: "BTS Skytrain, MRT subway, taxis, tuk-tuks, and river boats"
      },      "Istanbul": {
        about: "The only city that spans two continents, Istanbul is where Europe meets Asia in a fascinating blend of cultures, religions, and architectural styles. This former capital of empires offers layers of history and vibrant modern culture.",
        attractions: ["Hagia Sophia", "Blue Mosque", "Topkapi Palace", "Grand Bazaar", "Galata Tower", "Bosphorus Bridge"],
        activities: ["Bosphorus Cruise", "Bazaar Shopping", "Turkish Bath", "Food Tours", "Historical Tours", "Rooftop Dining"],
        culturalFacts: [
          "Istanbul has been the capital of three successive empires",
          "The city straddles both Europe and Asia",
          "Istanbul has more than 3,000 mosques",
          "The Grand Bazaar is one of the oldest covered markets in the world"
        ],
        whyVisit: "Experience the crossroads of civilizations in a city that has been the center of empires for over 1,500 years, offering incredible history, culture, and cuisine.",
        bestTime: "April-May and September-November for pleasant weather",
        foodSpecialties: ["Kebabs", "Turkish Delight", "Baklava", "Turkish Coffee", "Döner"],
        transportation: "Metro, buses, ferries, and the historic tram"
      },
      "Sydney": {
        about: "Australia's harbor city combines stunning natural beauty with cosmopolitan culture. Famous for its iconic Opera House and Harbour Bridge, Sydney offers beautiful beaches, world-class dining, and a laid-back lifestyle.",
        attractions: ["Sydney Opera House", "Harbour Bridge", "Bondi Beach", "The Rocks", "Royal Botanic Gardens", "Darling Harbour"],
        activities: ["Harbour Cruises", "Beach Activities", "Opera Performances", "Bridge Climbing", "Coastal Walks", "Wine Tours"],
        culturalFacts: [
          "Sydney Harbour Bridge is nicknamed 'The Coathanger'",
          "The Opera House took 14 years to build and is a UNESCO site",
          "Sydney has over 100 beaches within the metropolitan area",
          "The city hosts the largest New Year's Eve fireworks display"
        ],
        whyVisit: "Experience one of the world's most beautiful cities where stunning architecture meets pristine beaches and outdoor lifestyle.",
        bestTime: "September-November and March-May for mild weather",
        foodSpecialties: ["Fresh Seafood", "Meat Pies", "Lamingtons", "Pavlova", "Flat White Coffee"],
        transportation: "Trains, buses, ferries, and extensive walking paths"
      },
      "Kyoto": {
        about: "The former imperial capital of Japan, Kyoto is a city of temples, gardens, and traditional culture. Home to thousands of Buddhist temples and Shinto shrines, it offers the most authentic Japanese cultural experience.",
        attractions: ["Fushimi Inari Shrine", "Kiyomizu-dera", "Arashiyama Bamboo Grove", "Gion District", "Golden Pavilion", "Philosopher's Path"],
        activities: ["Temple Visits", "Geisha Spotting", "Tea Ceremonies", "Kimono Wearing", "Garden Meditation", "Traditional Crafts"],
        culturalFacts: [
          "Kyoto has over 2,000 temples and shrines",
          "The city was Japan's capital for over 1,000 years",
          "Kyoto has 17 UNESCO World Heritage Sites",
          "The city preserves traditional Japanese architecture and culture"
        ],
        whyVisit: "Step back in time in Japan's cultural heart, where ancient traditions are preserved and practiced in their most authentic form.",
        bestTime: "March-May for cherry blossoms, November for autumn colors",
        foodSpecialties: ["Kaiseki", "Tofu Cuisine", "Matcha", "Wagyu Beef", "Traditional Sweets"],
        transportation: "Extensive bus network, subway, and walking through historic districts"
      },
      "Prague": {
        about: "Known as the 'City of a Hundred Spires,' Prague is a fairy-tale city with stunning Gothic and Baroque architecture. This bohemian capital offers medieval charm with a vibrant modern cultural scene.",
        attractions: ["Prague Castle", "Charles Bridge", "Old Town Square", "Astronomical Clock", "Wenceslas Square", "Jewish Quarter"],
        activities: ["Castle Tours", "River Cruises", "Beer Tasting", "Classical Concerts", "Walking Tours", "Market Shopping"],
        culturalFacts: [
          "Prague's historic center is a UNESCO World Heritage Site",
          "The city has been nicknamed 'Golden City' and 'Mother of Cities'",
          "Prague Castle is the largest ancient castle complex in the world",
          "The Czech Republic has the highest beer consumption per capita"
        ],
        whyVisit: "Wander through one of Europe's most beautiful cities where medieval architecture creates a magical atmosphere at every turn.",
        bestTime: "May-September for warm weather, December for Christmas markets",
        foodSpecialties: ["Goulash", "Schnitzel", "Beer", "Trdelník", "Czech Dumplings"],
        transportation: "Efficient metro, trams, and very walkable historic center"
      },
      "Venice": {
        about: "Built on water, Venice is a unique city of canals, bridges, and incredible architecture. This floating masterpiece offers romantic gondola rides, world-class art, and timeless beauty.",
        attractions: ["St. Mark's Square", "Doge's Palace", "Rialto Bridge", "Grand Canal", "Murano Island", "St. Mark's Basilica"],
        activities: ["Gondola Rides", "Glass Making Tours", "Art Gallery Visits", "Opera Performances", "Canal Cruises", "Historical Tours"],
        culturalFacts: [
          "Venice is built on 118 small islands connected by 400+ bridges",
          "The city has no roads, only canals and walkways",
          "Venice was a major maritime power for over 1,000 years",
          "The city faces annual flooding called 'acqua alta'"
        ],
        whyVisit: "Experience the world's most romantic city where every corner reveals architectural wonders and artistic treasures built on water.",
        bestTime: "April-June and September-October to avoid crowds and flooding",
        foodSpecialties: ["Seafood Risotto", "Cicchetti", "Tiramisu", "Prosecco", "Venetian Liver"],
        transportation: "Water buses (vaporetto), gondolas, and walking"
      }
    };

    // Return detailed info or fallback to generic info
    return detailsMap[destination.name] || {
      about: `${destination.name} is a wonderful destination that offers unique experiences and cultural insights. This beautiful location in ${destination.country} provides visitors with memorable attractions and activities.`,
      attractions: ["Historic Sites", "Cultural Centers", "Local Markets", "Scenic Viewpoints", "Museums", "Parks"],
      activities: ["Sightseeing", "Local Tours", "Shopping", "Dining", "Photography", "Walking Tours"],
      culturalFacts: [
        `${destination.name} has a rich cultural heritage`,
        "Local traditions are deeply respected",
        "The area is known for its hospitality",
        "Architecture reflects historical influences"
      ],
      whyVisit: `${destination.name} offers a perfect blend of culture, history, and natural beauty that creates unforgettable travel memories.`,
      bestTime: "Year-round destination with seasonal highlights",
      foodSpecialties: ["Local Cuisine", "Traditional Dishes", "Street Food", "Regional Specialties", "Fresh Ingredients"],
      transportation: "Various transportation options available for easy exploration"
    };
  };

  // Handle opening destination modal
  const handleExploreDestination = (destination: any) => {
    setSelectedDestination(destination);
    setIsModalOpen(true);
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDestination(null);
  };// Exactly 50 most popular destinations: 15 Indian + 35 Foreign
  const allDestinations = [
    // 15 Most Popular Indian Destinations
    { name: "Mumbai", country: "India", flag: "🇮🇳", rating: "4.4", description: "Bollywood capital and financial hub", image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=300&fit=crop" },
    { name: "Delhi", country: "India", flag: "🇮🇳", rating: "4.3", description: "Historic capital with Mughal heritage", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop" },
    { name: "Agra", country: "India", flag: "🇮🇳", rating: "4.9", description: "Home to the iconic Taj Mahal", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop" },
    { name: "Jaipur", country: "India", flag: "🇮🇳", rating: "4.6", description: "Pink City with royal palaces", image: "https://images.unsplash.com/photo-1599661046827-dacde2a942c0?w=400&h=300&fit=crop" },
    { name: "Goa", country: "India", flag: "🇮🇳", rating: "4.7", description: "Pristine beaches and Portuguese heritage", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop" },
    { name: "Kerala", country: "India", flag: "🇮🇳", rating: "4.8", description: "God's Own Country - backwaters and spices", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=300&fit=crop" },
    { name: "Udaipur", country: "India", flag: "🇮🇳", rating: "4.7", description: "City of Lakes and royal grandeur", image: "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=400&h=300&fit=crop" },
    { name: "Varanasi", country: "India", flag: "🇮🇳", rating: "4.5", description: "Spiritual capital and ancient ghats", image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&h=300&fit=crop" },
    { name: "Kolkata", country: "India", flag: "🇮🇳", rating: "4.5", description: "Cultural capital and City of Joy", image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=400&h=300&fit=crop" },
    { name: "Chennai", country: "India", flag: "🇮🇳", rating: "4.4", description: "Gateway to South India", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=300&fit=crop" },
    { name: "Bengaluru", country: "India", flag: "🇮🇳", rating: "4.3", description: "Silicon Valley of India", image: "https://images.unsplash.com/photo-1580138703529-d72d4d5ad98b?w=400&h=300&fit=crop" },
    { name: "Hyderabad", country: "India", flag: "🇮🇳", rating: "4.4", description: "City of Pearls and Nizams", image: "https://images.unsplash.com/photo-1588416936148-6460842b4a21?w=400&h=300&fit=crop" },
    { name: "Rishikesh", country: "India", flag: "🇮🇳", rating: "4.6", description: "Yoga capital and gateway to Himalayas", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" },
    { name: "Mysore", country: "India", flag: "🇮🇳", rating: "4.5", description: "Palace city and cultural heritage", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=300&fit=crop" },
    { name: "Pushkar", country: "India", flag: "🇮🇳", rating: "4.4", description: "Sacred lake and camel fair", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" },

    // 35 Most Popular Foreign Destinations
    { name: "Paris", country: "France", flag: "🇫🇷", rating: "4.8", description: "City of Light and romance", image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop" },
    { name: "Tokyo", country: "Japan", flag: "🇯🇵", rating: "4.9", description: "Modern metropolis meets tradition", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop" },
    { name: "Rome", country: "Italy", flag: "🇮🇹", rating: "4.7", description: "Eternal City with ancient wonders", image: "https://images.unsplash.com/photo-1552832230-c0197047daf1?w=400&h=300&fit=crop" },
    { name: "London", country: "UK", flag: "🇬🇧", rating: "4.7", description: "Historic charm meets modern culture", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop" },
    { name: "Bali", country: "Indonesia", flag: "🇮🇩", rating: "4.8", description: "Tropical paradise with temples", image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop" },
    { name: "New York", country: "USA", flag: "🇺🇸", rating: "4.6", description: "The city that never sleeps", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop" },
    { name: "Barcelona", country: "Spain", flag: "🇪🇸", rating: "4.8", description: "Gaudí's architectural masterpieces", image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop" },
    { name: "Dubai", country: "UAE", flag: "🇦🇪", rating: "4.7", description: "Luxury and futuristic architecture", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop" },
    { name: "Singapore", country: "Singapore", flag: "🇸🇬", rating: "4.8", description: "Garden city of the future", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop" },
    { name: "Amsterdam", country: "Netherlands", flag: "🇳🇱", rating: "4.7", description: "Canals, bikes, and historic charm", image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=300&fit=crop" },
    { name: "Bangkok", country: "Thailand", flag: "🇹🇭", rating: "4.5", description: "Street food and golden temples", image: "https://images.unsplash.com/photo-1563492065-4dec4c534c13?w=400&h=300&fit=crop" },
    { name: "Istanbul", country: "Turkey", flag: "🇹🇷", rating: "4.6", description: "Where Europe meets Asia", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&h=300&fit=crop" },
    { name: "Sydney", country: "Australia", flag: "🇦🇺", rating: "4.7", description: "Opera House and harbour views", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" },
    { name: "Kyoto", country: "Japan", flag: "🇯🇵", rating: "4.8", description: "Ancient temples and bamboo forests", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop" },
    { name: "Prague", country: "Czech Republic", flag: "🇨🇿", rating: "4.8", description: "Fairy-tale city of a hundred spires", image: "https://images.unsplash.com/photo-1541849546-216549ae216d?w=400&h=300&fit=crop" },
    { name: "Venice", country: "Italy", flag: "🇮🇹", rating: "4.6", description: "Floating city of canals and gondolas", image: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=400&h=300&fit=crop" },
    { name: "Santorini", country: "Greece", flag: "🇬🇷", rating: "4.9", description: "White-washed cliffs over blue seas", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop" },
    { name: "Maldives", country: "Maldives", flag: "🇲🇻", rating: "4.9", description: "Overwater bungalows and crystal waters", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" },
    { name: "Vienna", country: "Austria", flag: "🇦🇹", rating: "4.7", description: "Imperial palaces and coffee culture", image: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=400&h=300&fit=crop" },
    { name: "Seoul", country: "South Korea", flag: "🇰🇷", rating: "4.6", description: "K-culture and cutting-edge tech", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop" },
    { name: "Rio de Janeiro", country: "Brazil", flag: "🇧🇷", rating: "4.6", description: "Beaches and Christ the Redeemer", image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&h=300&fit=crop" },
    { name: "Cairo", country: "Egypt", flag: "🇪🇬", rating: "4.3", description: "Pyramids and ancient wonders", image: "https://images.unsplash.com/photo-1539650116574-75c0c6d89de6?w=400&h=300&fit=crop" },
    { name: "Marrakech", country: "Morocco", flag: "🇲🇦", rating: "4.5", description: "Red city and vibrant souks", image: "https://images.unsplash.com/photo-1539650116574-75c0c6d89de6?w=400&h=300&fit=crop" },
    { name: "Cape Town", country: "South Africa", flag: "🇿🇦", rating: "4.7", description: "Table Mountain and wine country", image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&h=300&fit=crop" },
    { name: "Petra", country: "Jordan", flag: "🇯🇴", rating: "4.8", description: "Ancient rock-carved city", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" },
    { name: "Machu Picchu", country: "Peru", flag: "🇵🇪", rating: "4.9", description: "Lost city of the Incas", image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400&h=300&fit=crop" },
    { name: "Florence", country: "Italy", flag: "🇮🇹", rating: "4.8", description: "Renaissance art and architecture", image: "https://images.unsplash.com/photo-1552820728-421d0acfe5f5?w=400&h=300&fit=crop" },
    { name: "Lisbon", country: "Portugal", flag: "🇵🇹", rating: "4.7", description: "Trams, tiles, and fado music", image: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=400&h=300&fit=crop" },
    { name: "Reykjavik", country: "Iceland", flag: "🇮🇸", rating: "4.7", description: "Northern lights and geysers", image: "https://images.unsplash.com/photo-1539650116574-75c0c6d89de6?w=400&h=300&fit=crop" },
    { name: "Copenhagen", country: "Denmark", flag: "🇩🇰", rating: "4.7", description: "Hygge and colorful houses", image: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=400&h=300&fit=crop" },
    { name: "Stockholm", country: "Sweden", flag: "🇸🇪", rating: "4.6", description: "Nordic design and archipelago", image: "https://images.unsplash.com/photo-1508189860359-777d945909ef?w=400&h=300&fit=crop" },
    { name: "Budapest", country: "Hungary", flag: "🇭🇺", rating: "4.7", description: "Thermal baths and grand architecture", image: "https://images.unsplash.com/photo-1541849546-216549ae216d?w=400&h=300&fit=crop" },
    { name: "Edinburgh", country: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", rating: "4.6", description: "Medieval castle and Scottish culture", image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop" },
    { name: "Dubrovnik", country: "Croatia", flag: "🇭🇷", rating: "4.7", description: "Pearl of the Adriatic", image: "https://images.unsplash.com/photo-1555990538-c4d5d241f45c?w=400&h=300&fit=crop" },
    { name: "Toronto", country: "Canada", flag: "🇨🇦", rating: "4.6", description: "Multicultural metropolis", image: "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400&h=300&fit=crop" }
  ];

  // Calculate pagination
  const totalPages = Math.ceil(allDestinations.length / destinationsPerPage);
  const startIndex = (currentPage - 1) * destinationsPerPage;
  const currentDestinations = allDestinations.slice(startIndex, startIndex + destinationsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="mb-6">            <Badge variant="outline" className="mb-4">
              🌍 Most Popular Destinations Worldwide
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Explore Amazing Top Places
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Discover 50 handpicked destinations including 15 incredible Indian locations and 35 world-famous international hotspots. Each destination offers unique experiences, rich culture, and unforgettable memories.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>50 Destinations</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>15 Indian + 35 International</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span>Expert Curated</span>
              </div>
            </div>
          </div>
        </div>

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
              </CardHeader>              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{destination.description}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors"
                  onClick={() => handleExploreDestination(destination)}
                >
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
          </div>        )}
      </div>

      {/* Destination Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedDestination && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-3 text-2xl">
                  <span className="text-3xl">{selectedDestination.flag}</span>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedDestination.name}</h2>
                    <p className="text-lg text-gray-600 font-normal">{selectedDestination.country}</p>
                  </div>
                  <div className="flex items-center space-x-1 ml-auto">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{selectedDestination.rating}</span>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Hero Image and Quick Stats */}
                <div className="relative">
                  <img
                    src={selectedDestination.image}
                    alt={selectedDestination.name}
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop";
                    }}
                  />
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg">
                    <p className="text-sm font-medium">{selectedDestination.description}</p>
                  </div>
                </div>

                {/* About Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <span>About {selectedDestination.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {getDestinationDetails(selectedDestination).about}
                    </p>
                  </CardContent>
                </Card>

                {/* Key Attractions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Camera className="h-5 w-5 text-green-600" />
                      <span>Key Attractions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {getDestinationDetails(selectedDestination).attractions.map((attraction: string, index: number) => (
                        <Badge key={index} variant="secondary" className="p-2 justify-center">
                          <Landmark className="h-3 w-3 mr-1" />
                          {attraction}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Activities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-orange-600" />
                      <span>Popular Activities</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {getDestinationDetails(selectedDestination).activities.map((activity: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg">
                          <Activity className="h-4 w-4 text-orange-600" />
                          <span className="text-sm">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Cultural Facts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Heart className="h-5 w-5 text-red-600" />
                      <span>Cultural & Historical Facts</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {getDestinationDetails(selectedDestination).culturalFacts.map((fact: string, index: number) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                          <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-gray-700">{fact}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Food Specialties */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <ChefHat className="h-5 w-5 text-purple-600" />
                      <span>Must-Try Food</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {getDestinationDetails(selectedDestination).foodSpecialties.map((food: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-purple-50 border-purple-200">
                          {food}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Travel Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-teal-600" />
                        <span>Best Time to Visit</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700">
                        {getDestinationDetails(selectedDestination).bestTime}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Plane className="h-5 w-5 text-indigo-600" />
                        <span>Transportation</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700">
                        {getDestinationDetails(selectedDestination).transportation}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Why Visit */}
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Eye className="h-5 w-5 text-blue-600" />
                      <span>Why Visit {selectedDestination.name}?</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-800 leading-relaxed font-medium">
                      {getDestinationDetails(selectedDestination).whyVisit}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Destinations;
