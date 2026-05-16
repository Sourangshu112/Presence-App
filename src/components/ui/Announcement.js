import { View,Text, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { announcementTime } from "@/utils/dateTime";


const RenderAnnouncement = ({ item }) => (
    <View style={styles.announcementCard}>
      <View style={styles.announcementHeader}>
        <View style={styles.avatarPlaceholderSmall}>
          <Text style={styles.avatarText}>{item.author_name.charAt(0)}</Text>
        </View>
        <View>
          <Text style={styles.authorName}>{item.author_name}</Text>
          {
          (item.created_at === item.updated_at) ? 
            <Text style={styles.timeText}>{announcementTime(item.created_at)}</Text> : 
            <Text style={styles.timeText}>Edited: {announcementTime(item.updated_at)}</Text>
            }
        </View>
      </View>
      <Text style={styles.announcementContent}>{item.content}</Text>
    </View>
  );

const styles = StyleSheet.create({
    announcementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarPlaceholderSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timeText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  announcementContent: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
})

export default RenderAnnouncement;