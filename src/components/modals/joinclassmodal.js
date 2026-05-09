import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  Modal, ActivityIndicator, StyleSheet, Alert 
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import LoadingScreen from '../LoadingScreen';
import ErrorText from '../ui/ErrorText';

export default function JoinClassModal({ visible, onClose, onSuccess }) {
  const [joinCode, setJoinCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const handleJoinClass = async () => {
    // 1. Basic validation
    if (!joinCode.trim()) {
      Alert.alert("Error", "Please enter a join code.");
      return;
    }

    setIsLoading(true);

    try {
      // 2. Get the token
      const token = await SecureStore.getItemAsync('access_token');
      
      // 3. Make the API Call to your new Django endpoint
      const response = await fetch('http://10.215.120.11:8000/classroom/join/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          join_code: joinCode.trim().toUpperCase() // Force uppercase just in case
        })
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success!", `You have joined ${data.classroom.name}`);
        setJoinCode(''); // Clear the input
        onSuccess();     // Tell the dashboard to refresh its list!
        onClose();       // Close the modal
      } else {
        // Handle custom backend errors (e.g., "Already enrolled" or "Invalid code")
        Alert.alert("Failed", data.error || "Could not join class.");
      }

    } catch (error) {
      console.error("Join Class Error:", error);
      Alert.alert("Network Error", "Could not connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Dark overlay background */}
      <View style={styles.overlay}>
        
        {/* The Modal Box */}
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Join a Class</Text>
          <Text style={styles.modalSubtitle}>Ask your teacher for the 6-character class code, then enter it here.</Text>
          <ErrorText textReceived={errorText} />
          <TextInput
            style={styles.input}
            placeholder="e.g. X9K4M2"
            placeholderTextColor="#888"
            value={joinCode}
            onChangeText={(s)=>{
                setJoinCode(s);
                setErrorText("");
            }}
            autoCapitalize="characters"
            maxLength={8}
          />

          <View style={styles.buttonRow}>
            {/* Cancel Button */}
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={() => {
                setJoinCode('');
                onClose();
              }}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity 
              style={[styles.button, styles.submitButton]} 
              onPress={handleJoinClass}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Join</Text>
              )}
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark transparent background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFF',
    width: '100%',
    borderRadius: 12,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  modalSubtitle: { fontSize: 14, color: '#666', marginBottom: 20, lineHeight: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 15,
    fontSize: 18,
    letterSpacing: 2,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    backgroundColor: '#F9F9F9'
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  button: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, minWidth: 90, alignItems: 'center' },
  cancelButton: { backgroundColor: '#F5F5F5' },
  cancelButtonText: { color: '#666', fontWeight: '600', fontSize: 16 },
  submitButton: { backgroundColor: '#1976D2' },
  submitButtonText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
});