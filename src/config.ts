export const apiURL = import.meta.env.PUBLIC_VERCEL_URL
  ? `https://${import.meta.env.PUBLIC_VERCEL_URL}`
  : "http://localhost:3000";
