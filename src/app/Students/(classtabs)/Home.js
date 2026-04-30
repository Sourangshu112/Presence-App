import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RenderHeader from '@/components/ui/SubjectHeader';
import RenderAnnouncement from '@/components/ui/Announcement';
// import { useLocalSearchParams } from 'expo-router'; // You'll use this later to get subject details

// --- MOCK DATA (To be replaced by Backend API later) ---


const MOCK_ANNOUNCEMENTS = [
  {
    id: '1',
    author: 'Dr. A. Sharma',
    time: '10:00 AM, Oct 24',
    content: 'Don\'t forget, the mid-term assignment is due this Friday. Please submit it via the portal.',
  },
  {
    id: '2',
    author: 'Dr. A. Sharma',
    time: '2:30 PM, Oct 22',
    content: 'I have uploaded the notes for Chapter 4. Please review them before tomorrow\'s lab session.',
  },
    {
    id: '3',
    author: 'Dr. A. Sharma',
    time: '2:30 PM, Oct 22',
    content: 'I have uploaded the notes for Chapter 4. Please review them before tomorrow\'s lab session.',
  },
    {
    id: '4',
    author: 'Dr. A. Sharma',
    time: '2:30 PM, Oct 22',
    content: 'I have uploaded the notes for Chapter 4. Please review them before tomorrow\'s lab session.',
  },
    {
    id: '5',
    author: 'Dr. A. Sharma',
    time: '2:30 PM, Oct 22',
    content: 'I have uploaded the notes for Chapter 4. Please review them before tomorrow\'s lab session.',
  },
    {
    id: '6',
    author: 'Dr. A. Sharma',
    time: '2:30 PM, Oct 22',
    content: 'I have uploaded the notes for Chapter 4. Please review them before tomorrow\'s lab session.',
  },
];

export default function SubjectHome() {
  // In reality, you'd get these from Context/Auth and Expo Router params
  // const { subjectId, name, teacher } = useLocalSearchParams();
  const userRole = 'student'; // Change to 'student' to see the difference!
  
  const [announcementText, setAnnouncementText] = useState('');

 

  // --- MAIN RENDER ---
  return (
    <View style={styles.container}>
    {/* <RenderHeader subject={MOCK_SUBJECT} userRole={userRole} /> */}
      <FlatList
        data={MOCK_ANNOUNCEMENTS}
        keyExtractor={(item) => item.id}
        renderItem={RenderAnnouncement}
        // ListHeaderComponent={<RenderHeader subject={MOCK_SUBJECT} userRole={userRole} />}
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
});