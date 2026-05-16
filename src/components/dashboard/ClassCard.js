import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ClassCard({ item, role, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: item.color_code || '#1a73e8' }]}
      activeOpacity={0.8}
      onPress={() => onPress(item)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.classTitle} numberOfLines={1}>{item.classroom_name}</Text>
        {role === 'TEACHER' && <Text style={styles.classSubtitle}>{item.join_code}</Text>}
      </View>

      <View style={[styles.cardFooter, { justifyContent: role === 'TEACHER' ? 'space-between' : 'flex-end' }]}>
        <Text style={styles.footerText}>
          {role === 'TEACHER' ? `${item.student_count || 0} Students` : item.teacher_name}
        </Text>
        {role === 'TEACHER' && <Text style={styles.footerText}>Created on: {item.created_at?.slice(0, 10)}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 140, borderRadius: 12, marginBottom: 16, padding: 16,
    justifyContent: 'space-between', elevation: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
  },
  cardHeader: { flex: 1 },
  classTitle: { fontSize: 22, fontWeight: '600', color: '#fff', marginBottom: 4 },
  classSubtitle: { fontSize: 14, color: 'rgba(255, 255, 255, 0.8)' },
  cardFooter: { flexDirection: 'row' },
  footerText: { fontSize: 13, fontWeight: '500', color: '#fff' },
});