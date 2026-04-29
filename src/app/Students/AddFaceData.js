// VerificationPage.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
// import CameraScreen from '@components/CameraScreen';

export default function AddFaceDataScreen() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLivenessSuccess = async (photo) => {
    setIsProcessing(true);

    try {
      // 1. Prepare the image for upload using FormData
      const formData = new FormData();
      formData.append('student_id', '12345'); // Add whatever payload your backend needs
      
      formData.append('face_image', {
        uri: `file://${photo.path}`,
        type: 'image/jpeg',
        name: 'verification_capture.jpg',
      });

      // 2. Send to your backend (e.g., your Django/Node API)
    //   const response = await fetch('https://your-backend-api.com/api/verify-face/', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //       'Authorization': 'Bearer YOUR_AUTH_TOKEN', // If needed
    //     },
    //     body: formData,
    //   });

    //   const data = await response.json();

    //   if (response.ok) {
    //     Alert.alert("Success", "Attendance marked successfully!");
    //     // Navigate away or update UI
    //   } else {
    //     Alert.alert("Verification Failed", data.message || "Face did not match records.");
    //   }

    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Network Error", "Could not connect to the server.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* If we are uploading to the server, show a loading screen, otherwise show the camera */}
      {isProcessing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#22c55e" />
          <Text style={styles.loadingText}>Verifying with server...</Text>
        </View>
      ) : (
        <CameraScreen onVerify={handleLivenessSuccess} />
      )}
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