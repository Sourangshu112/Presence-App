import React, {useState, useContext} from "react";
import { useNavigation } from "expo-router";
import { View, Text, Button, StyleSheet } from "react-native";

export default function markAttendance() {
  const navigation = useNavigation();
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const handlePress = () => {
    const nextState = !isHeaderVisible;
    setIsHeaderVisible(nextState);
    
    // Dynamically update the header options
    navigation.setOptions({ headerShown: nextState });
  };

  return (
    <View style={styles.container}>
      <Text>Attendance Screen</Text>
      
      <Button 
        style={styles.attendanceButton}
        title={isHeaderVisible ? "Hide Header" : "Show Header"} 
        onPress={handlePress} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },

});


