import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen({ onGoogleLogin }) {
  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Top Section - Branding */}
        <View style={styles.header}>
          <Text style={styles.headingName}>Presence</Text>
          <Text style={styles.subtitle}>Attendance in Seconds</Text>
        </View>

        {/* Bottom Section - Action Card */}
        <View style={styles.bottomCard}>
          <Text style={styles.welcomeText}>Welcome!!</Text>
          <Text style={styles.instructionText}>Sign in to access your account</Text>
          
          <View style={styles.buttonWrapper}>
            <GoogleSigninButton 
              style={styles.loginButton}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Light} 
              onPress={onGoogleLogin}
            />
          </View>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1976D2', // Primary brand color fills the background
  },
  container: { 
    flex: 1, 
    justifyContent: 'space-between', 
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headingName: { 
    fontSize: 48, 
    fontWeight: '800', 
    color: '#FFFFFF', // White text stands out against the blue
    letterSpacing: 1.2,
  },
  subtitle: {
    fontSize: 16,
    color: '#E3F2FD', // Very light blue for contrast
    marginTop: 8,
    fontWeight: '500',
  },
  bottomCard: {
    backgroundColor: '#FAFAFA',
    width: '100%',
    height: 650,
    paddingVertical: 80,
    paddingHorizontal: 30,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    alignItems: 'center',
    // Drop shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // Elevation for Android
    elevation: 10, 
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 15,
    color: '#777777',
    marginBottom: 35,
    textAlign: 'center',
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  loginButton: {
    width: 312, // Standard Google button width
    height: 48,
  }
});