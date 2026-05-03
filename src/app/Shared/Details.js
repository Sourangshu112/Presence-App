import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '@/context/AuthContext';


export default function DetailScreen() {
  const options = [
    { id: '1', label: 'Teacher' },
    { id: '2', label: 'Student' },
  ];
  const {backendData, tokenData} = useContext(AuthContext);
  const [selectedId, setSelectedId] = useState('1');
  const [name, setName] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
  if (tokenData.name)
    setName(tokenData.name)
  },[])

  const brandColor = '#1976D2'; // Define centrally

  return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.keyboardAvoidingView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.formContainer}>
              
              {/* Header Section */}
              <View style={styles.headerSection}>
                <Text style={styles.heading}>Enter Some Details</Text>
                <Text style={styles.subHeading}>We need a few items to get started.</Text>
              </View>

              {/* Radio Selection Section */}
              <View style={styles.sectionContainer}>
                <Text style={styles.labelTitle}>Are you?</Text>
                
                <View style={styles.optionsList}>
                  {options.map((item) => {
                    const isSelected = item.id === selectedId;

                    return (
                      <Pressable
                        key={item.id}
                        onPress={() => setSelectedId(item.id)}
                        style={[
                          styles.rectOption,
                          isSelected && styles.rectOptionSelected // Dynamic selection border/bg
                        ]}
                      >
                        <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                          {item.label}
                        </Text>
                        
                        {/* Custom Select Indicator */}
                        {isSelected && (
                          <View style={styles.selectedIndicator}>
                            <Ionicons name="checkmark-circle" size={24} color={brandColor} />
                          </View>
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Text Input Section */}
              <View style={styles.sectionContainer}>
                <Text style={styles.labelTitle}>Enter Full Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    isFocused && styles.inputFocused
                  ]}
                  placeholder="e.g., Amit Das"
                  placeholderTextColor="#999"
                  value={name}
                  onChangeText={setName}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  autoCorrect={false} // Often helpful for names
                />
                    <View style={styles.cautionContainer}>
                        <Text style={styles.cautionText}>Caution: This is the name others will see and cannot be changed later. Be Carefull</Text>
                    </View>
              </View>

              {/* Optional Submit Button for Context */}
              <View style={styles.submitSection}>
                <TouchableOpacity style={styles.submitButton}>
                  <Text style={styles.submitText}>Continue</Text>
                </TouchableOpacity>
              </View>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
  );
}

// Styling Constants (reuse values for consistency)
const brandColor = '#1976D2';
const backgroundColor = '#FFFFFF'; // Clean white background for main content
const optionBg = '#F2F2F2'; // Light gray unselected state

const styles = StyleSheet.create({
  // Safe Area & Robust Layout
  cautionContainer:{
    padding: 5,
  },
  cautionText:{
    color: "#fc4949"
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#E6F0FA', // Set background color for the safest area
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center', // Centers content on screen when possible
    paddingHorizontal: 20,
    paddingVertical: 30, // Healthy breathing room
  },
  formContainer: {
    width: '100%',
    maxWidth: 500, // Helps with large tablet layouts
    alignSelf: 'center', // Center content on wide screens
    // Modern shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    // Add dynamic background for shadow effect
    backgroundColor: backgroundColor,
    borderRadius: 20,
    padding: 25,
  },

  // Header Section
  headerSection: {
    marginBottom: 35,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  subHeading: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '400',
  },

  // Sections Common
  sectionContainer: {
    marginBottom: 15,
    width: '100%',
  },
  labelTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 12,
    letterSpacing: 0.2,
  },

  // Rectangular Options
  optionsList: {
    flexDirection: 'row', // Display side-by-side
    justifyContent: 'space-between',
    gap: 10, // Use modern gap over fixed margins/padding
  },
  rectOption: {
    flex: 1, // Equally divide available space
    backgroundColor: optionBg,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent', // Initially hidden
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center', // Vertically center content
    justifyContent: 'center',
    minHeight: 80, // Consistent box height
    flexDirection: 'row', // Put text and indicator side-by-side
  },
  rectOptionSelected: {
    borderColor: brandColor, // Highlight border
    backgroundColor: backgroundColor, // Distinct selected bg
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555555',
  },
  optionLabelSelected: {
    color: brandColor, // Color text with brand color on selection
  },
  selectedIndicator: {
    marginLeft: 10, // Healthy space after text
  },

  // Text Input
  input: {
    height: 60, // Modern larger input
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 17,
    borderWidth: 2,
    borderColor: 'transparent',
    color: '#000000',
  },
  inputFocused: {
    borderColor: brandColor, // Focus indicator
    backgroundColor: '#FFFFFF',
    // Glow effect
    shadowColor: brandColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },

  // Optional Submit Section
  submitSection: {
    marginTop: 0,
  },
  submitButton: {
    backgroundColor: brandColor,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});