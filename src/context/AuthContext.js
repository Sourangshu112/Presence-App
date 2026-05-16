import React, { createContext, useState, useEffect, useContext } from 'react';
import { GoogleSignin, isSuccessResponse, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { ApiContext, useApi } from './APIContext';

// 1. Create the Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [backendData, setBackendData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [tokenData, setTokenData] = useState({});
  const [errorHappened, setErrorHappened] = useState(false);

  const apiurl = useApi();

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
        const {idToken} = responseOfGoogle.data;
        const accessToken = tokens.accessToken;

        // 1. Set the state for your UI to use later

        const response = await fetch(`${apiurl}/auth/google/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            access_token: accessToken,
            id_token: idToken 
          }), 
        });

        const data = await response.json();

        if (response.ok) {
          setBackendData(data)
          await SecureStore.setItemAsync('access_token', data.access);
          await SecureStore.setItemAsync('refresh_token', data.refresh);
          setErrorHappened(false);
          return data;
        } else {
          setErrorHappened(true);
          console.error("Backend validation failed:", data);
          return null;
        }
      } else {
        // If not successful, handle the cancellation/failure
        Alert.alert("Signin was cancelled");
        console.log("Signin was cancelled");
      }

    } catch (error) {
      if(isErrorWithCode(error)){
        setErrorHappened(true);
        console.log("Google Sign-In specific error:", error);
        return null;
      } else {
        setErrorHappened(true);
        console.log("Error in backend:", error);
        return null;
      }
    } finally {
      setIsLoading(false);
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
