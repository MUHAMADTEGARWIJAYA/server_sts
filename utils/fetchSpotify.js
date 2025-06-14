import axios from 'axios';
import { getSpotifyAccessToken } from '../configs/spotify.js';

export async function searchSpotify(query) {
    const token = await getSpotifyAccessToken();
    const res = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: query,
        type: 'track',
        limit: 10,

      },
    })

    return res.data.tracks.items.map((track) => ({
       title: track.name,
       artist: track.artists.map((a) => a.name).join(', '),
       cover: track.album.images[0]?.url,
       preview_url: track.preview_url,
       spotify_url: track.external_urls.spotify,
    }))
}