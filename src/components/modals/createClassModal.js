import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  Modal, ActivityIndicator, StyleSheet, Alert 
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import LoadingScreen from '../LoadingScreen';
import ErrorText from '../ui/ErrorText';

export default function CreateClassModal({ visible, onClose, onSuccess }) {
  const [className, setClassName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const handleCreateClass = async () => {
    // 1. Basic validation
    if (!className.trim()) {
      setErrorText("Classname cannot be empty");
      return;
    }

    setIsLoading(true);

    try {
      // 2. Get the token
      const token = await SecureStore.getItemAsync('access_token');
      
      // 3. Make the API Call to the Django endpoint we built earlier
      const response = await fetch('http://10.215.120.11:8000/classroom/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: className.trim() 
        })
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
            "Class Created!", 
            `Your join code is: ${data.classroom.join_code}\nGive this to your students.`
        );
        setClassName(''); // Clear the input
        onSuccess();      // Refresh the teacher dashboard!
        onClose();        // Close the modal
      } else {
        Alert.alert("Failed", data.error || "Could not create class.");
      }

    } catch (error) {
      console.error("Create Class Error:", error);
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
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Create a New Class</Text>
          <Text style={styles.modalSubtitle}>Give your class a name. A unique 6-character join code will be generated automatically.</Text>
          <ErrorText textReceived={errorText} />
          <TextInput
            style={styles.input}
            placeholder="e.g. Analog Electronics"
            placeholderTextColor="#888"
            value={className}
            onChangeText={(s) => {
                setClassName(s);
                setErrorText("");
            }}
            maxLength={50} // Keep it from getting too long in the UI
          />

          <View style={styles.buttonRow}>
            {/* Cancel Button */}
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={() => {
                setClassName('');
                onClose();
              }}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity 
              style={[styles.button, styles.submitButton]} 
              onPress={handleCreateClass}
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingScreen />
              ) : (
                <Text style={styles.submitButtonText}>Create</Text>
              )}
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

// Same styles as the Join Modal
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
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
    fontWeight: '500',
    marginBottom: 24,
    backgroundColor: '#F9F9F9',
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  button: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, minWidth: 90, alignItems: 'center' },
  cancelButton: { backgroundColor: '#F5F5F5' },
  cancelButtonText: { color: '#666', fontWeight: '600', fontSize: 16 },
  submitButton: { backgroundColor: '#1976D2' },
  submitButtonText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
});