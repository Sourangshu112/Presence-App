import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, FlatList, PermissionsAndroid, Platform, Alert} from 'react-native';
import { DataContext } from './_layout';
import { useNavigation } from 'expo-router';
import StudentRow from '@/components/ui/markAttendanceStudentComponenet';
import LoadingScreen, {LoadingScreenSmall} from '@/components/LoadingScreen';
import { useAttendanceApi } from '@/api/attendance.api';
import Peripheral, {Permission, Property} from 'react-native-multi-ble-peripheral';
import { Buffer } from 'buffer';


const { height, width } = Dimensions.get('window');
const CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

export default function MarkAttendance() {

  const generateBLE = () => {
    const generatedBleToken = Math.random().toString(36).substring(2, 8).toUpperCase();
    return generatedBleToken;
  }

  const navigation = useNavigation()
  const {createSession, stopSession, fetchLiveAttendance,  updateAttendance} = useAttendanceApi()
  const { classroomData, fetchAttendance } = useContext(DataContext);
  const students = classroomData?.students || []; 
  const classroomId = classroomData?.classroom_id || 'default_class_id';

  const [isMarking, setIsMarking] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [attendanceState, setAttendanceState] = useState({});
  const [currentBleToken, setCurrentBleToken] = useState('');
  const sessionIdRef = useRef(null);

  const peripheralRef = useRef(null);

  // Initialize everyone as "Unmarked" when the component loads
  useEffect(() => {
    if (students.length > 0) {
      const initialMap = {};
      students.forEach(student => {
        initialMap[student.student_id] = 'UNMARKED';
      });
      setAttendanceState(initialMap);
    }
  }, [students]);


  useEffect(() => {
    const setupBLE = async () => {
      if (Platform.OS === 'android') {
        try {
          await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
          ]);
        } catch (err) {
          console.warn("BLE Permissions error:", err);
        }
      }

      // Configure device identity
      // Peripheral.setDeviceName('Presence');
      const p = new Peripheral();
      peripheralRef.current = p;
    };

    setupBLE();

    // Cleanup: Stop advertising when component unmounts
    return () => {
      if (peripheralRef.current) {
        peripheralRef.current.stopAdvertising();
      }
    };
  }, []);

  // 2. Animation Values
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const listTranslateY = useRef(new Animated.Value(height)).current;
  const footerTranslateY = useRef(new Animated.Value(300)).current;

  // 3. Start Attendance & Trigger Animations
  const handleStartAttendance = async () => {
    try{
      setIsDisabled(true);
      setIsMarking(true);
      const token = generateBLE();
      setCurrentBleToken(token);

      const sessionCreateResponce = await createSession(classroomId,token)
      if(sessionCreateResponce.message === "success")
        sessionIdRef.current = sessionCreateResponce.session.session_id;
      else
        throw new Error();
      if (peripheralRef.current) {
        await peripheralRef.current.addService(sessionIdRef.current, true);
        await peripheralRef.current.addCharacteristic(
          sessionIdRef.current,
          CHARACTERISTIC_UUID,
          Property.READ | Property.WRITE,
          Permission.READABLE | Permission.WRITEABLE
        );
        await peripheralRef.current.updateValue(sessionIdRef.current,CHARACTERISTIC_UUID, Buffer.from(token));
        await peripheralRef.current.startAdvertising();
        console.log("Broadcasting BLE token:", token);
      }
      else 
        throw new Error();
      }
    catch (error) {
      Alert.alert("Failed", "Failed to start attendance session! Please try again.");
      setIsDisabled(false);
      setIsMarking(false);
      console.log(error)
      return;
    }

      navigation.setOptions({tabBarStyle: { display: 'none' }})
      Animated.parallel([
        // Slide header UP and out of view
        Animated.timing(headerTranslateY, {
          toValue: -220, 
          duration: 600,
          useNativeDriver: true,
        }),
        // Slide student list UP from the bottom
        Animated.timing(listTranslateY, {
          toValue: 0, 
          duration: 600,
          useNativeDriver: true,
        })
      ]).start();
      setIsDisabled(false);
  };

const handleStopAttendance = async () => {
    try { 
      setIsDisabled(true);
      setIsMarking(false); // This automatically stops your useEffect polling

      // Stop BLE broadcast but DO NOT close the session on the backend yet
      if (peripheralRef.current) {
          await peripheralRef.current.stopAdvertising();
          console.log("Stopped BLE broadcast");
      }
    } 
    catch (error){
      setIsDisabled(false);
      setIsMarking(true);
      Alert.alert("Failed", "Could not stop broadcast. Please try again.");
      return;
    }

    // Push header further out, slide list up slightly, bring footer to natural position
    Animated.parallel([
      Animated.timing(headerTranslateY, {
        toValue: -500, 
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(listTranslateY, {
        toValue: -250, // Move list up so the footer doesn't overlap the bottom items
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(footerTranslateY, {
        toValue: 50, // Slide into view at bottom: 0
        duration: 500,
        useNativeDriver: true
      })
    ]).start();
    
    setIsDisabled(false);
  };

  const handleConfirmAttendance = async () => {
    try {
      setIsDisabled(true);
      
      // Now we actually close the session on the backend
      const stopSessionResponse = await stopSession(classroomId, sessionIdRef.current);
      if (stopSessionResponse.message !== "success") {
        throw new Error();
      }

      Alert.alert("Success", "Attendance session confirmed and saved.");

      // Restore Tab Bar ('flex' is the standard display property for React Navigation)
      navigation.setOptions({tabBarStyle: { display: 'flex' }});

      // Animate everything back to the initial starting positions
      Animated.parallel([
        Animated.timing(headerTranslateY, {
          toValue: 0, 
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(listTranslateY, {
          toValue: height, // Push list back down off-screen
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(footerTranslateY, {
          toValue: 300, // Push footer back down off-screen
          duration: 500,
          useNativeDriver: true
        })
      ]).start();

      // Reset the current token and state if necessary
      setCurrentBleToken('');

    } catch (error) {
      Alert.alert("Failed", "Could not confirm session. Please try again.");
      console.log(error);
    } finally {
      Alert.alert("Success", "Successfully completed attendance session");
      fetchAttendance();
      setIsDisabled(false);
    }
  };

  const handlePress = () => {
    if (!isMarking) handleStartAttendance();
    else handleStopAttendance();
  }

  const handleUpdateStatus = async (studentId, newStatus) => {    
    setIsUpdating(true);
    try {
      const dataObj = {
        class_id: classroomId,
        session_id: sessionIdRef.current,
        student_id: studentId,
        status: newStatus
      }
      const updateAttendanceResponce = await updateAttendance(dataObj);
      if (updateAttendanceResponce.action === "CREATED" || updateAttendanceResponce.action === "UPDATED")
        setAttendanceState(prev => ({ ...prev, [studentId]: newStatus }));
    } catch (error) {
      console.error("Failed to update database:", error);
      Alert.alert("Failed", "Failed to update manually");
      setIsUpdating(false);
    }
    finally{
      setIsUpdating(false);
    }
  };

  // 5. Short Polling for Automated System
  useEffect(() => {
    let pollingInterval;
    let count = 1;
    if (isMarking) {
      pollingInterval = setInterval(async () => {
        try {
          // Fetch from your database to see if the automated system updated anything
          const automatedUpdates = await fetchLiveAttendance(classroomId, sessionIdRef.current);
          if (automatedUpdates && automatedUpdates.present_students) {
            setAttendanceState(prevState => {
              const newState = { ...prevState };
              let hasChanges = false;

              automatedUpdates.present_students.forEach(studentId => {
                // 3. Only update if they aren't already marked 'Present'
                if (newState[studentId] !== 'PRESENT') {
                  newState[studentId] = 'PRESENT';
                  hasChanges = true;
                }
              });
              return hasChanges ? newState : prevState;
            });
          }
        } catch (error) {
          console.error("Polling failed:", error);
        }
        count++;
      }, 5000); 
    }

    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [isMarking, classroomId]);


  return (
    <View style={styles.container}>
      
      {/* HEADER SECTION (Slides Up) */}
      <Animated.View 
        style={[
          styles.headerContainer, 
          { transform: [{ translateY: headerTranslateY }] }
        ]}
      >
        <Text style={styles.headerTitle}>Daily Attendance</Text>
        <Text style={styles.headerSubtitle}>Ready to start today's session?</Text>
        
        <TouchableOpacity disabled={isDisabled} style={[styles.bigButton, {backgroundColor: isMarking ? "#F44336": "#4CAF50"}]} onPress={handlePress}>
          <Text style={styles.bigButtonText}>{isMarking ? "Stop" : "Start"} Attendance</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* STUDENT LIST SECTION (Slides up from bottom) */}
      <Animated.View 
        style={[
          styles.listContainer, 
          { transform: [{ translateY: listTranslateY }] }
        ]}
      >
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Students</Text>
          <LoadingScreenSmall />
        </View>

        <FlatList
          data={students}
          keyExtractor={(item) => item.student_id.toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <StudentRow 
              student={item} 
              status={attendanceState[item.student_id]} 
              onUpdateStatus={handleUpdateStatus}
              updating={isUpdating} 
            />
          )}
        />
      </Animated.View>

      <Animated.View style={[
        styles.footerContainer,
        { transform: [{ translateY: footerTranslateY }] }
        ]}>
          <Text style={styles.footer}>The broadcast is turned off but you can still check and update before comfimring</Text>
          <TouchableOpacity 
          style={[styles.bigButton, {backgroundColor: "#1976D2"}]}
          onPress={handleConfirmAttendance}
          disabled={isDisabled}
          >
            <Text style={styles.bigButtonText}>Confirm</Text>
          </TouchableOpacity>
      </Animated.View>
      
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  // Header Styles
  headerContainer: {
    position: 'absolute',
    top: 0,
    width: width,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  bigButton: {
    backgroundColor: '',
    width: width * 0.8,
    paddingVertical: 20,
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  bigButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  // List Styles
  listContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 20,
    paddingTop: 20,
    paddingHorizontal: 15,
    shadowColor: '#000',
    zIndex: 10
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  listTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  footer: {
        padding: 15,
        fontWeight: "700", 
        color: "#555", 
    },
  footerContainer: {
      position: "absolute",
      bottom: 0, 
      left: 0,   
      right: 0,   
      zIndex: 10,
      backgroundColor: "white",
      alignItems: "center",
      paddingVertical: 16, 
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
      height: 250
  }
});