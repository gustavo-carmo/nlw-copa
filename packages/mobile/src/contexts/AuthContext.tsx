import { createContext, ReactNode, useEffect, useState } from "react";
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

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
    clientId: '365344501596-ik7vl34q7vk6jjbeih88fc0ou1gkffhi.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ['profile', 'email']
  })

  async function signIn() {
    console.log(AuthSession.makeRedirectUri({ useProxy: true }));
    return;
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
    console.log("Token de autenticação -> ", access_token);
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