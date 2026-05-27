// src/components/PersonRow.js
import React, {useState, useRef} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import UserAvatar from './Avatar';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Dropdown } from 'react-native-element-dropdown';

const dropdownData = [
  { label: 'Check Attendance', value: '1' },
  { label: 'Delete', value: '2' },
]

const { width } = Dimensions.get('window');


// The Main Row Component
export function PersonRowWithoutAction({ item, isTeacher }) {
  return (
    <View style={styles.personRow}>
      <View style={styles.personNameContainer}>
        <UserAvatar name={item.name} isTeacher={isTeacher} />
        <Text style={styles.personName}>{item.name}</Text>
      </View>
    </View>
  );
}

export function PersonRowWithAction({ item, onPressCheckAttendance }) {
  // Temporary functions for your click actions


  const handleDelete = (person) => {
    console.log(`Deleting: ${person.name}`);
    alert(`Deleting: ${person.name}`);
  };

  const handleAction = (value) => {
    if (value === '1') {
      onPressCheckAttendance(item.student_id);
    } else if (value === '2') {
      handleDelete(item);
    }
  };

  // Renders your custom "more" icon inside the dropdown trigger area
  const renderMoreIcon = () => {
    return (
      <View style={styles.moreIconContainer}>
        <AntDesign name="more" size={22} color="black" />
      </View>
    );
  };

  return (
    <View style={styles.personRow}>
      <View style={styles.personNameContainer}>
        <UserAvatar name={item.name} isTeacher={false} />
        <Text style={styles.personName}>{item.name}</Text>
      </View>

      <View>
        <Dropdown
          style={styles.dropdownAnchor}
          containerStyle={styles.menuContainer}
          dropdownPosition='auto'
          data={dropdownData}
          maxHeight={150}
          labelField="label"
          valueField="value"
          placeholder=""
          showChevron={false}
          renderRightIcon={renderMoreIcon} 
          onChange={(selectedItem) => {
            handleAction(selectedItem.value);
          }}
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  personName: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  personNameContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dropdownAnchor: {
    height: 20,  
  },
  moreIconContainer: {
    marginRight: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: 200,
    borderRadius: 8,
    marginTop: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginLeft: -150,
  },
});