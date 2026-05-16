import React, { useEffect } from "react"; 
import { useRouter, useLocalSearchParams } from "expo-router";
import LoadingScreen from '@/components/LoadingScreen';
import { Alert } from "react-native";
import { useAuthApi } from "@/api/auth.api";


export default function Process() {
  const { name, selectedRole, faceImage } = useLocalSearchParams();
  const router = useRouter();
  const { addStudentData, addTeacherData } = useAuthApi();

  useEffect(() => {
    const handleAPIConnection = async () => {
      try {
        const formData = new FormData();
        formData.append('name', name);

        if (selectedRole === "STUDENT") {
          formData.append('face_image', {
            uri: faceImage, type: 'image/jpeg', name: 'capture.jpg',
          });
          await addStudentData(formData);
          Alert.alert("Success", "You have been registered successfully");
          router.replace('/Students/Dashboard');
        } else if (selectedRole === "TEACHER") {
          await addTeacherData(formData);
          Alert.alert("Success", "You have been registered successfully");
          router.replace('/Teachers/Dashboard');
        }
      } catch (err) {
        Alert.alert("Registration Failed", err.error || "An error occurred");
        router.replace('/Shared/Details'); 
      }
    };

    handleAPIConnection();
  }, []); 

  return <LoadingScreen />;
}