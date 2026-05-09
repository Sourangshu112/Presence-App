import React, { useEffect } from "react"; // Capital R in React, imported useEffect
import { useRouter, useLocalSearchParams } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import LoadingScreen from '@/components/LoadingScreen';
import { Alert } from "react-native";

export default function Process() {
  const { name, selectedRole, faceImage } = useLocalSearchParams();
  const router = useRouter(); // Initialized router

  useEffect(() => {
    // Wrapped in useEffect so it runs automatically
    const handleAPIConnection = async () => {
      try {
        const token = await SecureStore.getItemAsync('access_token');
        if (!token) {
          throw new Error("No Token found");
        }

        const formData = new FormData();
        formData.append('name', name);

        let endpoint = '';

        if (selectedRole === "STUDENT") {
          endpoint = 'http://10.215.120.11:8000/auth/add_student_data';
          formData.append('face_image', {
            uri: faceImage,
            type: 'image/jpeg',
            name: 'capture.jpg',
          });
        } else if (selectedRole === "TEACHER") {
          endpoint = 'http://10.215.120.11:8000/auth/add_teacher_data';
        }

        const response = await fetch(endpoint, {
          method: 'PUT', // or PATCH
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData, 
        });

        const data = await response.json();

        if (response.ok) {
          Alert.alert("Success", "You have been registered successfully");
          // Route based on role
          if (selectedRole === "STUDENT") router.replace('/Students/Dashboard');
          if (selectedRole === "TEACHER") router.replace('/Teachers/Dashboard');
        } else {
          console.error("Backend Error:", data);
          Alert.alert("Failed", data.error);
          router.replace('/Shared/Details'); 
        }

      } catch (error) {
        console.error("Upload error:", error);
        Alert.alert("Network Error", "Could not connect to the server.");
        router.replace('/auth/Login');
      }
    };

    handleAPIConnection();
  }, []); // Empty array ensures it runs only once on mount

  return <LoadingScreen />;
}