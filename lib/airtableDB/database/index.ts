export const Airtable = require("airtable");
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_TOKEN,
});
// export const base = Airtable.base([process.env.AIRTABLE_BASE_KEY]);

export const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_TOKEN,
}).base([process.env.AIRTABLE_BASE_KEY]);
