import axios from 'axios';
import qs from 'qs';

let accessToken = null;
let expiresAt = null;

export async function getSpotifyAccessToken() {
    
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;


  if (accessToken && Date.now() < expiresAt) return accessToken;

  const data = qs.stringify({ grant_type: 'client_credentials' });

  const response = await axios.post('https://accounts.spotify.com/api/token', data, {
    headers: {
      Authorization:
        'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  accessToken = response.data.access_token;
  expiresAt = Date.now() + response.data.expires_in * 1000;

  return accessToken;
}
