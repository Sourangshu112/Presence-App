import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import { LoadingScreenSmall } from "../LoadingScreen";

const dropdownData = [
  { label: 'Present', value: 'PRESENT' },
  { label: 'Absent', value: 'ABSENT' },
  { label: 'Unmarked', value: 'UNMARKED' }
  // { label: 'Excused', value: 'Excused' }
];


const StudentRow = ({ student, status, onUpdateStatus, updating }) => {
  
  const getStatusColor = () => {
    switch(status) {
      case 'PRESENT': return '#4CAF50';
      case 'ABSENT': return '#F44336';
      case 'EXCUSED': return '#FF9800';
      default: return '#757575';
    }
  };

  return (
    <View style={styles.rowContainer}>
      <Text style={styles.studentName}>{student.name}</Text>
      
      <View style={styles.dropdownContainer}>
        {!updating? <Dropdown
          style={[styles.dropdownButton, { borderColor: getStatusColor() }]}
          containerStyle={styles.dropdownOptions}
          data={dropdownData}
          maxHeight={150}
          labelField="label"
          valueField="value"
          value={status}
          onChange={(item) => {
            onUpdateStatus(student.student_id, item.value);
          }}
          selectedTextStyle={[styles.dropdownButtonText, { color: getStatusColor() }]}
          iconColor={getStatusColor()}
        />: <LoadingScreenSmall />
      }
      </View>
    </View>
  );
};

export default StudentRow;

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9F9F9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  dropdownContainer: {
    width: 130,
  },
  dropdownButton: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: '#FFF',
  },
  dropdownButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  dropdownOptions: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  }
});