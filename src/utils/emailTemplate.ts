interface TripData {
  destination: string;
  days: number;
  startDate?: string;
  endDate?: string;
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

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Not specified';
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatActivities = (activities: string[]) => {
  const activityLabels: { [key: string]: string } = {
    'adventure': '🏔️ Adventure Sports',
    'culture': '🏛️ Cultural Sites',
    'food': '🍜 Food & Dining',
    'nature': '🦋 Nature & Wildlife',
    'shopping': '🛍️ Shopping',
    'nightlife': '🌃 Nightlife',
    'relaxation': '🧘 Spa & Wellness',
    'photography': '📸 Photography'
  };
  
  return activities.map(activity => activityLabels[activity] || activity).join(', ');
};

const formatTravelWith = (travelWith: string) => {
  const travelLabels: { [key: string]: string } = {
    'family': 'Family with Kids',
    'couple': 'Romantic Couple',
    'friends': 'Friends Group',
    'solo': 'Solo Travel',
    'business': 'Business Travel'
  };
  
  return travelLabels[travelWith] || travelWith;
};

export const generateTripConfirmationEmail = (
  tripData: TripData, 
  tripDetails?: TripDetails,
  userName?: string
) => {
  const subject = `Your ${tripData.destination} Trip Plan is Ready! 🎉`;
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Trip Plan</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          background-color: #f8fafc;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 32px 24px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
        }
        .header p {
          margin: 8px 0 0 0;
          opacity: 0.9;
          font-size: 16px;
        }
        .content {
          padding: 32px 24px;
        }
        .section {
          margin-bottom: 32px;
        }
        .section h2 {
          color: #1f2937;
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 16px 0;
          padding-bottom: 8px;
          border-bottom: 2px solid #e5e7eb;
        }
        .trip-overview {
          background-color: #f8fafc;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
        }
        .trip-detail {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .trip-detail:last-child {
          border-bottom: none;
        }
        .trip-detail-label {
          font-weight: 600;
          color: #374151;
        }
        .trip-detail-value {
          color: #6b7280;
        }
        .itinerary-day {
          background-color: #f9fafb;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 16px;
        }
        .itinerary-day h3 {
          color: #1f2937;
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 12px 0;
        }
        .time-slot {
          margin-bottom: 12px;
        }
        .time-slot-title {
          font-weight: 600;
          color: #4f46e5;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .time-slot-content {
          color: #374151;
          margin-top: 4px;
        }
        .list-item {
          background-color: #f3f4f6;
          padding: 8px 12px;
          margin: 4px 0;
          border-radius: 6px;
          color: #374151;
        }
        .weather-info {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }
        .footer {
          background-color: #f8fafc;
          padding: 24px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        }
        .footer p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }
        .brand {
          color: #4f46e5;
          font-weight: 600;
          text-decoration: none;
        }
        .emoji {
          font-size: 1.2em;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌍 Your Trip Plan is Ready!</h1>
          <p>Get ready for an amazing adventure in ${tripData.destination}</p>
        </div>
        
        <div class="content">
          ${userName ? `<p>Hi ${userName},</p>` : '<p>Hello,</p>'}
          
          <p>Your personalized trip plan for <strong>${tripData.destination}</strong> has been generated! Here are all the details:</p>
          
          <div class="section">
            <h2>🎯 Trip Overview</h2>
            <div class="trip-overview">
              <div class="trip-detail">
                <span class="trip-detail-label">📍 Destination</span>
                <span class="trip-detail-value">${tripData.destination}</span>
              </div>
              <div class="trip-detail">
                <span class="trip-detail-label">📅 Duration</span>
                <span class="trip-detail-value">${tripData.days} days</span>
              </div>
              <div class="trip-detail">
                <span class="trip-detail-label">🗓️ Start Date</span>
                <span class="trip-detail-value">${formatDate(tripData.startDate)}</span>
              </div>
              <div class="trip-detail">
                <span class="trip-detail-label">🏁 End Date</span>
                <span class="trip-detail-value">${formatDate(tripData.endDate)}</span>
              </div>
              <div class="trip-detail">
                <span class="trip-detail-label">👥 Travelers</span>
                <span class="trip-detail-value">${tripData.people} people</span>
              </div>
              <div class="trip-detail">
                <span class="trip-detail-label">💰 Budget</span>
                <span class="trip-detail-value">$${tripData.budget.toLocaleString()}</span>
              </div>
              <div class="trip-detail">
                <span class="trip-detail-label">✈️ Travel Style</span>
                <span class="trip-detail-value">${formatTravelWith(tripData.travelWith)}</span>
              </div>
              <div class="trip-detail">
                <span class="trip-detail-label">🎯 Activities</span>
                <span class="trip-detail-value">${formatActivities(tripData.activities)}</span>
              </div>
            </div>
          </div>

          ${tripDetails ? `
            <div class="section">
              <h2>🏙️ About ${tripData.destination}</h2>
              <p>${tripDetails.cityDescription}</p>
            </div>

            ${tripDetails.weatherInfo ? `
              <div class="section">
                <h2>🌤️ Weather Information</h2>
                <div class="weather-info">
                  <h3>${tripDetails.weatherInfo.temperature} • ${tripDetails.weatherInfo.condition}</h3>
                  <p>${tripDetails.weatherInfo.description}</p>
                  <p><strong>Humidity:</strong> ${tripDetails.weatherInfo.humidity} | <strong>Wind:</strong> ${tripDetails.weatherInfo.windSpeed}</p>
                </div>
              </div>
            ` : ''}

            ${tripDetails.detailedItinerary?.length > 0 ? `
              <div class="section">
                <h2>📋 Day-by-Day Itinerary</h2>
                ${tripDetails.detailedItinerary.map(day => `
                  <div class="itinerary-day">
                    <h3>Day ${day.day}: ${day.title}</h3>
                    <div class="time-slot">
                      <div class="time-slot-title">🌅 Morning</div>
                      <div class="time-slot-content">${day.morning}</div>
                    </div>                    <div class="time-slot">
                      <div class="time-slot-title">☀️ Afternoon</div>
                      <div class="time-slot-content">${day.afternoon}</div>
                    </div>
                    ${day.evening ? `
                    <div class="time-slot">
                      <div class="time-slot-title">🌙 Evening</div>
                      <div class="time-slot-content">${day.evening}</div>
                    </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${tripDetails.topActivities?.length > 0 ? `
              <div class="section">
                <h2>🎯 Top Activities</h2>
                ${tripDetails.topActivities.map(activity => `
                  <div class="list-item">${activity}</div>
                `).join('')}
              </div>
            ` : ''}

            ${tripDetails.localCuisine?.length > 0 ? `
              <div class="section">
                <h2>🍽️ Local Cuisine to Try</h2>
                ${tripDetails.localCuisine.map(food => `
                  <div class="list-item">${food}</div>
                `).join('')}
              </div>
            ` : ''}

            ${tripDetails.packingList?.length > 0 ? `
              <div class="section">
                <h2>🧳 Packing List</h2>
                ${tripDetails.packingList.map(item => `
                  <div class="list-item">${item}</div>
                `).join('')}
              </div>
            ` : ''}

            ${tripDetails.travelTips?.length > 0 ? `
              <div class="section">
                <h2>💡 Travel Tips</h2>
                ${tripDetails.travelTips.map(tip => `
                  <div class="list-item">
                    <strong>${tip.title}</strong><br>
                    <span style="color: #6b7280;">${tip.description}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          ` : ''}
          
          <div class="section">
            <p>Have an amazing trip! Don't forget to create more personalized travel plans with <a href="#" class="brand">JourneyCraft</a>.</p>
          </div>
        </div>
        
        <div class="footer">
          <p>This email was sent by <a href="#" class="brand">JourneyCraft</a> - Your AI Travel Planning Assistant</p>
          <p>Happy travels! ✈️</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
};
