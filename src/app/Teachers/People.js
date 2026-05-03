// src/app/(teacher)/(classtabs)/People.js
import React from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PersonRow from '@/components/ui/PersonRow';

const PEOPLE_DATA = [
  {
    title: 'Teachers',
    data: [{ id: 't1', name: 'Dr. A. Sharma' }],
  },
  {
    title: 'Students', // Changed title slightly for the teacher's perspective
    data: [
      { id: 's1', name: 'Aarav Patel' },
      { id: 's2', name: 'Diya Singh' },
    ],
  },
];

export default function TeacherPeopleScreen() {
  
  const handleAddStudent = () => {
    Alert.alert("Invite Student", "Open modal to add student email or send invite link.");
  };

  const renderSectionHeader = ({ section: { title, data } }) => (
    <View style={styles.sectionHeaderContainer}>
      <View style={styles.sectionHeaderTop}>
        <Text style={styles.sectionTitle}>{title}</Text>
        
        {title === 'Students' && (
          <View style={styles.actionHeaderRight}>
            <Text style={styles.studentCount}>{data.length} students</Text>
            <TouchableOpacity onPress={handleAddStudent} style={styles.addIcon}>
              <Ionicons name="person-add" size={22} color="#4A90E2" />
            </TouchableOpacity>
          </View>
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
  actionHeaderRight: { 
    flexDirection: 'row', 
    alignItems: 'center' 
},
  studentCount: { 
    fontSize: 14, 
    color: '#4A90E2', 
    fontWeight: '500', 
    marginRight: 12 
},
  addIcon: { 
    padding: 4 
},
  divider: { 
    height: 1, 
    backgroundColor: '#4A90E2', 
    width: '100%' 
},
});