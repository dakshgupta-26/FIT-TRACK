import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';

interface SpotifyAuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: SpotifyUser | null;
  isLoading: boolean;
}

interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: Array<{ url: string }>;
  country: string;
  product: string;
}

const CLIENT_ID = '938a24f2bdd942ef8c5704875570f745';
const REDIRECT_URI = window.location.origin + '/music';
const SCOPE = 'user-read-private user-read-email user-modify-playback-state user-read-playback-state user-read-currently-playing streaming';

export const useSpotifyAuth = () => {
  const { toast } = useToast();
  const [authState, setAuthState] = useState<SpotifyAuthState>({
    isAuthenticated: false,
    accessToken: null,
    user: null,
    isLoading: true,
  });

  const fetchUserInfo = useCallback(async (token: string) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const user = await response.json();
      
      setAuthState(prev => ({
        ...prev,
        user,
      }));

    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  }, []);

  const exchangeCodeForToken = useCallback(async (code: string) => {
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: REDIRECT_URI,
          client_id: CLIENT_ID,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const data = await response.json();
      
      // Store token
      localStorage.setItem('spotify_access_token', data.access_token);
      localStorage.setItem('spotify_token_expiry', (Date.now() + data.expires_in * 1000).toString());
      
      if (data.refresh_token) {
        localStorage.setItem('spotify_refresh_token', data.refresh_token);
      }

      setAuthState({
        isAuthenticated: true,
        accessToken: data.access_token,
        user: null,
        isLoading: false,
      });

      // Fetch user info
      await fetchUserInfo(data.access_token);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      toast({
        title: "Spotify Connected",
        description: "Successfully connected to Spotify!",
      });

    } catch (error) {
      console.error('Error exchanging code for token:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: "Authentication Error",
        description: "Failed to connect to Spotify",
        variant: "destructive",
      });
    }
  }, [fetchUserInfo, toast]);

  useEffect(() => {
    // Check if we have a token in localStorage
    const token = localStorage.getItem('spotify_access_token');
    const tokenExpiry = localStorage.getItem('spotify_token_expiry');
    
    if (token && tokenExpiry && Date.now() < parseInt(tokenExpiry)) {
      // Token is still valid
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: true,
        accessToken: token,
        isLoading: false,
      }));
      
      // Fetch user info
      fetchUserInfo(token);
    } else {
      // Check for authorization code in URL
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code) {
        exchangeCodeForToken(code);
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    }
  }, [exchangeCodeForToken, fetchUserInfo]);

  const login = () => {
    const authUrl = `https://accounts.spotify.com/authorize?` +
      `client_id=${CLIENT_ID}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `scope=${encodeURIComponent(SCOPE)}&` +
      `show_dialog=true`;
    
    window.location.href = authUrl;
  };

  const logout = () => {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_token_expiry');
    localStorage.removeItem('spotify_refresh_token');
    
    setAuthState({
      isAuthenticated: false,
      accessToken: null,
      user: null,
      isLoading: false,
    });
    
    toast({
      title: "Logged Out",
      description: "Successfully disconnected from Spotify",
    });
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('spotify_refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: CLIENT_ID,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      
      // Update stored token
      localStorage.setItem('spotify_access_token', data.access_token);
      localStorage.setItem('spotify_token_expiry', (Date.now() + data.expires_in * 1000).toString());
      
      setAuthState(prev => ({
        ...prev,
        accessToken: data.access_token,
      }));

      return data.access_token;

    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
      throw error;
    }
  };

  const getValidToken = async (): Promise<string> => {
    const token = authState.accessToken;
    const tokenExpiry = localStorage.getItem('spotify_token_expiry');
    
    if (token && tokenExpiry && Date.now() < parseInt(tokenExpiry)) {
      return token;
    }
    
    // Token expired, try to refresh
    return await refreshToken();
  };

  return {
    ...authState,
    login,
    logout,
    refreshToken,
    getValidToken,
  };
};
