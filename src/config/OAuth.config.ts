import { google } from "googleapis";
import dotenv from "dotenv";

// Configure dotenv to load environment variables from the .env file
dotenv.config({
  path: "./.env",
});

const OAuth2 = google.auth.OAuth2;

// Create a new OAuth2 client using the credentials from the .env file
const Oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// getAuthUrl function to get the OAuth2 URL
const getAuthUrl = ([...scopes]) => {
  return Oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });
};

export { getAuthUrl, Oauth2Client };
