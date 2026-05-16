import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const RenderHeader = ({ subject, userRole, onPostAnnouncement }) => {
  const [announcementText, setAnnouncementText] = useState("");

  const handlePost = () => {
    if (announcementText.trim()) {
      onPostAnnouncement(announcementText); // Pass data back to the parent screen to hit the API
      setAnnouncementText(""); // Clear input after posting
    }
  };

  return (
    <View style={styles.headerContainer}>
      {/* Subject Banner */}
      <View style={[styles.banner, { backgroundColor: subject.bannerColor || '#1a73e8' }]}>
        <Text style={styles.subjectName}>{subject.name}</Text>
        <Text style={styles.teacherName}>Teacher: {subject.teacherName}</Text>
        <Text style={styles.teacherName}>Joined on: {subject.joinedAt}</Text>
      </View>

      {/* Teacher Action Area */}
      {userRole === 'teacher' && (
        <View style={styles.createPostCard}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={20} color="#fff" />
          </View>
          <TextInput 
            style={styles.postInput}
            placeholder="Announce something to your class"
            placeholderTextColor="#666"
            multiline
            value={announcementText}
            onChangeText={setAnnouncementText}
          />
          {announcementText.trim().length > 0 && (
            <TouchableOpacity style={styles.postButton} onPress={handlePost}>
              <Ionicons name="send" size={20} color="#4A90E2" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: { marginBottom: 5, padding: 16 },
  banner: {
    borderRadius: 12, padding: 20, height: 140, justifyContent: 'flex-end', marginBottom: 16,
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  subjectName: { fontSize: 26, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  teacherName: { fontSize: 16, color: '#E0E0E0', fontWeight: '500' },
  createPostCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, flexDirection: 'row',
    alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3,
  },
  avatarPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#BDBDBD', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  postInput: { flex: 1, fontSize: 16, color: '#333', maxHeight: 100 },
  postButton: { padding: 8 },
});

export default RenderHeader;