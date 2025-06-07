// Detailed destination information for enhanced descriptions
export interface DestinationDetails {
  name: string;
  overview: string;
  historicalImportance: string;
  famousLandmarks: string[];
  culturalHighlights: string[];
  keyFacts: string[];
  bestTimeToVisit: string;
}

export const destinationDetails: { [key: string]: DestinationDetails } = {
  // European Destinations
  "Paris": {
    name: "Paris",
    overview: "Paris, the enchanting capital of France, stands as one of the world's most romantic and culturally rich cities. Known as the 'City of Light,' Paris seamlessly blends historic charm with modern sophistication, offering visitors an unforgettable experience through its tree-lined boulevards, world-class museums, and iconic architecture.",
    historicalImportance: "Founded over 2,000 years ago, Paris has been the center of French power and culture for centuries. From the medieval period through the Renaissance to the modern era, Paris has witnessed pivotal moments in world history, including the French Revolution, the Belle Époque, and both World Wars. The city has long been a beacon of art, literature, philosophy, and fashion.",
    famousLandmarks: [
      "Eiffel Tower - Iconic iron lattice tower and symbol of Paris",
      "Louvre Museum - World's largest art museum housing the Mona Lisa",
      "Notre-Dame Cathedral - Gothic masterpiece (under restoration)",
      "Arc de Triomphe - Triumphal arch honoring French military victories",
      "Champs-Élysées - Famous avenue for shopping and entertainment",
      "Sacré-Cœur Basilica - Beautiful basilica atop Montmartre hill"
    ],
    culturalHighlights: [
      "Seine River cruises offering panoramic city views",
      "Montmartre district with its artistic heritage and cafés",
      "Latin Quarter's bohemian atmosphere and bookshops",
      "World-renowned French cuisine and Michelin-starred restaurants",
      "Fashion capital with luxury boutiques and designer stores",
      "Vibrant nightlife in districts like Marais and Saint-Germain"
    ],
    keyFacts: [
      "Population: 2.2 million (12 million metro area)",
      "Language: French",
      "Currency: Euro (EUR)",
      "Time Zone: Central European Time (CET)",
      "Best known for: Art, fashion, cuisine, and romance"
    ],
    bestTimeToVisit: "April to June and September to October offer the most pleasant weather with mild temperatures and fewer crowds. Spring brings blooming gardens, while autumn offers golden foliage. Summer can be crowded but offers long daylight hours and outdoor events."
  },

  "London": {
    name: "London",
    overview: "London, the dynamic capital of the United Kingdom, is a global metropolis that masterfully combines centuries of history with cutting-edge modernity. From royal palaces to contemporary art galleries, traditional pubs to innovative restaurants, London offers an unparalleled urban experience that attracts millions of visitors annually.",
    historicalImportance: "With nearly 2,000 years of history, London has been a Roman settlement, medieval trading hub, and the heart of the British Empire. The city has survived the Great Fire of 1666, the Blitz during World War II, and has continuously evolved while preserving its historical legacy. As a former imperial capital, London's influence on law, finance, arts, and culture extends worldwide.",
    famousLandmarks: [
      "Big Ben and Houses of Parliament - Iconic clock tower and seat of British government",
      "Tower of London - Historic fortress housing the Crown Jewels",
      "Buckingham Palace - Official residence of the British Royal Family",
      "London Eye - Giant observation wheel offering panoramic city views",
      "Tower Bridge - Victorian masterpiece spanning the Thames",
      "Westminster Abbey - Gothic church where British monarchs are crowned"
    ],
    culturalHighlights: [
      "West End theatre district with world-class musicals and plays",
      "British Museum housing treasures from around the globe",
      "Tate Modern and National Gallery showcasing incredible art collections",
      "Traditional afternoon tea culture and historic pubs",
      "Camden Market and Portobello Road for unique shopping experiences",
      "Royal parks including Hyde Park and Regent's Park"
    ],
    keyFacts: [
      "Population: 9 million (Greater London)",
      "Language: English",
      "Currency: British Pound Sterling (GBP)",
      "Time Zone: Greenwich Mean Time (GMT)",
      "Best known for: Royal heritage, theatre, museums, and multicultural diversity"
    ],
    bestTimeToVisit: "May to September offers the warmest weather and longest days, perfect for exploring parks and outdoor attractions. However, this is also peak tourist season. April, October, and November can offer pleasant weather with fewer crowds and lower prices."
  },

  "Tokyo": {
    name: "Tokyo",
    overview: "Tokyo, Japan's bustling capital, is a mesmerizing blend of ultramodern innovation and deep-rooted tradition. This megacity offers everything from serene temples and traditional gardens to neon-lit skyscrapers and cutting-edge technology. Tokyo represents the fascinating duality of Japan, where ancient customs coexist harmoniously with futuristic developments.",
    historicalImportance: "Originally called Edo, Tokyo became Japan's capital in 1868 when Emperor Meiji moved his residence there. The city has overcome major challenges including the Great Kanto Earthquake of 1923 and World War II bombing, rebuilding itself into a modern metropolis. Tokyo successfully hosted the 1964 Olympics, marking Japan's post-war recovery, and recently hosted the 2021 Olympics.",
    famousLandmarks: [
      "Senso-ji Temple - Tokyo's oldest temple in historic Asakusa district",
      "Tokyo Skytree - World's second-tallest structure with observation decks",
      "Imperial Palace - Residence of the Japanese Imperial Family",
      "Shibuya Crossing - World's busiest pedestrian intersection",
      "Meiji Shrine - Peaceful Shinto shrine dedicated to Emperor Meiji",
      "Tsukiji Outer Market - Famous for fresh sushi and street food"
    ],
    culturalHighlights: [
      "Traditional tea ceremonies and cherry blossom viewing (hanami)",
      "Anime and manga culture in districts like Akihabara and Harajuku",
      "Exquisite Japanese cuisine from street food to Michelin-starred restaurants",
      "Sumo wrestling tournaments and traditional kabuki theater",
      "High-tech entertainment in gaming arcades and robot restaurants",
      "Zen gardens and traditional ryokan (inn) experiences"
    ],
    keyFacts: [
      "Population: 14 million (37 million metro area)",
      "Language: Japanese",
      "Currency: Japanese Yen (JPY)",
      "Time Zone: Japan Standard Time (JST)",
      "Best known for: Technology, anime culture, cuisine, and traditional arts"
    ],
    bestTimeToVisit: "March to May (spring) and September to November (autumn) offer the most comfortable weather. Spring brings the famous cherry blossoms, while autumn offers beautiful fall foliage. Summer can be hot and humid, while winter is mild but can be rainy."
  },

  "Rome": {
    name: "Rome",
    overview: "Rome, the Eternal City, stands as a living museum where ancient history meets modern Italian life. As the former heart of the Roman Empire and current capital of Italy, Rome offers an unparalleled journey through time, with every street corner revealing layers of history spanning over 2,500 years.",
    historicalImportance: "Founded in 753 BC according to legend, Rome grew from a small city-state to become the capital of an empire that stretched across three continents. It was the center of the Roman Empire, the birthplace of the Renaissance, and remains the spiritual center of the Catholic Church. Rome's influence on law, government, architecture, and culture continues to shape the modern world.",
    famousLandmarks: [
      "Colosseum - Ancient amphitheater where gladiators once fought",
      "Vatican City - Smallest country in the world and center of Catholicism",
      "Pantheon - Best-preserved Roman building with remarkable dome",
      "Roman Forum - Heart of ancient Roman political and social life",
      "Trevi Fountain - Baroque masterpiece where wishes come true",
      "Spanish Steps - Famous stairway and popular gathering place"
    ],
    culturalHighlights: [
      "Vatican Museums housing Sistine Chapel and Michelangelo's frescoes",
      "Authentic Italian cuisine with perfect pasta, pizza, and gelato",
      "Trastevere neighborhood's charming cobblestone streets and nightlife",
      "Villa Borghese gardens perfect for leisurely strolls",
      "Open-air markets and local artisan workshops",
      "Traditional Roman trattorias and wine bars"
    ],
    keyFacts: [
      "Population: 2.8 million (4.3 million metro area)",
      "Language: Italian",
      "Currency: Euro (EUR)",
      "Time Zone: Central European Time (CET)",
      "Best known for: Ancient history, art, architecture, and cuisine"
    ],
    bestTimeToVisit: "April to June and September to October offer ideal weather with comfortable temperatures and manageable crowds. Spring brings pleasant weather and blooming flowers, while autumn offers warm days and cooler evenings perfect for evening strolls."
  },

  "Mumbai": {
    name: "Mumbai",
    overview: "Mumbai, India's financial capital and the city of dreams, is a vibrant metropolis where tradition meets modernity. Known as Bollywood's home, this coastal city pulses with energy, offering everything from colonial architecture and bustling markets to gleaming skyscrapers and pristine beaches.",
    historicalImportance: "Originally seven islands inhabited by fishing communities, Mumbai was transformed by Portuguese and later British colonial rule. The opening of the Suez Canal in 1869 made Mumbai a crucial trading port. Post-independence, it became India's commercial hub and the center of the Indian film industry, earning global recognition.",
    famousLandmarks: [
      "Gateway of India - Iconic arch overlooking the Arabian Sea",
      "Chhatrapati Shivaji Terminus - UNESCO World Heritage railway station",
      "Marine Drive - Scenic promenade known as the Queen's Necklace",
      "Elephanta Caves - Ancient rock-cut temples on Elephanta Island",
      "Dhobi Ghat - World's largest outdoor laundry",
      "Haji Ali Dargah - Beautiful mosque connected by a causeway"
    ],
    culturalHighlights: [
      "Bollywood film studios and celebrity spotting opportunities",
      "Street food paradise with vada pav, pav bhaji, and dosa",
      "Crawford Market and Colaba Causeway for shopping experiences",
      "Juhu Beach for sunset views and beach activities",
      "Colonial architecture in Fort and Ballard Estate areas",
      "Vibrant nightlife in Bandra and Lower Parel"
    ],
    keyFacts: [
      "Population: 12.5 million (21 million metro area)",
      "Language: Hindi, Marathi, English",
      "Currency: Indian Rupee (INR)",
      "Time Zone: India Standard Time (IST)",
      "Best known for: Bollywood, business hub, street food, and diversity"
    ],
    bestTimeToVisit: "November to February offers the most pleasant weather with cool, dry conditions perfect for sightseeing. The monsoon season (June to September) brings heavy rains but also lush greenery. Avoid summer months (March to May) due to high humidity and heat."
  },

  "Delhi": {
    name: "Delhi",
    overview: "Delhi, India's capital territory, seamlessly blends the ancient with the contemporary, offering visitors a journey through over 1,000 years of history. From Mughal monuments to British colonial architecture and modern government buildings, Delhi tells the story of India's rich and complex past while embracing its dynamic future.",
    historicalImportance: "Delhi has been the seat of power for numerous empires and dynasties, including the Delhi Sultanate, Mughal Empire, and British Raj. The city has witnessed the rise and fall of eight different cities built on its soil. As the capital of modern India since 1911, Delhi has been central to the country's independence movement and democratic development.",
    famousLandmarks: [
      "Red Fort - Magnificent Mughal fortress and UNESCO World Heritage Site",
      "India Gate - War memorial honoring Indian soldiers",
      "Qutub Minar - Tallest brick minaret in the world",
      "Lotus Temple - Architectural marvel shaped like a lotus flower",
      "Humayun's Tomb - Precursor to the Taj Mahal",
      "Jama Masjid - One of India's largest mosques"
    ],
    culturalHighlights: [
      "Old Delhi's bustling bazaars including Chandni Chowk",
      "Diverse culinary scene from street food to fine dining",
      "Rich handicrafts and textiles in markets like Karol Bagh",
      "Classical Indian music and dance performances",
      "Rickshaw rides through narrow lanes of Old Delhi",
      "Museums showcasing India's art, history, and culture"
    ],
    keyFacts: [
      "Population: 11 million (30 million NCR)",
      "Language: Hindi, English, Punjabi, Urdu",
      "Currency: Indian Rupee (INR)",
      "Time Zone: India Standard Time (IST)",
      "Best known for: Historical monuments, government seat, and cultural diversity"
    ],
    bestTimeToVisit: "October to March offers the most comfortable weather with pleasant days and cool nights. Winter months (December to February) are ideal for sightseeing. Avoid summer (April to June) due to extreme heat and monsoon season for potential flooding."
  },

  "Kolkata": {
    name: "Kolkata",
    overview: "Kolkata, known as the 'City of Joy' and cultural capital of India, is a city where intellectual pursuits, artistic expression, and literary traditions flourish. Former capital of British India, Kolkata retains its colonial charm while embracing modernity, offering visitors a unique blend of history, culture, and warm Bengali hospitality.",
    historicalImportance: "Founded as Calcutta by the British East India Company in 1690, Kolkata served as the capital of British India until 1911. The city played a crucial role in the Indian independence movement and the Bengal Renaissance, a cultural and intellectual awakening that influenced modern Indian thought, literature, and social reform.",
    famousLandmarks: [
      "Victoria Memorial - Stunning white marble monument to Queen Victoria",
      "Howrah Bridge - Iconic cantilever bridge over the Hooghly River",
      "Dakshineswar Kali Temple - Sacred temple dedicated to Goddess Kali",
      "Indian Museum - One of the oldest and largest museums in Asia",
      "Mother House - Headquarters of Missionaries of Charity",
      "St. Paul's Cathedral - Beautiful Anglican cathedral"
    ],
    culturalHighlights: [
      "Adda culture - Art of informal conversation in coffee houses",
      "Bengali cuisine featuring fish curry, sweets, and street food",
      "Durga Puja festival - Grand celebration with artistic pandals",
      "Rabindra Sangeet - Musical tradition of Rabindranath Tagore",
      "College Street - Asia's largest book market",
      "Kumartuli - Potter's quarter where clay idols are crafted"
    ],
    keyFacts: [
      "Population: 4.5 million (15 million metro area)",
      "Language: Bengali, Hindi, English",
      "Currency: Indian Rupee (INR)",
      "Time Zone: India Standard Time (IST)",
      "Best known for: Literature, arts, Durga Puja, and intellectual heritage"
    ],
    bestTimeToVisit: "October to March offers the most pleasant weather with comfortable temperatures and low humidity. Winter months are perfect for exploring the city's outdoor attractions. The monsoon season (June to September) brings heavy rains but also the famous Durga Puja festival in October."
  }
};

// Helper function to get destination details by name
export const getDestinationDetails = (destinationName: string): DestinationDetails | undefined => {
  // Try exact match first
  let details = destinationDetails[destinationName];
  
  if (!details) {
    // Try case-insensitive match
    const normalizedName = destinationName.toLowerCase();
    const foundKey = Object.keys(destinationDetails).find(key => 
      key.toLowerCase() === normalizedName ||
      key.toLowerCase().includes(normalizedName) ||
      normalizedName.includes(key.toLowerCase())
    );
    
    if (foundKey) {
      details = destinationDetails[foundKey];
    }
  }
  
  return details;
};

// Helper function to get fallback destination details for unknown destinations
export const getFallbackDestinationDetails = (destinationName: string): DestinationDetails => {
  return {
    name: destinationName,
    overview: `${destinationName} is a captivating destination that offers a unique blend of culture, adventure, and natural beauty. This remarkable place provides visitors with unforgettable experiences through its distinctive character, local traditions, and scenic landscapes.`,
    historicalImportance: `${destinationName} has a rich historical background that has shaped its current identity. The area has been influenced by various cultures and civilizations throughout the centuries, creating a unique heritage that continues to attract visitors from around the world.`,
    famousLandmarks: [
      "Historic city center with traditional architecture",
      "Local cultural sites and museums", 
      "Scenic viewpoints and natural attractions",
      "Traditional markets and shopping districts"
    ],
    culturalHighlights: [
      "Local cuisine and traditional dining experiences",
      "Cultural festivals and seasonal celebrations",
      "Traditional arts and crafts demonstrations",
      "Local music and entertainment venues",
      "Community gatherings and social spaces"
    ],
    keyFacts: [
      "Local language and cultural customs",
      "Regional currency and practical information",
      "Climate and seasonal considerations", 
      "Transportation and accessibility options"
    ],
    bestTimeToVisit: "The ideal time to visit varies depending on local climate and seasonal attractions. Generally, shoulder seasons offer pleasant weather with fewer crowds and better value for accommodations and activities."
  };
};
