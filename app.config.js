import "dotenv/config";

// Get the configuration from app.json
const appJson = require("./app.json");

// Export the configuration with added environment variables
export default {
  ...appJson,
  expo: {
    ...appJson.expo,
    extra: {
      currencyApiKey: process.env.CURRENCY_API_KEY,
      eas: {
        projectId: process.env.EAS_PROJECT_ID || "",
      },
    },
  },
};
