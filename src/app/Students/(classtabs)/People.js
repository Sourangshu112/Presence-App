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
const People_Data_2 = {
    "classroom_id": "2578141e-276e-4a55-9db6-49b75437aaba", 
    "classroom_name": "Class 1", 
    "students": [
        {
            "email": "sourangshustudent@gmail.com", 
            "enrollment_id": "a77373a1-19bc-48df-9f7c-fe3940476bce", 
            "joined_at": "2026-05-07T15:53:21.855639Z", 
            "name": "Sourangshu Student", 
            "student_id": "a09072e2-64aa-4746-9ba9-9cbfb9fb289d"
        }, 
        {
            "email": "amitkirandasadhikari7@gmail.com", 
            "enrollment_id": "27e14d5b-6ee4-4fdf-ba48-5383136f50bc", 
            "joined_at": "2026-05-07T16:05:07.515209Z", 
            "name": "Anal fuck", 
            "student_id": "f81751bf-0f3e-46e1-a432-6dec09bd3176"
        }
    ], 
    "teacher": {
        "email": "sourangshuteacher@gmail.com", 
        "name": "Sourangshu Teacher", 
        "role": "TEACHER", 
        "user_id": "bdbb9267-e2ce-4b6a-8971-835323c1bc3d"
    }, 
    "total_students": 2
}

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