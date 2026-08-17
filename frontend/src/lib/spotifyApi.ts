// src/lib/spotifyApi.ts

const getAppBaseUrl = (): string => {
  return (
    import.meta.env.NEXT_PUBLIC_APP_URL ||
    import.meta.env.VITE_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:8080")
  );
};

const CLIENT_ID = "0123c79f0639413e887b4e5c891052ea";
const REDIRECT_URI = `${getAppBaseUrl()}/workouts`;

export interface SpotifyTrack {
  uri: string; // We now need the URI to play the track
  id: string;
  name: string;
  artist: string;
  albumArtUrl: string;
}

// ---- Step 1: User Authorization ----

export async function redirectToAuthCodeFlow() {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", CLIENT_ID);
  params.append("response_type", "code");
  params.append("redirect_uri", REDIRECT_URI);
  // These scopes are REQUIRED for the Web Playback SDK
  params.append(
    "scope",
    "streaming user-read-email user-read-private user-modify-playback-state user-read-playback-state"
  );
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// ---- Step 2: Requesting the Access Token ----

export async function getAccessToken(code: string): Promise<string> {
  const verifier = localStorage.getItem("verifier");

  const params = new URLSearchParams();
  params.append("client_id", CLIENT_ID);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", REDIRECT_URI);
  params.append("code_verifier", verifier!);

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const { access_token } = await result.json();
  return access_token;
}

// ---- PKCE Helper Functions ----

function generateCodeVerifier(length: number) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// ---- API Call to Search for Tracks ----

export async function searchSpotifyTracks(
  token: string,
  workoutType: string
): Promise<SpotifyTrack[]> {
  const genreMap: { [key: string]: string } = {
    Strength: "rock,hip-hop",
    Cardio: "dance,pop,electronic",
    Flexibility: "ambient,classical,instrumental",
  };
  const genre = genreMap[workoutType] || "workout";
  const query = `genre:${genre}`;

  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
    query
  )}&type=track&limit=20`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok)
    throw new Error(`Spotify API error! status: ${response.status}`);

  const data = await response.json();

  return data.tracks.items.map((item: any) => ({
    uri: item.uri,
    id: item.id,
    name: item.name,
    artist: item.artists.map((artist: any) => artist.name).join(", "),
    albumArtUrl: item.album.images[0]?.url || "",
  }));
}