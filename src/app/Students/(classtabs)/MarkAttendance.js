import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, PermissionsAndroid, Alert, BackHandler } from "react-native";
import { BleManager } from 'react-native-ble-plx';
import { Camera } from 'react-native-vision-camera';
import { Buffer } from "buffer";
import { useNavigation } from "expo-router";
import { useAttendanceApi } from "@/api/attendance.api";
import LoadingScreen, { LoadingScreenSmall } from "@/components/LoadingScreen";
import CameraScreen from "@/components/CameraScreen";
import { DataContext } from "./_layout";

// Initialize BLE Manager outside the component
const bleManager = new BleManager();
const CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

export default function ClassMarkAttendance() {
    const navigation = useNavigation()
    const { classroomDetails, attendanceMarked, setAttendanceMarked, loading, fetchAttendance } = useContext(DataContext);
    const classId = classroomDetails.classroom;
    const { getLiveAttendanceSession, verifyAndMarkAttendance } = useAttendanceApi();
    
    // State Management
    const [step, setStep] = useState('IDLE'); // IDLE | SCANNING | CAMERA | UPLOADING | SUCCESS
    const [statusMessage, setStatusMessage] = useState('Ready to mark attendance');
    
    // Store BLE session data for the API call
    const [bleSessionData, setBleSessionData] = useState({ uuid: null, token: null });
    const [hasCameraPermission, setHasCameraPermission] = useState(false);


    useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
        if (step === 'IDLE') return;
      e.preventDefault();
    });
    return unsubscribe;
    }, [navigation, step])

    useEffect(()=> {
        const onBackPress = () => {
            if (step === 'IDLE') return false;
            return true;
        }
        const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => subscription.remove();
        }, [step]);

    useEffect(() => {
        return () => {
            bleManager.stopDeviceScan();
        };
    }, []);

    useEffect(() => {
    if (step === "CAMERA") {
        navigation.setOptions({ headerShown: false }); 
    } else {
        navigation.setOptions({ headerShown: true });
    }
    }, [step, navigation]);

    useEffect(() => {
        const isProcessing = step !== 'IDLE';

        navigation.setOptions({
            headerShown: step !== 'CAMERA',   
            headerBackVisible: !isProcessing, 
            gestureEnabled: !isProcessing,    
            tabBarStyle: { display: isProcessing ? 'none' : 'flex' },
        });
    }, [step, navigation]);

    // Request Necessary Permissions (BLE + Camera)
    const requestPermissions = async () => {
        const cameraStatus = await Camera.requestCameraPermission();
        setHasCameraPermission(cameraStatus === 'granted');

        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            ]);
            
            if (
                granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] !== PermissionsAndroid.RESULTS.GRANTED ||
                granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] !== PermissionsAndroid.RESULTS.GRANTED
            ) {
                Alert.alert("Permission Error", "Bluetooth permissions are required to mark attendance.");
                return false;
            }
        }
        return cameraStatus === 'granted';
    };

    const handlePress = async () => {
        const liveAttendanceResponce = await getLiveAttendanceSession(classroomDetails.classroom);
        if (liveAttendanceResponce.is_active && liveAttendanceResponce.marked_attendance){
            setAttendanceMarked(liveAttendanceResponce.attendance_status);
            return;
        }
        else if (!liveAttendanceResponce.is_active) {
            Alert.alert("Error", "No Active Attendance Session");
            return;
        }
        
        const serviceUUID = liveAttendanceResponce?.session_id?.toLowerCase();

        const btState = await bleManager.state();
        if (btState === 'PoweredOff') {
            Alert.alert("Bluetooth is Off", "Please turn on your Bluetooth to mark attendance.");
            return;
        }
        
        const hasPermissions = await requestPermissions();
        if (!hasPermissions) return;

        setStep('SCANNING');
        setStatusMessage('Scanning for teacher device...');
        console.log("Started scanning for UUID:", serviceUUID);
        bleManager.startDeviceScan(null , { allowDuplicates: false }, async (error, device) => {
            if (error) {            
                console.error("BLE Scan Error:", error);
                if (error.message.includes('PoweredOff') || error.message.includes('not available')) {
                    Alert.alert("Bluetooth is Off", "Please turn on your Bluetooth.");
                } else {
                    Alert.alert("Scan Error", "Failed to scan. Try again.");
                }
                
                setStep('IDLE');
                setStatusMessage('Ready to mark attendance');
                return;
            }

            // && device.name === "Presence"
            if (device) {
                bleManager.stopDeviceScan();
                console.log(`Found Device! Name: ${device.name}, ID: ${device.id}`);
                setStatusMessage(`Connecting to ${device.name || 'teacher device'}...`);
                
                try {
                    await new Promise(resolve => setTimeout(resolve, 500)); 
                    const connectedDevice = await device.connect({ 
                        autoConnect: false,
                        timeout: 5000       
                    });
                    await connectedDevice.discoverAllServicesAndCharacteristics();                
                    const characteristic = await connectedDevice.readCharacteristicForService(serviceUUID, CHARACTERISTIC_UUID);
                    const token = Buffer.from(characteristic.value, 'base64').toString('utf-8');
                    
                    // SAVE DATA TO STATE AND SWITCH NATIVELY TO CAMERA
                    await connectedDevice.cancelConnection();
                    setBleSessionData({ uuid: serviceUUID, token: token });
                    setStep('CAMERA');
                    setStatusMessage('Token found. Please verify your face.');

                } catch (err) {
                    console.error("Detailed BLE Error:", err.message, err.reason);
                    Alert.alert("Connection Failed", "Could not connect to the device. Please try again.");
                    setStep('IDLE');
                    setStatusMessage('Ready to mark attendance');
                    
                    if (device) {
                        await device.cancelConnection().catch(() => {}); 
                    }
                }
            }
        });
    }

    // API Upload Function
    const handleFaceCapture = async (photo) => {
        setStep('UPLOADING'); 
        
        try {
            const formData = new FormData();
            formData.append('session_id', bleSessionData.uuid);
            formData.append('token', bleSessionData.token);
            
            const faceImage = `file://${photo.path}`;
            formData.append('face_image', {
              uri: faceImage, type: 'image/jpeg', name: 'capture.jpg'
            });
            
            const attendanceResponse = await verifyAndMarkAttendance(formData);
            
            if (attendanceResponse.status === "success"){
              Alert.alert("Success", "Successfully marked attendance");
              setAttendanceMarked('PRESENT'); 
              setStep('IDLE');
            } else {
              Alert.alert("Failed", attendanceResponse.message || "Face not recognized");
              setStep('IDLE'); 
            }
        } catch (error) {
            console.error("Upload error:", error);
            Alert.alert("Error", "Failed to connect to the server.");
            setStep('IDLE');
        }
        finally{
            fetchAttendance();
        }
    };

    // --- FULL SCREEN OVERRIDES ---

    if (step === 'CAMERA') {
        return (
            <View style={styles.cameraContainer}>
                <CameraScreen onVerify={handleFaceCapture} />
            </View>
        );
    }

    if (step === 'UPLOADING') {
        return (
            <View style={[styles.centerContainer]}>
                <View style={{height: 150}}>
                    <LoadingScreenSmall />
                </View>
                <Text style={styles.uploadingText}>Verifying Face...</Text>
                <Text style={styles.uploadingSubtext}>Please wait, checking server securely.</Text>
            </View>
        );
    }

    // --- MAIN UI RENDER ---

    return (
        <View style={styles.centerContainer}>
            <Text style={styles.headerTitle}>Mark Your Presence</Text>
            <Text style={styles.subtitle}>{statusMessage}</Text>
            
            {attendanceMarked === 'PRESENT' ? (
                <View style={styles.showStatus} disabled={true}>
                    <Text style={[styles.showStatusText, {color: "#4CAF50"}]}>You have been marked present</Text>
                </View>
            ) : attendanceMarked === 'ABSENT' ? (
                <View style={styles.showStatus} disabled={true}>
                    <Text style={[styles.showStatusText, {color: "#F44336"}]}>You have been marked absent by the teacher</Text>
                </View>
            ) : step === 'SCANNING' ? (
                <View style={styles.scanningContainer}>
                    <View style={{height: 50}}>
                        <LoadingScreenSmall />
                    </View>
                    <TouchableOpacity 
                        style={[styles.bigButton, styles.cancelButton]} 
                        onPress={() => {
                            bleManager.stopDeviceScan();
                            setStep('IDLE');
                            setStatusMessage('Ready to mark attendance');
                        }}
                    >
                        <Text style={styles.buttonText}>Cancel Scan</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity style={styles.bigButton} onPress={handlePress}>
                    <Text style={styles.bigButtonText}>Give Attendance</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
        padding: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 40,
        textAlign: 'center',
    },
    bigButton: {
        backgroundColor: '#4CAF50',
        width: 250,
        height: 250,
        borderRadius: 125,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    bigButtonText: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#F44336',
        width: 150,
        height: 150,
        borderRadius: 75,
        marginTop: 30,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
    },
    scanningContainer: {
        alignItems: 'center',
    },
    showStatus: {
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center'
    },
    showStatusText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    // New overlay styles
    cameraContainer: { 
        flex: 1, 
        backgroundColor: '#000',
     },
    cancelCameraBtn: {
        position: 'absolute', 
        top: 50, 
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.6)', 
        padding: 10, 
        borderRadius: 8, 
        zIndex: 10
    },
    uploadingText: { 
        color: '#FFF', 
        fontSize: 22, 
        fontWeight: 'bold', 
        marginTop: 20 
    },
    uploadingSubtext: { 
        color: '#AAA', 
        fontSize: 14, 
        marginTop: 10 
    }
});