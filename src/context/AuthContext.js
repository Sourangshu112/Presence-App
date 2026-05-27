import React, { createContext, useState, useEffect, useContext } from 'react';
import { GoogleSignin, isSuccessResponse, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useAuthApi } from '@/api/auth.api';

// 1. Create the Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { loginWithGoogleBackend } = useAuthApi();
  const [isLoading, setIsLoading] = useState(true); 
  const [tokenData, setTokenData] = useState({});
  const [errorHappened, setErrorHappened] = useState(false);


  const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_WEB_CLIENT_ID;

  // 2. Configure Google Sign-In exactly once when the app loads
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID, 
      offlineAccess: true, 
    });
    setIsLoading(false);
  }, []);

  // 3. The Login Function
  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      await GoogleSignin.hasPlayServices();
      const responseOfGoogle = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();

      if (isSuccessResponse(responseOfGoogle)){
        const { idToken } = responseOfGoogle.data;
        const accessToken = tokens.accessToken;

        try {
          const data = await loginWithGoogleBackend(accessToken, idToken);
          await SecureStore.setItemAsync('access_token', data.access);
          await SecureStore.setItemAsync('refresh_token', data.refresh);
          setErrorHappened(false);
          return data;
        } catch (err) {
          setErrorHappened(true);
          Alert.alert("Failed", "Could not connect to the Server")
          return null;
        }
      }
    } catch (err) {
      setErrorHappened(true);
      Alert.alert("Failed", "Could not Connect to Google");
      return null;
    }
  };

  // 4. The Logout Function
  const logout = async () => {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{loginWithGoogle, logout, isLoading, errorHappened, setErrorHappened }}>
      {children}
    </AuthContext.Provider>
  );
};
