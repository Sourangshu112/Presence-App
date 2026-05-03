// src/app/(student)/(classtabs)/People.js
import React from 'react';
import { View, Text, StyleSheet, SectionList } from 'react-native';
import PersonRow from '@/components/ui/PersonRow';

const PEOPLE_DATA = [
  {
    title: 'Teachers',
    data: [{ id: 't1', name: 'Dr. A. Sharma' }],
  },
  {
    title: 'Classmates',
    data: [
      { id: 's1', name: 'Aarav Patel' },
      { id: 's2', name: 'Diya Singh' },
    ],
  },
];

export default function StudentPeopleScreen() {
  const renderSectionHeader = ({ section: { title, data } }) => (
    <View style={styles.sectionHeaderContainer}>
      <View style={styles.sectionHeaderTop}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {title === 'Classmates' && (
          <Text style={styles.studentCount}>{data.length} students</Text>
        )}
      </View>
      <View style={styles.divider} />
    </View>
  );

  return (
    <View style={styles.container}>
      <SectionList
        sections={PEOPLE_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item, section }) => (
          <PersonRow item={item} isTeacher={section.title === 'Teachers'} />
        )}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
    },
  listContent: { 
    paddingHorizontal: 20, 
    paddingTop: 20, 
    paddingBottom: 40 
},
  sectionHeaderContainer: { 
    marginTop: 10, 
    marginBottom: 15 
},
  sectionHeaderTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-end', 
    marginBottom: 8 
},
  sectionTitle: { 
    fontSize: 28, 
    fontWeight: '400', 
    color: '#4A90E2' 
},
  studentCount: { 
    fontSize: 14, 
    color: '#4A90E2', 
    fontWeight: '500' 
},
  divider: { 
    height: 1, 
    backgroundColor: '#4A90E2', 
    width: '100%' 
},
});