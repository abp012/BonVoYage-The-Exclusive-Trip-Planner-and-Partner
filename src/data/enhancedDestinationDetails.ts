import { Destination } from './destinations';
import { DestinationInfo } from '../services/geminiService';

// Enhanced destination details with AI-generated content fallbacks
export const enhancedDestinationDetails: { [key: string]: Partial<DestinationInfo> } = {
  "paris": {
    overview: "Paris, the City of Light, captivates visitors with its timeless elegance and romantic charm. Home to iconic landmarks like the Eiffel Tower, Louvre Museum, and Notre-Dame Cathedral, this cultural capital offers world-class art, fashion, and cuisine. Stroll along the Seine River, explore charming neighborhoods like Montmartre, and indulge in café culture that defines Parisian life.",
    historicalImportance: "Capital of France since the 3rd century, Paris has been the center of political, cultural, and artistic movements that shaped Western civilization.",
    famousLandmarks: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Arc de Triomphe", "Sacré-Cœur Basilica"],
    culturalHighlights: ["World-renowned museums", "Fashion capital", "Café culture", "Literary heritage"],
    keyFacts: ["Population: 2.1 million", "Currency: Euro", "Language: French", "Famous for wine and cheese"],
    bestTimeToVisit: "April to October for pleasant weather and outdoor activities",
    activities: ["Museum visits", "River cruises", "Walking tours", "Wine tasting", "Shopping"],
    cuisine: ["Croissants", "French onion soup", "Coq au vin", "Macarons", "Escargot"],
    packingTips: ["Comfortable walking shoes", "Light layers", "Umbrella", "Stylish clothes", "Power adapter"],
    localTips: ["Learn basic French phrases", "Validate metro tickets", "Tip 10% at restaurants", "Book museum tickets in advance"]
  },
  
  "tokyo": {
    overview: "Tokyo seamlessly blends ancient traditions with cutting-edge modernity, creating a unique urban experience. From serene temples and traditional gardens to neon-lit districts and anime culture, Japan's capital offers endless discoveries. Experience world-class cuisine, efficient transportation, and the fascinating contrast between old and new Japan.",
    historicalImportance: "Former Edo, Tokyo became Japan's capital in 1868 and represents the country's transformation into a modern global power.",
    famousLandmarks: ["Tokyo Skytree", "Senso-ji Temple", "Imperial Palace", "Shibuya Crossing", "Mount Fuji (nearby)"],
    culturalHighlights: ["Traditional tea ceremonies", "Anime and manga culture", "Sumo wrestling", "Cherry blossom festivals"],
    keyFacts: ["Population: 14 million", "Currency: Japanese Yen", "Language: Japanese", "World's largest metropolitan area"],
    bestTimeToVisit: "March to May (cherry blossoms) or September to November (fall colors)",
    activities: ["Temple visits", "Sushi making classes", "Karaoke", "Shopping in Harajuku", "Day trips to Mount Fuji"],
    cuisine: ["Sushi", "Ramen", "Tempura", "Yakitori", "Mochi"],
    packingTips: ["Cash for payments", "Pocket WiFi", "Comfortable shoes", "Light backpack", "Hand towel"],
    localTips: ["Bow when greeting", "Remove shoes indoors", "Don't eat while walking", "Carry cash", "Learn train etiquette"]
  },

  "rome": {
    overview: "Rome, the Eternal City, is a living museum where ancient history meets vibrant modern life. Walk through 2,000 years of history from the Colosseum to Vatican City, taste authentic Italian cuisine, and experience the passionate Italian lifestyle. Every street corner tells a story in this magnificent capital.",
    historicalImportance: "Once the center of the Roman Empire, Rome shaped law, politics, and culture across the Western world for centuries.",
    famousLandmarks: ["Colosseum", "Vatican City", "Trevi Fountain", "Pantheon", "Roman Forum"],
    culturalHighlights: ["Renaissance art", "Catholic heritage", "Italian cinema", "Aperitivo culture"],
    keyFacts: ["Population: 2.8 million", "Currency: Euro", "Language: Italian", "Home to Vatican City"],
    bestTimeToVisit: "April to June or September to October for mild weather and fewer crowds",
    activities: ["Archaeological tours", "Cooking classes", "Vatican visits", "Food tours", "Evening strolls"],
    cuisine: ["Carbonara", "Cacio e pepe", "Gelato", "Supplì", "Maritozzi"],
    packingTips: ["Comfortable walking shoes", "Modest clothing for churches", "Sunscreen", "Water bottle", "Small day bag"],
    localTips: ["Dress modestly for religious sites", "Validate public transport tickets", "Eat where locals eat", "Siesta time 1-4 PM"]
  },

  "london": {
    overview: "London perfectly balances royal heritage with modern innovation, offering world-class museums, diverse neighborhoods, and rich cultural experiences. From Buckingham Palace to trendy markets, traditional pubs to Michelin-starred restaurants, the British capital provides endless exploration opportunities in one of the world's most cosmopolitan cities.",
    historicalImportance: "Capital of the British Empire, London has been a global center of trade, politics, and culture for over a millennium.",
    famousLandmarks: ["Big Ben", "Tower Bridge", "Buckingham Palace", "British Museum", "London Eye"],
    culturalHighlights: ["Royal heritage", "West End theatre", "Pub culture", "Multicultural diversity"],
    keyFacts: ["Population: 9 million", "Currency: British Pound", "Language: English", "Has 8 royal parks"],
    bestTimeToVisit: "May to September for warmest weather and longest days",
    activities: ["Museum visits", "Theatre shows", "Royal tours", "Market shopping", "River cruises"],
    cuisine: ["Fish and chips", "Sunday roast", "Afternoon tea", "Bangers and mash", "Chicken tikka masala"],
    packingTips: ["Waterproof jacket", "Comfortable shoes", "Layers for weather", "Umbrella", "Oyster card"],
    localTips: ["Stand right on escalators", "Queue politely", "Mind the gap", "Tip 10-15%", "Book theatre tickets in advance"]
  },

  "mumbai": {
    overview: "Mumbai, the financial capital of India and home of Bollywood, pulses with incredible energy and diversity. From the iconic Gateway of India to bustling street markets, luxury hotels to dharavi tours, this maximum city offers a kaleidoscope of experiences. Experience the fast-paced life, incredible street food, and the spirit of dreams that defines Mumbai.",
    historicalImportance: "Built on seven islands, Mumbai became India's commercial gateway during British rule and remains the country's economic powerhouse.",
    famousLandmarks: ["Gateway of India", "Marine Drive", "Chhatrapati Shivaji Terminus", "Elephanta Caves", "Juhu Beach"],
    culturalHighlights: ["Bollywood film industry", "Street food culture", "Colonial architecture", "Diverse communities"],
    keyFacts: ["Population: 20 million", "Currency: Indian Rupee", "Languages: Hindi, Marathi, English", "India's financial capital"],
    bestTimeToVisit: "November to February for cooler, dry weather",
    activities: ["Bollywood studio tours", "Street food walks", "Local train rides", "Market shopping", "Beach visits"],
    cuisine: ["Vada pav", "Pav bhaji", "Bhel puri", "Misal pav", "Solkadhi"],
    packingTips: ["Light cotton clothes", "Comfortable sandals", "Mosquito repellent", "Small backpack", "Cash"],
    localTips: ["Try local trains", "Negotiate auto fares", "Carry tissues", "Stay hydrated", "Respect local customs"]
  },

  "delhi": {
    overview: "Delhi, India's capital, magnificently showcases the country's rich history through Mughal monuments, colonial architecture, and modern developments. From the historic Red Fort to bustling markets of Chandni Chowk, and from India Gate to contemporary malls, Delhi offers a perfect blend of ancient heritage and urban sophistication.",
    historicalImportance: "Delhi has been the capital of various empires for over 1,000 years, serving as the seat of Mughal Empire and British Raj.",
    famousLandmarks: ["Red Fort", "India Gate", "Qutub Minar", "Lotus Temple", "Humayun's Tomb"],
    culturalHighlights: ["Mughal architecture", "Street food culture", "Political significance", "Cultural diversity"],
    keyFacts: ["Population: 32 million", "Currency: Indian Rupee", "Languages: Hindi, English, Punjabi", "India's capital"],
    bestTimeToVisit: "October to March for pleasant weather",
    activities: ["Historical tours", "Market shopping", "Food walks", "Cultural shows", "Metro rides"],
    cuisine: ["Chole bhature", "Paranthas", "Kebabs", "Kulfi", "Lassi"],
    packingTips: ["Layers for temperature changes", "Comfortable shoes", "Scarf for religious sites", "Hand sanitizer"],
    localTips: ["Use metro for transportation", "Bargain in markets", "Try street food carefully", "Respect religious customs"]
  }
};

// Function to get enhanced destination details with fallback
export function getEnhancedDestinationDetails(
  destinationName: string, 
  geminiData?: Partial<DestinationInfo>
): Partial<DestinationInfo> {
  const normalizedName = destinationName.toLowerCase().replace(/[^a-z]/g, '');
  
  // Get fallback data
  const fallbackData = enhancedDestinationDetails[normalizedName] || enhancedDestinationDetails['default'] || {
    overview: `${destinationName} is a fascinating destination with rich culture, history, and unique experiences waiting to be discovered.`,
    historicalImportance: `${destinationName} has played an important role in the region's cultural and historical development.`,
    famousLandmarks: ["Historic sites", "Cultural monuments", "Natural attractions", "Local markets"],
    culturalHighlights: ["Local traditions", "Cultural festivals", "Art and crafts", "Music and dance"],
    keyFacts: ["Rich cultural heritage", "Friendly locals", "Unique experiences", "Memorable attractions"],
    bestTimeToVisit: "Year-round destination with seasonal variations",
    activities: ["Sightseeing", "Cultural experiences", "Local tours", "Photography", "Shopping"],
    cuisine: ["Local specialties", "Traditional dishes", "Street food", "Regional delicacies"],
    packingTips: ["Comfortable clothing", "Walking shoes", "Camera", "Local currency", "Travel documents"],
    localTips: ["Learn local customs", "Try local food", "Respect traditions", "Stay hydrated", "Keep emergency contacts"]
  };

  // Merge with Gemini data if available, prioritizing AI-generated content
  return {
    overview: geminiData?.overview || fallbackData.overview,
    historicalImportance: geminiData?.historicalImportance || fallbackData.historicalImportance,
    famousLandmarks: geminiData?.famousLandmarks || fallbackData.famousLandmarks,
    culturalHighlights: geminiData?.culturalHighlights || fallbackData.culturalHighlights,
    keyFacts: geminiData?.keyFacts || fallbackData.keyFacts,
    bestTimeToVisit: geminiData?.bestTimeToVisit || fallbackData.bestTimeToVisit,
    activities: geminiData?.activities || fallbackData.activities,
    cuisine: geminiData?.cuisine || fallbackData.cuisine,
    packingTips: geminiData?.packingTips || fallbackData.packingTips,
    localTips: geminiData?.localTips || fallbackData.localTips
  };
}
