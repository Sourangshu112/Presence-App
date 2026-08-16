import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import LoadingScreen from '@/components/LoadingScreen';

export default function ServerError() {
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    // Add a brief timeout so the user sees the loading state, 
    // then replace the route to the index page to re-trigger the app initialization.
    setTimeout(() => {
      router.replace('/'); 
    }, 800);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>📡</Text>
        </View>

        <Text style={styles.title}>Connection Lost</Text>
        <Text style={styles.subtitle}>
          We couldn't connect to the server. Please check your internet connection or try again after some time.
        </Text>

        
      {isRetrying ? <LoadingScreen /> : (
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={handleRetry}
          disabled={isRetrying}
        >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
          )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA', 
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  iconContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#E3F2FD', // Light blue background
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  iconText: {
    fontSize: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#777777',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  retryButton: {
    backgroundColor: '#1976D2', // Matches your Login screen branding
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});