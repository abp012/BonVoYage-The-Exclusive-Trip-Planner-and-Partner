// Trip Detail Generator Utility
// This utility generates comprehensive trip details for storage in the database

interface TripPlanData {
  destination: string;
  days: number;
  people: number;
  budget: number;
  activities: string[];
  travelWith: string;
}

interface TripDetails {
  cityDescription: string;
  topActivities: string[];
  localCuisine: string[];
  packingList: string[];
  weatherInfo: {
    temperature: string;
    condition: string;
    humidity: string;
    windSpeed: string;
    description: string;
  };  detailedItinerary: Array<{
    day: number;
    title: string;
    morning: string;
    afternoon: string;
    evening?: string; // Make evening optional for departure days
  }>;
  bestTimeToVisit: string;
  travelTips: Array<{
    category: string;
    title: string;
    description: string;
  }>;
}

export const generateTripDetails = (tripData: TripPlanData): TripDetails => {
  const { destination, days, activities, travelWith } = tripData;

  // City descriptions database
  const cityDescriptions: { [key: string]: string } = {
    "Paris": "Paris, the City of Light, enchants visitors with its timeless elegance, world-renowned art museums, and romantic atmosphere. From the iconic Eiffel Tower to the magnificent Louvre Museum, every corner tells a story of culture, history, and joie de vivre. The city's charming boulevards, sidewalk cafés, and architectural marvels create an unforgettable urban experience.",
    "Tokyo": "Tokyo is a fascinating blend of ancient traditions and cutting-edge modernity, where centuries-old temples stand alongside futuristic skyscrapers. This vibrant metropolis offers an incredible array of experiences, from serene zen gardens and traditional tea ceremonies to bustling street markets and innovative technology districts.",
    "Rome": "Rome, the Eternal City, is a living museum where ancient history meets vibrant modern life. Home to iconic landmarks like the Colosseum, Vatican City, and Trevi Fountain, Rome offers visitors a journey through millennia of art, architecture, and culinary excellence.",
    "Mumbai": "Mumbai, India's commercial capital and Bollywood's home, pulsates with an infectious energy that embodies the country's entrepreneurial spirit. This vibrant megacity seamlessly blends colonial architecture, modern skyscrapers, and rich cultural diversity along its dramatic coastline.",
    "Delhi": "Delhi, India's historic capital, represents over 1,000 years of continuous political power, creating one of the world's most layered urban experiences. The city encompasses both Old Delhi's bustling bazaars and New Delhi's imposing colonial structures, offering visitors a fascinating journey through Indian history and culture.",
    "London": "London, a magnificent blend of historic grandeur and contemporary dynamism, offers visitors an unparalleled urban experience. From the iconic Big Ben and Tower Bridge to world-class museums and vibrant neighborhoods, the city seamlessly weaves together centuries of history with cutting-edge culture.",
    "Barcelona": "Barcelona, the jewel of Catalonia, enchants visitors with its unique blend of Gothic charm and modernist innovation, most famously represented by Antoni Gaudí's architectural masterpieces. This Mediterranean coastal city offers an intoxicating mix of sandy beaches, historic neighborhoods, and world-class art museums.",
    "default": `${destination} is a remarkable destination that offers visitors a unique blend of cultural heritage, natural beauty, and authentic experiences. This enchanting location provides travelers with memorable adventures through its rich history, welcoming communities, and diverse attractions that showcase the best of local culture and traditions.`
  };

  // Top activities database
  const topActivitiesDatabase: { [key: string]: string[] } = {
    "Paris": [
      "Visit the iconic Eiffel Tower and enjoy panoramic city views",
      "Explore the world-renowned Louvre Museum and see the Mona Lisa",
      "Stroll along the Champs-Élysées and visit the Arc de Triomphe",
      "Take a romantic Seine River cruise at sunset",
      "Discover Montmartre district and the Sacré-Cœur Basilica",
      "Experience authentic French cuisine in traditional bistros",
      "Visit the magnificent Palace of Versailles and its gardens"
    ],
    "Tokyo": [
      "Experience the bustling atmosphere of Shibuya Crossing",
      "Visit the ancient Senso-ji Temple in historic Asakusa",
      "Explore the trendy Harajuku district and Takeshita Street",
      "Enjoy fresh sushi at the famous Tsukiji Outer Market",
      "Take in panoramic views from Tokyo Skytree or Tokyo Tower",
      "Discover traditional Japanese gardens at the Imperial Palace",
      "Experience authentic Japanese culture in a traditional ryokan"
    ],
    "Rome": [
      "Explore the ancient Colosseum and Roman Forum",
      "Visit Vatican City and see the Sistine Chapel",
      "Throw a coin in the iconic Trevi Fountain",
      "Discover the Pantheon and its remarkable architecture",
      "Wander through the charming Trastevere neighborhood",
      "Enjoy authentic Italian pasta and gelato",
      "Take a day trip to the ancient ruins of Pompeii"
    ],
    "Mumbai": [
      "Explore the Gateway of India and take ferry to Elephanta Caves",
      "Experience the vibrant street food culture at Juhu Beach",
      "Visit the iconic Marine Drive (Queen's Necklace)",
      "Take a Bollywood studio tour in Film City",
      "Discover the bustling Crawford Market and local bazaars",
      "Explore the historic Prince of Wales Museum",
      "Experience Mumbai's legendary local train network"
    ],
    "Delhi": [
      "Visit the magnificent Red Fort and Jama Masjid",
      "Explore the historic Humayun's Tomb and Lotus Temple",
      "Discover the bustling markets of Chandni Chowk",
      "Visit India Gate and the Presidential Palace area",
      "Experience the spiritual atmosphere of Akshardham Temple",
      "Explore the gardens and monuments of Lodhi Road",
      "Take a day trip to the iconic Taj Mahal in Agra"
    ],
    "London": [
      "Visit the historic Tower of London and see the Crown Jewels",
      "Experience the changing of the guard at Buckingham Palace",
      "Explore the world-class British Museum",
      "Take a ride on the iconic London Eye",
      "Discover the vibrant markets of Camden and Borough",
      "Enjoy traditional afternoon tea and fish & chips",
      "Catch a spectacular show in London's West End"
    ],
    "Barcelona": [
      "Marvel at Gaudí's masterpiece, the Sagrada Família",
      "Explore the whimsical Park Güell and its colorful mosaics",
      "Wander through the historic Gothic Quarter",
      "Relax on the beautiful beaches of Barceloneta",
      "Experience the vibrant atmosphere of Las Ramblas",
      "Enjoy authentic tapas and sangria in local bars",
      "Visit the stunning Casa Batlló and Casa Milà"
    ],
    "default": [
      `Explore the historic landmarks and cultural sites of ${destination}`,
      `Experience the local cuisine and traditional markets`,
      `Visit museums and art galleries showcasing local culture`,
      `Take guided tours to learn about the area's rich history`,
      `Enjoy outdoor activities and natural attractions`,
      `Participate in local festivals and cultural events`,
      `Discover hidden gems and off-the-beaten-path locations`
    ]
  };

  // Local cuisine database
  const localCuisineDatabase: { [key: string]: string[] } = {
    "Paris": [
      "Croissants and Pain au Chocolat from traditional boulangeries",
      "Classic French Onion Soup with Gruyère cheese",
      "Coq au Vin (chicken braised in wine) at bistros",
      "Escargots (snails) with garlic and herb butter",
      "Authentic French macarons from Ladurée",
      "Duck Confit with roasted potatoes",
      "Crème Brûlée for dessert"
    ],
    "Tokyo": [
      "Fresh sushi and sashimi at Tsukiji Outer Market",
      "Authentic ramen from specialized ramen shops",
      "Tempura (lightly battered and fried seafood/vegetables)",
      "Traditional kaiseki multi-course dining",
      "Yakitori (grilled chicken skewers) from street vendors",
      "Matcha tea and wagashi sweets",
      "Tokyo-style monjayaki (savory pancake)"
    ],
    "Rome": [
      "Carbonara pasta with authentic Roman preparation",
      "Authentic Neapolitan pizza with fresh mozzarella",
      "Gelato from traditional gelaterias",
      "Supplì (fried rice balls) as street food",
      "Saltimbocca alla Romana (veal with prosciutto)",
      "Roman-style artichokes (Carciofi alla Romana)",
      "Tiramisu for dessert"
    ],
    "Mumbai": [
      "Iconic Vada Pav (Mumbai's burger) from street vendors",
      "Pav Bhaji with butter and fresh pav bread",
      "Fresh seafood at Juhu Beach and Marine Drive",
      "Authentic Mumbai-style biryani",
      "Street-side bhel puri and sev puri",
      "Traditional Maharashtrian thali meals",
      "Kulfi and falooda for dessert"
    ],
    "Delhi": [
      "Paranthe from the famous Paranthe Wali Gali",
      "Chole Bhature and Rajma Chawal",
      "Street food at Chandni Chowk bazaar",
      "Authentic Mughlai cuisine and kebabs",
      "Delhi-style chaat and golgappa",
      "Traditional lassi and kulfi",
      "Butter chicken and naan bread"
    ],
    "London": [
      "Traditional Fish and Chips with mushy peas",
      "Full English Breakfast with black pudding",
      "Authentic afternoon tea with scones and clotted cream",
      "Bangers and Mash with onion gravy",
      "Shepherd's Pie and Sunday roast dinners",
      "British curry dishes from Brick Lane",
      "Sticky toffee pudding for dessert"
    ],
    "Barcelona": [
      "Authentic tapas: patatas bravas and jamón ibérico",
      "Fresh paella with seafood or chicken",
      "Pintxos (small plates) with local wines",
      "Gazpacho and pan con tomate",
      "Crema catalana for dessert",
      "Local cava (sparkling wine) tastings",
      "Traditional churros with chocolate"
    ],
    "default": [
      `Traditional local dishes unique to ${destination}`,
      `Fresh regional specialties from local markets`,
      `Authentic street food from popular vendors`,
      `Regional spices and cooking techniques`,
      `Local beverages and traditional drinks`,
      `Seasonal specialties and festival foods`,
      `Farm-to-table dining experiences`
    ]
  };

  // Detailed itinerary database
  const itineraryDatabase: { [key: string]: any[] } = {
    "Paris": [
      {
        title: "Classic Paris Icons",
        morning: "Visit the Eiffel Tower at sunrise for stunning photos and explore Trocadéro Gardens (7:00 AM - 10:00 AM)",
        afternoon: "Explore the Louvre Museum, see the Mona Lisa, and stroll through Tuileries Garden (11:00 AM - 4:00 PM)",
        evening: "Seine River cruise with dinner while enjoying Paris's illuminated landmarks (6:00 PM - 9:00 PM)"
      },
      {
        title: "Montmartre & Art District",
        morning: "Climb to Sacré-Cœur Basilica and explore Montmartre's artistic streets (8:00 AM - 12:00 PM)",
        afternoon: "Visit Musée d'Orsay for Impressionist art and walk along the Left Bank (1:00 PM - 5:00 PM)",
        evening: "Experience Moulin Rouge show with traditional French dinner (7:00 PM - 11:00 PM)"
      },
      {
        title: "Royal Versailles",
        morning: "Day trip to Palace of Versailles - explore the palace and Hall of Mirrors (8:00 AM - 1:00 PM)",
        afternoon: "Wander through the magnificent Versailles Gardens and Marie Antoinette's Estate (2:00 PM - 5:00 PM)",
        evening: "Return to Paris and dine in Saint-Germain-des-Prés (6:00 PM - 9:00 PM)"
      }
    ],
    "Tokyo": [
      {
        title: "Traditional Tokyo",
        morning: "Visit Senso-ji Temple in Asakusa and explore traditional shops on Nakamise Street (8:00 AM - 11:00 AM)",
        afternoon: "Experience tea ceremony and explore Imperial Palace East Gardens (12:00 PM - 4:00 PM)",
        evening: "Traditional kaiseki dinner in authentic restaurant in Ginza (6:00 PM - 9:00 PM)"
      },
      {
        title: "Modern Tokyo Experience",
        morning: "Explore Shibuya Crossing, Hachiko Statue, and trendy Harajuku district (9:00 AM - 1:00 PM)",
        afternoon: "Visit Tokyo Skytree for panoramic views and explore Akihabara electronics district (2:00 PM - 6:00 PM)",
        evening: "Experience Tokyo nightlife in Shinjuku with izakaya hopping (7:00 PM - 11:00 PM)"
      },
      {
        title: "Cultural Immersion",
        morning: "Visit Meiji Shrine and peaceful Yoyogi Park for morning serenity (8:00 AM - 11:00 AM)",
        afternoon: "Explore Tsukiji Outer Market for fresh sushi and Japanese cooking class (12:00 PM - 4:00 PM)",
        evening: "Attend traditional kabuki performance at Kabuki-za Theatre (6:00 PM - 9:00 PM)"
      }
    ],
    "default": [
      {
        title: `Explore ${destination}`,
        morning: `Visit major landmarks and cultural sites (9:00 AM - 12:00 PM)`,
        afternoon: `Experience local markets and museums (1:00 PM - 5:00 PM)`,
        evening: `Enjoy traditional dinner and local entertainment (6:00 PM - 9:00 PM)`
      },
      {
        title: `Cultural Discovery`,
        morning: `Explore historical districts and religious sites (8:00 AM - 12:00 PM)`,
        afternoon: `Visit art galleries and cultural centers (1:00 PM - 5:00 PM)`,
        evening: `Experience local nightlife and dining scene (6:00 PM - 10:00 PM)`
      }
    ]
  };

  // Generate packing list
  const generatePackingList = () => {
    const baseItems = [
      "Comfortable walking shoes and sandals",
      "Weather-appropriate clothing layers",
      "Travel documents and photocopies",
      "Universal power adapter and portable charger",
      "First aid kit and personal medications",
      "Camera or smartphone for capturing memories",
      "Reusable water bottle and snacks",
      "Local currency and credit/debit cards",
      "Guidebook or offline maps",
      "Sunscreen and sunglasses"
    ];
    
    const specificItems: { [key: string]: string[] } = {
      "Paris": ["Light scarf for evening outings", "Comfortable shoes for cobblestone streets"],
      "Tokyo": ["Pocket WiFi device", "Cash (many places don't accept cards)"],
      "Rome": ["Modest clothing for church visits", "Comfortable shoes for ancient sites"],
      "Mumbai": ["Light cotton clothing", "Umbrella for monsoon season"],
      "Delhi": ["Air pollution mask", "Warm layers for winter months"],
      "London": ["Waterproof jacket and umbrella", "Warm layers for unpredictable weather"],
      "Barcelona": ["Beach essentials and swimwear", "Comfortable shoes for walking tours"],
      "default": ["Local SIM card or international roaming", "Cultural appropriate attire"]
    };
    
    const additional = specificItems[destination] || specificItems.default;
    return [...baseItems, ...additional];
  };

  // Generate detailed itinerary
  const generateDetailedItinerary = () => {
    const baseItinerary = itineraryDatabase[destination] || itineraryDatabase.default;
    const maxDays = Math.min(days, 7); // Show up to 7 days
    const itinerary = [];
    
    for (let day = 1; day <= maxDays; day++) {
      const dayTemplate = baseItinerary[(day - 1) % baseItinerary.length];
      itinerary.push({
        day,
        title: `Day ${day} - ${dayTemplate.title}`,
        morning: dayTemplate.morning,
        afternoon: dayTemplate.afternoon,
        evening: dayTemplate.evening
      });
    }
    
    return itinerary;
  };

  // Generate weather info
  const generateWeatherInfo = () => {
    const weatherData: { [key: string]: any } = {
      "Paris": { temp: "18°C", condition: "Partly Cloudy", humidity: "68%", wind: "10 km/h" },
      "Tokyo": { temp: "24°C", condition: "Sunny", humidity: "72%", wind: "8 km/h" },
      "Rome": { temp: "26°C", condition: "Sunny", humidity: "60%", wind: "12 km/h" },
      "Mumbai": { temp: "28°C", condition: "Humid", humidity: "85%", wind: "15 km/h" },
      "Delhi": { temp: "25°C", condition: "Clear", humidity: "55%", wind: "14 km/h" },
      "London": { temp: "15°C", condition: "Overcast", humidity: "75%", wind: "18 km/h" },
      "Barcelona": { temp: "23°C", condition: "Sunny", humidity: "65%", wind: "11 km/h" },
      "default": { temp: "22°C", condition: "Pleasant", humidity: "65%", wind: "12 km/h" }
    };
    
    const weather = weatherData[destination] || weatherData.default;
    return {
      temperature: weather.temp,
      condition: weather.condition,
      humidity: weather.humidity,
      windSpeed: weather.wind,
      description: `${destination} typically enjoys pleasant weather perfect for sightseeing and outdoor activities. Check current conditions before your trip for the most accurate forecast.`
    };
  };

  // Generate travel tips
  const generateTravelTips = () => {
    return [
      {
        category: "Accommodation",
        title: "Book Early",
        description: "Reserve accommodations in advance for better rates and availability"
      },
      {
        category: "Transportation",
        title: "Local Transport",
        description: "Research public transportation options and consider day passes for savings"
      },
      {
        category: "Culture",
        title: "Local Customs",
        description: "Learn basic local customs and phrases to enhance your travel experience"
      }
    ];
  };

  return {
    cityDescription: cityDescriptions[destination] || cityDescriptions.default,
    topActivities: topActivitiesDatabase[destination] || topActivitiesDatabase.default,
    localCuisine: localCuisineDatabase[destination] || localCuisineDatabase.default,
    packingList: generatePackingList(),
    weatherInfo: generateWeatherInfo(),
    detailedItinerary: generateDetailedItinerary(),
    bestTimeToVisit: `The best time to visit ${destination} is typically during the pleasant weather months when you can fully enjoy outdoor activities and sightseeing. Consider local climate patterns, seasonal festivals, and tourist seasons when planning your ${days}-day trip for the optimal experience.`,
    travelTips: generateTravelTips()
  };
};
