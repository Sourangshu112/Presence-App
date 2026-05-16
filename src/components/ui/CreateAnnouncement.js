import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function CreateAnnouncement({ onPostAnnouncement }) {
  const [announcementText, setAnnouncementText] = useState("");

  const handlePost = () => {
    if (announcementText.trim()) {
      onPostAnnouncement(announcementText.trim());
      setAnnouncementText(""); // Clear after sending
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.createPostCard}>

        
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  createPostCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#BDBDBD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  postInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    maxHeight: 100, 
  },
  postButton: {
    padding: 8,
  },
});