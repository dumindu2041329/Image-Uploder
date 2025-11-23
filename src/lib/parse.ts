import Parse from 'parse';

// Initialize Parse
const appId = import.meta.env.VITE_PARSE_APPLICATION_ID;
const jsKey = import.meta.env.VITE_PARSE_JAVASCRIPT_KEY;

// Helper to check if Parse is ready
export const isParseInitialized = () => {
  return !!Parse.applicationId;
};

if (appId && jsKey && appId !== 'YOUR_API_KEY') {
  try {
    Parse.initialize(appId, jsKey);
    Parse.serverURL = 'https://parseapi.back4app.com/';
    console.log("Parse initialized successfully");
  } catch (error) {
    console.error("Error initializing Parse:", error);
  }
} else {
  console.warn('Parse credentials not found or invalid in .env file.');
}

export default Parse;
