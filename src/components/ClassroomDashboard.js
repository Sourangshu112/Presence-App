import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ClassroomDashboard({role = 'student', userName = 'User', classes = [], onClassPress, onFabPress}) {
  // Empty state rendering
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {role === 'teacher'
          ? "You haven't created any classes yet."
          : "You haven't joined any classes yet."}
      </Text>
      <Text style={styles.emptySubText}>
        Tap the + button to get started.
      </Text>
    </View>
  );

  // Individual Class Card rendering
  const renderClassCard = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: item.themeColor || '#1a73e8' }]}
        activeOpacity={0.8}
        onPress={() => onClassPress(item)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.classTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.classSection} numberOfLines={1}>
            {item.section}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.footerText}>
            {role === 'teacher'
              ? `${item.studentCount || 0} Students`
              : item.teacherName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {userName}</Text>
        <Text style={styles.roleBadge}>
          {role.toUpperCase()}
        </Text>
      </View>

      {/* Class List */}
      <FlatList
        data={classes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderClassCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.7}
        onPress={onFabPress}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Light gray background
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#202124',
  },
  roleBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5f6368',
    backgroundColor: '#e8eaed',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Extra space so FAB doesn't block the last card
  },
  card: {
    height: 140,
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  cardHeader: {
    flex: 1,
  },
  classTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  classSection: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Aligns text to the bottom right
  },
  footerText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#fff',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1a73e8', // Google Classroom Blue
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1a73e8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  fabIcon: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
    lineHeight: 34, // Centers the '+' vertically on some devices
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3c4043',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#5f6368',
  },
});