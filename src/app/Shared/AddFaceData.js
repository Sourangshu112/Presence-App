// VerificationPage.js
import React, { useState } from 'react';
import { View, StyleSheet} from 'react-native';
import CameraScreen from '@/components/CameraScreen';
import { useLocalSearchParams, useRouter } from 'expo-router';


export default function AddFaceDataScreen() {
  const router = useRouter();;
  const {name , selectedRole, faceImage} = useLocalSearchParams();
  const handleLivenessSuccess = async (photo) => {
      router.push({
        pathname: "./ProcessData",
        params: { name, selectedRole, faceImage: `file://${photo.path}` }
      });
  };

  return (
    <View style={styles.container}>
      <CameraScreen onVerify={handleLivenessSuccess} />
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  loadingText: {
    color: '#fff',
    marginTop: 20,
    fontSize: 16,
  }
});