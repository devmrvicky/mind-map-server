import { google } from "googleapis";
import { env } from "../env/env";

const OAuth2 = google.auth.OAuth2;

// Create a new OAuth2 client using the credentials from the .env file
const Oauth2Client = new OAuth2(
  env.GOOGLEAPI_CLIENT_ID,
  env.GOOGLEAPI_CLIENT_SECRET,
  env.GOOGLEAPI_REDIRECT_URI
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
