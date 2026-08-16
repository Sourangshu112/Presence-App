import React, { useContext, useState } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RenderAnnouncement from '@/components/ui/Announcement';
import { DataContext } from './_layout';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorScreen from '@/components/ErrorScreen';

export default function SubjectHome() {
  const {announcements, loading, error, fetchAnnouncement} = useContext(DataContext);

  if (loading) return <LoadingScreen />

  if (error.fetchAnnouncement) 
    return(
      <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
        <ErrorScreen onRetry={fetchAnnouncement} />
      </View>
    )

  if ( !announcements || announcements.length === 0)
    return(
      <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        No Announcements Yet
      </Text>
    </View>
    )
  

  // --- MAIN RENDER ---
  return (
    <View style={styles.container}>
      <FlatList
        data={announcements}
        keyExtractor={(item) => item.id}
        renderItem={RenderAnnouncement}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // A light, neutral background
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 60 
  },
  emptyText: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#3c4043',
    marginBottom: 8 
  },
  
});