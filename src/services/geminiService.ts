import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Use faster model for better performance
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048, // Limit output for faster response
  }
});

export interface DestinationInfo {
  overview: string;
  historicalImportance: string;
  famousLandmarks: string[];
  culturalHighlights: string[];
  keyFacts: string[];
  bestTimeToVisit: string;
  activities: string[];
  cuisine: string[];
  packingTips: string[];
  localTips: string[];
}

export interface Testimonial {
  name: string;
  location: string;
  text: string;
  rating: number;
}

export interface PlaceDetail {
  name: string;
  description: string;
  category: string;
  highlights: string[];
  bestTimeToVisit: string;
  entryFee: string;
  duration: string;
  nearbyAttractions: string[];
  localTips: string[];
}

export interface ActivityOption {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export interface ComprehensiveTripDetails {
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
  placesToVisit: Array<{
    name: string;
    description: string;
    category: string;
    coordinates?: { lat: number; lng: number };
  }>;
  transportation: {
    local: string[];
    intercity: string[];
    tips: string[];
  };
  budget: {
    accommodation: string;
    food: string;
    transportation: string;
    activities: string;
    total: string;
  };
}

class GeminiService {
  private isApiKeyValid(): boolean {
    return apiKey;
  }

  /**
   * Generate comprehensive destination information
   */
  async getDestinationInfo(destination: string, days: number): Promise<DestinationInfo | null> {
    if (!this.isApiKeyValid()) {
      console.warn('Gemini API key not configured, using fallback data');
      return null;
    }

    try {
      const prompt = `
        Please provide comprehensive travel information for ${destination} for a ${days}-day trip. 
        Respond in JSON format with the following structure:
        {
          "overview": "200-word engaging overview of the destination",
          "historicalImportance": "Brief historical significance",
          "famousLandmarks": ["landmark1", "landmark2", "landmark3", "landmark4", "landmark5"],
          "culturalHighlights": ["culture1", "culture2", "culture3", "culture4"],
          "keyFacts": ["fact1", "fact2", "fact3", "fact4", "fact5"],
          "bestTimeToVisit": "Best time to visit with reasoning",
          "activities": ["activity1", "activity2", "activity3", "activity4", "activity5"],
          "cuisine": ["dish1", "dish2", "dish3", "dish4", "dish5"],
          "packingTips": ["tip1", "tip2", "tip3", "tip4", "tip5"],
          "localTips": ["tip1", "tip2", "tip3", "tip4", "tip5"]
        }
        
        Make it specific to ${destination}, informative, and engaging for travelers.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response (remove markdown formatting if present)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return null;
    } catch (error) {
      console.error('Error generating destination info with Gemini:', error);
      return null;
    }
  }

  /**
   * Generate realistic testimonials for a destination
   */
  async generateTestimonials(destination: string, count: number = 3): Promise<Testimonial[] | null> {
    if (!this.isApiKeyValid()) {
      console.warn('Gemini API key not configured, using fallback testimonials');
      return null;
    }

    try {
      const prompt = `
        Generate ${count} realistic travel testimonials for ${destination}. 
        Make them sound authentic from Indian travelers with different perspectives.
        Respond in JSON format as an array:
        [
          {
            "name": "Indian name",
            "location": "Indian city, India",
            "text": "Authentic 2-3 sentence testimonial about their experience",
            "rating": 4 or 5
          }
        ]
        
        Make each testimonial unique, specific to ${destination}, and authentic sounding.
        Include specific details about attractions, food, or experiences they had.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return null;
    } catch (error) {
      console.error('Error generating testimonials with Gemini:', error);
      return null;
    }
  }

  /**
   * Generate detailed day-by-day itinerary
   */  async generateItinerary(
    destination: string, 
    days: number, 
    budget: string, 
    activities: string[], 
    // travelWith: string
  ): Promise<string[] | null> {
    if (!this.isApiKeyValid()) {
      return null;
    }

    try {
      const prompt = `
        Create a detailed ${days}-day itinerary for ${destination}.
        
        Trip details:
        - Budget: ${budget}
        - Preferred activities: ${activities.join(', ')}
        
        For each day, structure the response with clearly marked time periods:
        
        Morning: [Detailed morning activities with specific places, timings (9:00 AM - 12:00 PM), and transportation]
        
        Afternoon: [Detailed afternoon activities with specific places, timings (1:00 PM - 5:00 PM), meal suggestions, and transportation]
        
        Evening: [Detailed evening activities with specific places, timings (6:00 PM - 9:00 PM), dinner suggestions, and leisure activities]
        
        Respond as a JSON array where each element is a day's plan:
        [
          "Day 1: Morning: Visit the historic city center, explore the main cathedral (9:00 AM - 11:00 AM), walk through the old market square (11:00 AM - 12:00 PM). Take local bus or walk. Afternoon: Lunch at traditional restaurant, visit the art museum (1:00 PM - 3:00 PM), stroll through botanical gardens (3:00 PM - 5:00 PM). Evening: Sunset at the viewpoint (6:00 PM - 7:00 PM), dinner at riverside restaurant (7:30 PM - 9:00 PM).",
          "Day 2: Morning: [specific morning plan] Afternoon: [specific afternoon plan] Evening: [specific evening plan]",
          ...
        ]
        
        Make it practical, budget-appropriate, and tailored to their interests.
        Include specific timings, transportation tips, meal suggestions, and local insider tips.
        Ensure each time period (Morning, Afternoon, Evening) has substantial, detailed content.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return null;
    } catch (error) {
      console.error('Error generating itinerary with Gemini:', error);
      return null;
    }
  }

  /**
   * Generate weather information and tips
   */
  async getWeatherAdvice(destination: string, startDate: string, endDate: string): Promise<string | null> {
    if (!this.isApiKeyValid()) {
      return null;
    }

    try {
      const prompt = `
        Provide weather advice for traveling to ${destination} from ${startDate} to ${endDate}.
        Include:
        - Expected weather conditions
        - What to pack for the weather
        - Best activities for the season
        - Any weather-related travel tips
        
        Keep it concise but informative (150-200 words).
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating weather advice with Gemini:', error);
      return null;
    }
  }

  /**
   * Generate detailed places information with rich content
   */
  async getPlacesDetails(destination: string, places: string[]): Promise<PlaceDetail[] | null> {
    if (!this.isApiKeyValid()) {
      console.warn('Gemini API key not configured, using fallback places data');
      return null;
    }

    try {
      const placesText = places.join(', ');
      const prompt = `
        Provide detailed information for the top places to visit in ${destination}. 
        Focus on these places if available: ${placesText}
        But also include other must-visit attractions in ${destination}.
        
        Respond in JSON format as an array of objects:
        [
          {
            "name": "Place name",
            "description": "Rich 2-3 sentence description highlighting what makes this place special",
            "category": "Historical/Religious/Natural/Cultural/Entertainment/Shopping",
            "highlights": ["highlight1", "highlight2", "highlight3"],
            "bestTimeToVisit": "Best time to visit this specific place",
            "entryFee": "Entry fee information or 'Free' if no fee",
            "duration": "Recommended visit duration",
            "nearbyAttractions": ["nearby1", "nearby2"],
            "localTips": ["tip1", "tip2", "tip3"]
          }
        ]
        
        Include 8-10 places total, making them informative and engaging for travelers visiting ${destination}.
        Ensure descriptions are rich and highlight unique features, historical significance, or cultural importance.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response (remove markdown formatting if present)
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return null;
    } catch (error) {
      console.error('Error generating places details with Gemini:', error);
      return null;
    }
  }

  /**
   * Generate local cuisine recommendations
   */
  async getCuisineRecommendations(destination: string): Promise<string[] | null> {
    if (!this.isApiKeyValid()) {
      return null;
    }

    try {
      const prompt = `
        List the top 8-10 must-try local dishes and food experiences in ${destination}.
        Respond as a JSON array of strings:
        ["dish name - brief description", "dish name - brief description", ...]
        
        Include both famous dishes and hidden local gems.
        Make descriptions appetizing and informative.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return null;
    } catch (error) {
      console.error('Error generating cuisine recommendations with Gemini:', error);
      return null;
    }
  }

  /**
   * Generate destination-specific activity options
   */
  async generateActivityOptions(destination: string): Promise<ActivityOption[] | null> {
    if (!this.isApiKeyValid()) {
      return null;
    }

    try {
      const prompt = `
        Generate 8 diverse activity categories for travelers visiting ${destination}.
        Consider the destination's unique offerings, culture, and attractions.
        
        Respond in JSON format as an array:
        [
          {
            "id": "adventure",
            "label": "Adventure & Sports",
            "icon": "⛰️",
            "description": "Specific adventure activities available in ${destination}"
          },
          {
            "id": "cultural",
            "label": "Cultural Sites",
            "icon": "🏛️", 
            "description": "Historical and cultural attractions in ${destination}"
          }
        ]
        
        Make each category specific to what ${destination} actually offers.
        Use appropriate emojis for icons.
        Keep descriptions concise but destination-specific.
        Include categories like: adventure, cultural sites, food & dining, nature, shopping, nightlife, photography, spa & wellness.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return null;
    } catch (error) {
      console.error('Error generating activity options with Gemini:', error);
      return null;
    }
  }

  /**
   * Generate budget suggestions for destination
   */
  async getBudgetSuggestions(destination: string, days: number, people: number): Promise<{
    economical: string;
    moderate: string;
    luxury: string;
    description: string;
  } | null> {
    if (!this.isApiKeyValid()) {
      return null;
    }

    try {
      const prompt = `
        Provide realistic budget ranges for a ${days}-day trip to ${destination} for ${people} people.
        Consider current prices for accommodation, food, transportation, and activities.
        
        Respond in JSON format:
        {
          "economical": "₹X,XXX - ₹X,XXX per person",
          "moderate": "₹X,XXX - ₹X,XXX per person", 
          "luxury": "₹X,XXX - ₹X,XXX per person",
          "description": "Brief explanation of what each budget range includes for ${destination}"
        }
        
        Use realistic Indian Rupee amounts based on current travel costs to ${destination}.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return null;
    } catch (error) {
      console.error('Error generating budget suggestions:', error);
      return null;
    }
  }

  /**
   * Generate comprehensive trip details with AI
   */
  async generateTripDetails(tripData: {
    destination: string;
    days: number;
    budget: string;
    activities: string[];
    travelWith: string;
    people: number;
  }): Promise<ComprehensiveTripDetails | null> {
    if (!this.isApiKeyValid()) {
      return null;
    }

    try {
      const { destination, days, budget, activities, travelWith, people } = tripData;
      const activitiesText = activities.join(', ');        const prompt = `
        Create a comprehensive ${days}-day trip plan for ${destination} for ${people} ${travelWith} travelers with budget ${budget}.
        Preferred activities: ${activitiesText}
        
        IMPORTANT: Respond ONLY with valid JSON format. Do not include any text before or after the JSON. 
        Use double quotes for all strings. Escape any quotes within strings properly.
        
        JSON Response Format:
        {
          "cityDescription": "Engaging 200-word description of ${destination}",
          "topActivities": ["activity1", "activity2", "activity3", "activity4", "activity5", "activity6", "activity7"],
          "localCuisine": ["dish1 - description", "dish2 - description", "dish3 - description", "dish4 - description", "dish5 - description"],
          "packingList": ["Essential item 1 for ${destination}", "Weather-appropriate item 2", "Cultural consideration item 3", "Activity-specific item 4", "Local customs item 5", "Health & safety item 6", "Technology item 7", "Documentation item 8", "Comfort item 9", "Emergency item 10"],
          "weatherInfo": {
            "temperature": "Current typical temperature for ${destination}",
            "condition": "Weather condition",
            "humidity": "Humidity level",
            "windSpeed": "Wind speed",
            "description": "Weather description for travel planning"
          },
          "detailedItinerary": [
            {
              "day": 1,
              "title": "Day 1 title",
              "morning": "Morning activities (9:00 AM - 12:00 PM)",
              "afternoon": "Afternoon activities (1:00 PM - 5:00 PM)",
              "evening": "Evening activities (6:00 PM - 9:00 PM)"
            }
          ],
          "bestTimeToVisit": "Detailed explanation of the best time to visit ${destination} considering weather, crowds, prices, festivals, and seasonal attractions. Include specific months and reasons why they are optimal.",
          "travelTips": [
            {
              "category": "Transportation",
              "title": "Tip title",
              "description": "Tip description"
            },
            {
              "category": "Culture",
              "title": "Tip title", 
              "description": "Tip description"
            },
            {
              "category": "Safety",
              "title": "Tip title",
              "description": "Tip description"
            }
          ],
          "placesToVisit": [
            {
              "name": "Place name",
              "description": "Place description",
              "category": "attraction/cultural/natural/historical"
            }
          ],
          "transportation": {
            "local": ["Transportation option 1", "Transportation option 2", "Transportation option 3"],
            "intercity": ["Intercity option 1", "Intercity option 2"],
            "tips": ["Transport tip 1", "Transport tip 2", "Transport tip 3"]
          },
          "budget": {
            "accommodation": "₹X,XXX - ₹X,XXX",
            "food": "₹X,XXX - ₹X,XXX per person",
            "transportation": "₹X,XXX - ₹X,XXX",
            "activities": "₹X,XXX - ₹X,XXX",
            "total": "₹X,XXX (estimated for ${people} ${people === 1 ? 'person' : 'people'})"
          }
        }
          Generate exactly ${days} days in the detailedItinerary array.
        For departure days (usually the last day), evening activities are optional and can be omitted if travelers are departing.
        Focus on the preferred activities: ${activitiesText}.
        Make the packingList specific to ${destination}'s climate, culture, and the selected activities.
        Make the bestTimeToVisit specific to ${destination} with detailed reasoning about weather patterns, tourist seasons, local events, and costs.
        Make it specific to ${destination} and realistic for ${people} ${travelWith} travelers.
        Ensure all strings are properly escaped and quoted.
      `;const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('Raw Gemini response:', text);
      
      // Try to extract and clean JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        let jsonString = jsonMatch[0];
        
        try {
          // First attempt: direct parsing
          return JSON.parse(jsonString);
        } catch (parseError) {
          console.warn('Direct JSON parsing failed, attempting to clean JSON:', parseError);
            try {
            // Clean common JSON issues
            jsonString = jsonString
              // Remove any markdown code block markers
              .replace(/```json\s*/g, '')
              .replace(/```\s*/g, '')
              // Fix unescaped quotes in strings - more careful approach
              .replace(/(?<!\\)"(?=[^"]*"[^"]*$)/g, '\\"')
              // Fix single quotes to double quotes
              .replace(/'/g, '"')
              // Remove trailing commas before closing brackets
              .replace(/,(\s*[}\]])/g, '$1')
              // Fix newlines in string values
              .replace(/(\s*"[^"]*?)(\n|\r\n|\r)([^"]*?"\s*)/g, '$1\\n$3')
              // Fix tabs in string values
              .replace(/(\s*"[^"]*?)(\t)([^"]*?"\s*)/g, '$1\\t$3')
              // Remove control characters that break JSON
              .replace(/[\x00-\x1F\x7F]/g, '')
              // Ensure proper spacing around colons and commas
              .replace(/:\s*(["\[\{])/g, ': $1')
              .replace(/,\s*(["\[\{])/g, ', $1');
            
            console.log('Cleaned JSON string:', jsonString);
            return JSON.parse(jsonString);
          } catch (cleanError) {
            console.error('JSON cleaning failed:', cleanError);
            
            // Final fallback: try to create a minimal valid structure
            return this.createFallbackTripDetails(tripData);
          }
        }
      }
      
      console.warn('No JSON found in Gemini response, using fallback');
      return this.createFallbackTripDetails(tripData);
    } catch (error) {
      console.error('Error generating comprehensive trip details with Gemini:', error);
      return this.createFallbackTripDetails(tripData);
    }
  }  private createFallbackTripDetails(tripData: {
    destination: string;
    days: number;
    people: number;
    budget: string | number;
    activities: string[];
    travelWith: string;
  }): ComprehensiveTripDetails {
    const { destination, days, activities, budget, people } = tripData;
    const budgetAmount = typeof budget === 'string' ? parseFloat(budget) || 2000 : budget;
    
    return {
      cityDescription: `${destination} is a fascinating destination that offers a perfect blend of culture, history, and modern attractions. This vibrant location provides visitors with unique experiences, from exploring local landmarks to enjoying authentic cuisine. Whether you're interested in adventure, relaxation, or cultural immersion, ${destination} has something special to offer every traveler.`,
      
      topActivities: [
        ...activities.slice(0, 4).map(activity => `Experience ${activity.replace(/([A-Z])/g, ' $1').toLowerCase()}`),
        "Explore local markets and shopping areas",
        "Visit cultural landmarks and museums", 
        "Experience local cuisine and dining"
      ].slice(0, 7),
      
      localCuisine: [
        "Local specialty dishes with authentic flavors",
        "Traditional street food and snacks",
        "Regional delicacies and seasonal specialties",
        "Popular beverages and refreshments",
        "Desserts and sweet treats unique to the area"
      ],
        packingList: [
        `Comfortable walking shoes suitable for ${destination}`,
        `Weather-appropriate clothing for ${destination} climate`,
        "Light jacket or sweater for air conditioning and evening weather",
        "Sunglasses and sunscreen for outdoor activities",
        "Portable phone charger and power bank",
        "Basic first aid kit and personal medications",
        "Camera or smartphone for capturing memories",
        "Local currency, international cards, and backup payment methods",
        "Travel documents, ID, and digital copies stored securely",
        `Day backpack for exploring ${destination}`,
        "Comfortable sleepwear and undergarments",
        "Personal hygiene items and travel-sized toiletries"
      ],
      
      weatherInfo: {
        temperature: "Pleasant and suitable for travel",
        condition: "Generally favorable",
        humidity: "Moderate levels",
        windSpeed: "Light to moderate",
        description: "Weather conditions are typically good for outdoor activities and sightseeing"
      },
      
      detailedItinerary: Array.from({ length: days }, (_, index) => ({
        day: index + 1,
        title: `Day ${index + 1}: Explore ${destination}`,
        morning: "Start the day with breakfast and visit morning attractions (9:00 AM - 12:00 PM)",
        afternoon: "Explore local sites and enjoy lunch at a recommended restaurant (1:00 PM - 5:00 PM)",
        evening: "Experience local culture and dining options (6:00 PM - 9:00 PM)"
      })),
      
      bestTimeToVisit: `The optimal time to visit ${destination} depends on several factors including weather patterns, tourist seasons, and local events. Generally, moderate weather months offer the best experience for outdoor activities and sightseeing. Consider visiting during shoulder seasons for better prices and fewer crowds, while avoiding extreme weather periods. Research local festivals and seasonal attractions that might enhance your ${destination} experience during your planned travel dates.`,
      
      travelTips: [
        {
          category: "Transportation",
          title: "Getting Around",
          description: "Use local transportation options and plan routes in advance for efficient travel."
        },
        {
          category: "Culture",
          title: "Local Customs",
          description: "Respect local traditions and customs to enhance your travel experience."
        },
        {
          category: "Safety",
          title: "Stay Safe",
          description: "Keep important documents secure and be aware of your surroundings."
        },
        {
          category: "Budget",
          title: "Money Matters",
          description: "Keep track of expenses and have multiple payment options available."
        }
      ],

      placesToVisit: [
        {
          name: `${destination} City Center`,
          description: "The heart of the city with main attractions and landmarks",
          category: "landmark"
        },
        {
          name: "Local Market",
          description: "Traditional market offering local products and souvenirs",
          category: "shopping"
        },
        {
          name: "Cultural District",
          description: "Area rich in history and cultural significance",
          category: "culture"
        },
        {
          name: "Scenic Viewpoint",
          description: "Beautiful vantage point offering panoramic views",
          category: "nature"
        }
      ],

      transportation: {
        local: [
          "Public buses and metro systems",
          "Taxis and ride-sharing services",
          "Walking and cycling options",
          "Local transport cards and passes"
        ],
        intercity: [
          "Train connections to nearby cities",
          "Bus services for regional travel",
          "Domestic flights if applicable",
          "Car rental options"
        ],
        tips: [
          "Download transportation apps for easier navigation",
          "Keep cash for smaller transport operators",
          "Plan routes in advance during peak hours",
          "Consider multi-day transport passes for savings"
        ]
      },

      budget: {
        accommodation: `₹${Math.round(budgetAmount * 0.4).toLocaleString()} - ${Math.round(budgetAmount * 0.5).toLocaleString()}`,
        food: `₹${Math.round(budgetAmount * 0.25 / people).toLocaleString()} - ${Math.round(budgetAmount * 0.3 / people).toLocaleString()} per person`,
        transportation: `₹${Math.round(budgetAmount * 0.15).toLocaleString()} - ${Math.round(budgetAmount * 0.2).toLocaleString()}`,
        activities: `₹${Math.round(budgetAmount * 0.15).toLocaleString()} - ${Math.round(budgetAmount * 0.2).toLocaleString()}`,
        total: `₹${budgetAmount.toLocaleString()} (estimated for ${people} ${people === 1 ? 'person' : 'people'})`
      }
    };
  }

  /**
   * Generate destination-specific packing list
   */
  async generatePackingList(destination: string, activities: string[], days: number, startDate?: string): Promise<string[] | null> {
    if (!this.isApiKeyValid()) {
      return null;
    }

    try {
      const activitiesText = activities.join(', ');
      const dateInfo = startDate ? ` during ${new Date(startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : '';
      
      const prompt = `
        Create a comprehensive packing list for a ${days}-day trip to ${destination}${dateInfo}.
        Preferred activities: ${activitiesText}
        
        Consider:
        - Local climate and weather conditions
        - Cultural dress codes and customs
        - Specific activity requirements
        - Local shopping availability
        - Health and safety needs
        
        Respond in JSON format as an array of strings:
        ["Essential item 1 with emoji", "Item 2 specific to ${destination}", "Activity-specific item 3", ...]
        
        Include 10-12 items that are specifically relevant to ${destination} and the planned activities.
        Add appropriate emojis to make it visually appealing.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return null;
    } catch (error) {
      console.error('Error generating packing list with Gemini:', error);
      return null;
    }
  }

  /**
   * Generate destination-specific best time to visit information
   */
  async generateBestTimeToVisit(destination: string, activities: string[]): Promise<string | null> {
    if (!this.isApiKeyValid()) {
      return null;
    }

    try {
      const activitiesText = activities.join(', ');
      
      const prompt = `
        Provide detailed information about the best time to visit ${destination} for travelers interested in: ${activitiesText}
        
        Include:
        - Optimal months and seasons with specific reasoning
        - Weather patterns and climate considerations
        - Peak vs off-peak tourist seasons
        - Local festivals and events that enhance the experience
        - Price variations throughout the year
        - Activity-specific timing recommendations
        - Any months or seasons to avoid and why
        
        Provide a comprehensive 200-300 word response that helps travelers make informed decisions about when to visit ${destination}.
        Focus on practical advice specific to ${destination}.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error generating best time to visit with Gemini:', error);
      return null;
    }
  }

  /**
   * Progressive trip generation - Break down into smaller, faster API calls
   */
  async generateTripDetailsProgressive(
    tripData: {
      destination: string;
      days: number;
      budget: string;
      activities: string[];
      travelWith: string;
      people: number;
    },
    onProgressUpdate?: (step: string, data: any) => void
  ): Promise<ComprehensiveTripDetails | null> {
    if (!this.isApiKeyValid()) {
      return null;
    }

    try {
      const { destination, days, budget, activities, travelWith, people } = tripData;
      const activitiesText = activities.join(', ');
      
      // Step 1: Basic Info (fast)
      onProgressUpdate?.('Analyzing destination...', null);
      const basicInfo = await this.generateBasicTripInfo(destination, days, people, travelWith);
      onProgressUpdate?.('basic-info', basicInfo);
      
      // Step 2: Activities & Places (medium)
      onProgressUpdate?.('Finding activities...', null);
      const activitiesData = await this.generateActivitiesAndPlaces(destination, activities, days);
      onProgressUpdate?.('activities', activitiesData);
      
      // Step 3: Itinerary (medium-fast)
      onProgressUpdate?.('Creating itinerary...', null);
      const itinerary = await this.generateDailyItinerary(destination, days, activities, people);
      onProgressUpdate?.('itinerary', itinerary);
      
      // Step 4: Practical Info (fast)
      onProgressUpdate?.('Gathering practical info...', null);
      const practicalInfo = await this.generatePracticalInfo(destination, budget, people, days);
      onProgressUpdate?.('practical-info', practicalInfo);
      
      // Step 5: Combine all data
      onProgressUpdate?.('Finalizing details...', null);
      const combinedData: ComprehensiveTripDetails = {
        cityDescription: basicInfo.cityDescription,
        topActivities: activitiesData.topActivities,
        localCuisine: practicalInfo.localCuisine,
        packingList: practicalInfo.packingList,
        weatherInfo: practicalInfo.weatherInfo,
        detailedItinerary: itinerary,
        bestTimeToVisit: basicInfo.bestTimeToVisit,
        travelTips: practicalInfo.travelTips,
        placesToVisit: activitiesData.placesToVisit,
        transportation: practicalInfo.transportation,
        budget: practicalInfo.budget
      };
      
      onProgressUpdate?.('complete', combinedData);
      return combinedData;
      
    } catch (error) {
      console.error('Error in progressive trip generation:', error);
      return this.createFallbackTripDetails(tripData);
    }
  }

  /**
   * Generate basic trip information (fast call)
   */
  private async generateBasicTripInfo(destination: string, days: number, people: number, travelWith: string) {
    const prompt = `
      Create basic trip information for ${destination} for ${days} days for ${people} ${travelWith} travelers.
      
      Respond ONLY with valid JSON:
      {
        "cityDescription": "Engaging 150-word description of ${destination}",
        "bestTimeToVisit": "Best time to visit ${destination} with specific months and brief reasons"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        return {
          cityDescription: `${destination} is a fascinating destination offering rich cultural experiences, stunning landscapes, and memorable adventures for travelers.`,
          bestTimeToVisit: "The best time to visit varies by season - please check local weather patterns for optimal travel dates."
        };
      }
    }
    
    return {
      cityDescription: `${destination} is a fascinating destination offering rich cultural experiences, stunning landscapes, and memorable adventures for travelers.`,
      bestTimeToVisit: "The best time to visit varies by season - please check local weather patterns for optimal travel dates."
    };
  }

  /**
   * Generate activities and places (medium speed call)
   */
  private async generateActivitiesAndPlaces(destination: string, activities: string[], days: number) {
    const activitiesText = activities.join(', ');
    const prompt = `
      Create activities and places for ${destination} focusing on: ${activitiesText}
      
      Respond ONLY with valid JSON:
      {
        "topActivities": ["activity1", "activity2", "activity3", "activity4", "activity5", "activity6"],
        "placesToVisit": [
          {
            "name": "Place name",
            "description": "Brief description",
            "category": "attraction"
          },
          {
            "name": "Place name 2",
            "description": "Brief description",
            "category": "cultural"
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        return {
          topActivities: activities.length > 0 ? activities : ["Sightseeing", "Local cuisine", "Cultural exploration"],
          placesToVisit: [
            { name: "Main Attraction", description: "Must-visit landmark", category: "attraction" },
            { name: "Cultural Site", description: "Local cultural experience", category: "cultural" }
          ]
        };
      }
    }
    
    return {
      topActivities: activities.length > 0 ? activities : ["Sightseeing", "Local cuisine", "Cultural exploration"],
      placesToVisit: [
        { name: "Main Attraction", description: "Must-visit landmark", category: "attraction" },
        { name: "Cultural Site", description: "Local cultural experience", category: "cultural" }
      ]
    };
  }

  /**
   * Generate daily itinerary (medium-fast call)
   */
  private async generateDailyItinerary(destination: string, days: number, activities: string[], people: number) {
    const activitiesText = activities.join(', ');
    const prompt = `
      Create a ${days}-day itinerary for ${destination} for ${people} travelers focusing on: ${activitiesText}
      
      Respond ONLY with valid JSON array:
      [
        {
          "day": 1,
          "title": "Day 1 - Arrival & Exploration",
          "morning": "Morning activities (9:00 AM - 12:00 PM)",
          "afternoon": "Afternoon activities (1:00 PM - 5:00 PM)",
          "evening": "Evening activities (6:00 PM - 9:00 PM)"
        }
      ]
      
      Generate exactly ${days} days.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        return this.generateFallbackItinerary(days);
      }
    }
    
    return this.generateFallbackItinerary(days);
  }

  /**
   * Generate practical information (fast call)
   */
  private async generatePracticalInfo(destination: string, budget: string, people: number, days: number) {
    const prompt = `
      Create practical travel information for ${destination} for ${people} travelers, budget ${budget}, ${days} days.
      
      Respond ONLY with valid JSON:
      {
        "localCuisine": ["dish1 - description", "dish2 - description", "dish3 - description"],
        "packingList": ["item1", "item2", "item3", "item4", "item5"],
        "weatherInfo": {
          "temperature": "20-25°C",
          "condition": "Pleasant",
          "humidity": "Moderate",
          "windSpeed": "Light",
          "description": "Weather description"
        },
        "travelTips": [
          {
            "category": "Transportation",
            "title": "Tip title",
            "description": "Tip description"
          }
        ],
        "transportation": {
          "local": ["option1", "option2"],
          "intercity": ["option1", "option2"],
          "tips": ["tip1", "tip2"]
        },
        "budget": {
          "accommodation": "₹${Math.round(parseInt(budget) * 0.4)} - ₹${Math.round(parseInt(budget) * 0.6)}",
          "food": "₹${Math.round(parseInt(budget) * 0.2)} - ₹${Math.round(parseInt(budget) * 0.3)}",
          "transportation": "₹${Math.round(parseInt(budget) * 0.1)} - ₹${Math.round(parseInt(budget) * 0.2)}",
          "activities": "₹${Math.round(parseInt(budget) * 0.1)} - ₹${Math.round(parseInt(budget) * 0.2)}",
          "total": "₹${budget} (estimated for ${people} ${people === 1 ? 'person' : 'people'})"
        }
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        return this.generateFallbackPracticalInfo(destination, budget, people);
      }
    }
    
    return this.generateFallbackPracticalInfo(destination, budget, people);
  }

  /**
   * Fallback methods for when API calls fail
   */
  private generateFallbackItinerary(days: number) {
    const itinerary = [];
    for (let day = 1; day <= days; day++) {
      itinerary.push({
        day: day,
        title: `Day ${day} - Exploration`,
        morning: "Morning exploration and sightseeing (9:00 AM - 12:00 PM)",
        afternoon: "Afternoon activities and local experiences (1:00 PM - 5:00 PM)",
        evening: day === days ? "Preparation for departure" : "Evening leisure and dining (6:00 PM - 9:00 PM)"
      });
    }
    return itinerary;
  }

  private generateFallbackPracticalInfo(destination: string, budget: string, people: number) {
    return {
      localCuisine: ["Local specialties", "Traditional dishes", "Regional cuisine"],
      packingList: ["Comfortable walking shoes", "Weather-appropriate clothing", "Camera", "Travel documents", "Personal essentials"],
      weatherInfo: {
        temperature: "Pleasant",
        condition: "Variable",
        humidity: "Moderate",
        windSpeed: "Light",
        description: "Check local weather before travel"
      },
      travelTips: [
        {
          category: "General",
          title: "Plan ahead",
          description: "Research local customs and attractions"
        }
      ],
      transportation: {
        local: ["Public transport", "Taxi services"],
        intercity: ["Bus", "Train"],
        tips: ["Book in advance", "Keep tickets safe"]
      },
      budget: {
        accommodation: `₹${Math.round(parseInt(budget) * 0.4)} - ₹${Math.round(parseInt(budget) * 0.6)}`,
        food: `₹${Math.round(parseInt(budget) * 0.2)} - ₹${Math.round(parseInt(budget) * 0.3)}`,
        transportation: `₹${Math.round(parseInt(budget) * 0.1)} - ₹${Math.round(parseInt(budget) * 0.2)}`,
        activities: `₹${Math.round(parseInt(budget) * 0.1)} - ₹${Math.round(parseInt(budget) * 0.2)}`,
        total: `₹${budget} (estimated for ${people} ${people === 1 ? 'person' : 'people'})`
      }
    };
  }
}

export const geminiService = new GeminiService();
