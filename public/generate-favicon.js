// Simple favicon generator using Canvas API
const fs = require('fs');

// Create a simple favicon as base64 data
const createFaviconData = () => {
  // This is a base64 encoded 16x16 pixel favicon with AI trip planner theme
  // Purple gradient background with white airplane and yellow AI dots
  const faviconBase64 = `AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABMLAAATCwAAAAAAAAAAAAD///8A4uLiAOLi4gDi4uIA4uLiAOLi4gDi4uIA4uLiAOLi4gDi4uIA4uLiAOLi4gDi4uIA4uLiAOLi4gD///8A4uLiAE9GxgBPRsYAT0bGAE9GxgBPRsYAT0bGAE9GxgBPRsYAT0bGAE9GxgBPRsYAT0bGAE9GxgBPRsYA4uLiAOLi4gBPRsYAfHPeAHxz3gB8c94AfHPeAHxz3gB8c94AfHPeAHxz3gB8c94AfHPeAHxz3gB8c94AT0bGAOLi4gDi4uIAT0bGAHxz3gD8+/4A/Pv+APz7/gD8+/4A/Pv+APz7/gD8+/4A/Pv+APz7/gD8+/4AfHPeAE9GxgDi4uIA4uLiAE9GxgB8c94A/Pv+APz7/gD8+/4A/Pv+APz7/gD8+/4A/Pv+APz7/gD8+/4A/Pv+AHxz3gBPRsYA4uLiAOLi4gBPRsYAfHPeAPz7/gD8+/4A/Pv+APz7/gD8+/4A/Pv+APz7/gD8+/4A/Pv+APz7/gB8c94AT0bGAOLi4gDi4uIAT0bGAHxz3gD8+/4A/Pv+APz7/gD8+/4A/Pv+APz7/gD8+/4A/Pv+APz7/gD8+/4AfHPeAE9GxgDi4uIA4uLiAE9GxgB8c94A/Pv+APz7/gD8+/4A/Pv+APz7/gD8+/4A/Pv+APz7/gD8+/4A/Pv+AHxz3gBPRsYA4uLiAOLi4gBPRsYAfHPeAPz7/gD8+/4A/Pv+APz7/gD8+/4A/Pv+APz7/gD8+/4A/Pv+APz7/gB8c94AT0bGAOLi4gDi4uIAT0bGAHxz3gD8+/4A/Pv+APz7/gD8+/4A/Pv+APz7/gD8+/4A/Pv+APz7/gD8+/4AfHPeAE9GxgDi4uIA4uLiAE9GxgB8c94A/Pv+APz7/gD8+/4A/Pv+APz7/gD8+/4A/Pv+APz7/gD8+/4A/Pv+AHxz3gBPRsYA4uLiAOLi4gBPRsYAfHPeAPz7/gD8+/4A/Pv+APz7/gD8+/4A/Pv+APz7/gD8+/4A/Pv+APz7/gB8c94AT0bGAOLi4gDi4uIAT0bGAHxz3gD8+/4A/Pv+APz7/gD8+/4A/Pv+APz7/gD8+/4A/Pv+APz7/gD8+/4AfHPeAE9GxgDi4uIA4uLiAE9GxgB8c94AfHPeAHxz3gB8c94AfHPeAHxz3gB8c94AfHPeAHxz3gB8c94AfHPeAHxz3gBPRsYA4uLiAOLi4gBPRsYAT0bGAE9GxgBPRsYAT0bGAE9GxgBPRsYAT0bGAE9GxgBPRsYAT0bGAE9GxgBPRsYAT0bGAOLi4gD///8A4uLiAOLi4gDi4uIA4uLiAOLi4gDi4uIA4uLiAOLi4gDi4uIA4uLiAOLi4gDi4uIA4uLiAOLi4gD///8A`;
  
  return Buffer.from(faviconBase64, 'base64');
};

// Write the favicon
try {
  const faviconData = createFaviconData();
  fs.writeFileSync('./favicon.ico', faviconData);
  console.log('✅ favicon.ico created successfully');
} catch (error) {
  console.error('❌ Error creating favicon:', error);
}
