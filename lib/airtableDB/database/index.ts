import Airtable from "airtable";

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_TOKEN,
});
// export const base = Airtable.base([process.env.AIRTABLE_BASE_KEY]);

export const base = Airtable.base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_KEY as string);
