import { action } from "./_generated/server";
import { v } from "convex/values";

export const sendTripConfirmationEmail = action({
  args: {
    to: v.string(),
    userName: v.optional(v.string()),
    tripData: v.object({
      destination: v.string(),
      days: v.optional(v.number()),
      startDate: v.optional(v.string()),
      endDate: v.optional(v.string()),
      people: v.optional(v.number()),
      budget: v.number(),
      activities: v.optional(v.array(v.string())),
      travelWith: v.optional(v.string()),
    }),
    tripDetails: v.object({
      cityDescription: v.optional(v.string()),
      topActivities: v.optional(v.array(v.string())),
      localCuisine: v.optional(v.array(v.string())),
      packingList: v.optional(v.array(v.string())),
      weatherInfo: v.optional(v.object({
        temperature: v.string(),
        condition: v.string(),
        humidity: v.string(),
        windSpeed: v.string(),
        description: v.string(),
      })),      detailedItinerary: v.optional(v.array(v.object({
        day: v.number(),
        title: v.string(),
        morning: v.string(),
        afternoon: v.string(),
        evening: v.optional(v.string()), // Make evening optional for departure days
      }))),
      bestTimeToVisit: v.optional(v.string()),
      travelTips: v.optional(v.array(v.object({
        category: v.string(),
        title: v.string(),
        description: v.string(),
      }))),
      // Add the optional budget field to tripDetails validator
      budget: v.optional(v.object({
        accommodation: v.string(),
        food: v.string(),
        transportation: v.string(),
        activities: v.string(),
        total: v.string(),
      })),
    }),
  },
  handler: async (ctx, args) => {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    
    if (!RESEND_API_KEY || RESEND_API_KEY === 'your_resend_api_key_here') {
      console.error('RESEND_API_KEY is not configured properly');
      return { success: false, error: 'Email service not configured' };
    }

    try {
      // Generate email content
      const emailHtml = generateEmailTemplate(args.tripData, args.tripDetails, args.userName);
      
      // Send email using Resend API directly
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'JourneyCraft <onboarding@resend.dev>',
          to: [args.to],
          subject: `Your Trip to ${args.tripData.destination} is Ready! 🎉`,
          html: emailHtml,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Failed to send email:', result);
        return { success: false, error: result.message || 'Failed to send email' };
      }

      return { 
        success: true, 
        emailId: result.id,
        message: 'Trip confirmation email sent successfully'
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send email'
      };
    }
  },
});

function generateEmailTemplate(tripData: any, tripDetails: any, userName?: string): string {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatActivities = (activities?: string[]) => {
    if (!activities || activities.length === 0) return 'Various activities';
    
    const activityLabels: { [key: string]: string } = {
      'adventure': 'Adventure Sports 🏔️',
      'culture': 'Cultural Sites 🏛️',
      'food': 'Food & Dining 🍜',
      'nature': 'Nature & Wildlife 🦋',
      'shopping': 'Shopping 🛍️',
      'nightlife': 'Nightlife 🌃',
      'relaxation': 'Spa & Wellness 🧘',
      'photography': 'Photography 📸'
    };
    
    return activities.map(activity => activityLabels[activity] || activity).join(', ');
  };

  const formatTravelWith = (travelWith?: string) => {
    const companionLabels: { [key: string]: string } = {
      'family': 'Family with Kids 👨‍👩‍👧‍👦',
      'couple': 'Romantic Couple 💑',
      'friends': 'Friends Group 👥',
      'solo': 'Solo Travel 🚶‍♀️',
      'business': 'Business Travel 💼'
    };
    
    return companionLabels[travelWith || ''] || travelWith || 'Not specified';
  };

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Trip to ${tripData.destination}</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
      .container { max-width: 800px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; margin: -20px -20px 30px -20px; }
      .header h1 { margin: 0; font-size: 2.5em; }
      .header p { margin: 10px 0 0 0; font-size: 1.2em; opacity: 0.9; }
      .section { margin-bottom: 30px; }
      .section-title { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; margin: 0 0 20px 0; border-radius: 8px; font-size: 1.3em; font-weight: bold; }
      .trip-overview { background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 5px solid #667eea; }
      .overview-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
      .overview-item { text-align: center; }
      .overview-item strong { display: block; color: #667eea; font-size: 1.1em; margin-bottom: 5px; }
      .itinerary-day { background-color: #fff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
      .day-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px 15px; margin: -20px -20px 15px -20px; border-radius: 8px 8px 0 0; font-weight: bold; }
      .time-slot { margin-bottom: 15px; }
      .time-slot strong { color: #495057; }
      .activity-list { list-style: none; padding: 0; }
      .activity-list li { background-color: #f8f9fa; padding: 10px; margin: 8px 0; border-radius: 5px; border-left: 4px solid #667eea; }
      .tips-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
      .tip-card { background-color: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745; }
      .tip-card h4 { margin: 0 0 10px 0; color: #28a745; }
      .footer { text-align: center; margin-top: 40px; padding: 20px; background-color: #f8f9fa; border-radius: 8px; color: #6c757d; }
      .weather-info { background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%); color: white; padding: 15px; border-radius: 8px; text-align: center; }
      .packing-list { columns: 2; column-gap: 20px; }
      .packing-list li { break-inside: avoid; margin-bottom: 5px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🎉 Your Dream Trip Awaits!</h1>
        <p>Get ready for an amazing journey to ${tripData.destination}</p>
      </div>

      ${userName ? `<p style="font-size: 1.1em; margin-bottom: 30px;">Hello ${userName}! 👋</p>` : ''}

      <div class="section">
        <h2 class="section-title">📋 Trip Overview</h2>
        <div class="trip-overview">
          <div class="overview-grid">
            <div class="overview-item">
              <strong>🏖️ Destination</strong>
              <span>${tripData.destination}</span>
            </div>
            <div class="overview-item">
              <strong>📅 Duration</strong>
              <span>${tripData.days || 'Multiple'} Days</span>
            </div>
            <div class="overview-item">
              <strong>🗓️ Start Date</strong>
              <span>${formatDate(tripData.startDate)}</span>
            </div>
            <div class="overview-item">
              <strong>🏁 End Date</strong>
              <span>${formatDate(tripData.endDate)}</span>
            </div>
            <div class="overview-item">
              <strong>👥 Travelers</strong>
              <span>${tripData.people || 1} ${(tripData.people || 1) === 1 ? 'Person' : 'People'}</span>
            </div>
            <div class="overview-item">
              <strong>💰 Budget</strong>
              <span>$${tripData.budget?.toLocaleString() || 'Flexible'}</span>
            </div>
            <div class="overview-item">
              <strong>🎯 Travel Style</strong>
              <span>${formatTravelWith(tripData.travelWith)}</span>
            </div>
            <div class="overview-item">
              <strong>🎪 Activities</strong>
              <span>${formatActivities(tripData.activities)}</span>
            </div>
          </div>
        </div>
      </div>

      ${tripDetails?.weatherInfo ? `
      <div class="section">
        <h2 class="section-title">🌤️ Weather Information</h2>
        <div class="weather-info">
          <h3>Current Weather in ${tripData.destination}</h3>
          <p><strong>Temperature:</strong> ${tripDetails.weatherInfo.temperature}</p>
          <p><strong>Conditions:</strong> ${tripDetails.weatherInfo.condition}</p>
          <p><strong>Humidity:</strong> ${tripDetails.weatherInfo.humidity}</p>
          <p><strong>Wind Speed:</strong> ${tripDetails.weatherInfo.windSpeed}</p>
          <p><em>${tripDetails.weatherInfo.description}</em></p>
        </div>
      </div>
      ` : ''}

      ${tripDetails?.detailedItinerary && tripDetails.detailedItinerary.length > 0 ? `
      <div class="section">
        <h2 class="section-title">🗓️ Detailed Day-by-Day Itinerary</h2>
        ${tripDetails.detailedItinerary.map((day: any) => `
          <div class="itinerary-day">
            <div class="day-header">Day ${day.day}: ${day.title}</div>
            <div class="time-slot">
              <strong>🌅 Morning:</strong>
              <p>${day.morning}</p>
            </div>            <div class="time-slot">
              <strong>☀️ Afternoon:</strong>
              <p>${day.afternoon}</p>
            </div>
            ${day.evening ? `
            <div class="time-slot">
              <strong>🌆 Evening:</strong>
              <p>${day.evening}</p>
            </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${tripDetails?.topActivities && tripDetails.topActivities.length > 0 ? `
      <div class="section">
        <h2 class="section-title">🎯 Top Activities & Attractions</h2>
        <ul class="activity-list">
          ${tripDetails.topActivities.map((activity: string) => `<li>${activity}</li>`).join('')}
        </ul>
      </div>
      ` : ''}

      ${tripDetails?.localCuisine && tripDetails.localCuisine.length > 0 ? `
      <div class="section">
        <h2 class="section-title">🍽️ Must-Try Local Cuisine</h2>
        <ul class="activity-list">
          ${tripDetails.localCuisine.map((food: string) => `<li>${food}</li>`).join('')}
        </ul>
      </div>
      ` : ''}

      ${tripDetails?.packingList && tripDetails.packingList.length > 0 ? `
      <div class="section">
        <h2 class="section-title">🎒 Packing Checklist</h2>
        <ul class="packing-list">
          ${tripDetails.packingList.map((item: string) => `<li>✓ ${item}</li>`).join('')}
        </ul>
      </div>
      ` : ''}

      ${tripDetails?.travelTips && tripDetails.travelTips.length > 0 ? `
      <div class="section">
        <h2 class="section-title">💡 Travel Tips & Recommendations</h2>
        <div class="tips-grid">
          ${tripDetails.travelTips.map((tip: any) => `
            <div class="tip-card">
              <h4>${tip.title}</h4>
              <p>${tip.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

      <div class="footer">
        <h3>🌟 Have an Amazing Trip!</h3>
        <p>This itinerary was crafted specially for you by JourneyCraft. Safe travels and make wonderful memories!</p>
        <p style="margin-top: 20px; font-size: 0.9em;">
          <strong>Need help?</strong> Contact us at support@journeycraft.com<br>
          <strong>Happy travels!</strong> The JourneyCraft Team ✈️
        </p>
      </div>
    </div>
  </body>
  </html>
  `;
}
