import { createContext, ReactNode, useEffect, useState } from "react";
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { api } from "../services/api";

WebBrowser.maybeCompleteAuthSession();

type User = {
  name: string;
  avatarUrl: string;
}

export type AuthContextDataProps = {
  user: User;
  isUserLoading: boolean;
  signIn: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextDataProps);

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider ({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const [isUserLoading, setIsUserLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.CLIENT_ID,
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ['profile', 'email']
  })

  async function signIn() {
    try {
      setIsUserLoading(true);

      await promptAsync();
    } catch (error) {
      console.error(error);

      throw error;
    } finally {
      setIsUserLoading(false);
    }
  }

  async function googleSignIn (access_token: string) {
    try {
      setIsUserLoading(true);

      const tokenResponse = await api.post('users', { access_token });
      api.defaults.headers['Authorization'] = `Bearer ${tokenResponse.data.token}`;
      const userInfoResponse = await api.get('me');
      setUser(userInfoResponse.data.user);


    } catch (error) {
      console.error(error);

      throw error;
    } finally {
      setIsUserLoading(false);
    }
  }

  useEffect(() => {
    if(response?.type === 'success' && response.authentication?.accessToken) {
      googleSignIn(response.authentication.accessToken);
    }
  }, [response]);


  return (
    <AuthContext.Provider value={{
      signIn,
      user,
      isUserLoading
    }}>
      {children}
    </AuthContext.Provider>
  )
}