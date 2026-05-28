import React, {useState, useMemo, useContext} from "react";
import { useLocalSearchParams } from "expo-router";
import { updateMarkedDate, normalDate } from "@/utils/dateTime";
import CalendarPage from "@/components/calendarPage";
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable, ScrollView, Alert } from "react-native";
import { DataContext } from "./_layout";
import { useAttendanceApi } from "@/api/attendance.api";


export default function ViewAttendancePerStudent() {
    const {stuId} = useLocalSearchParams();
    const {attendanceOverview, refetchAttendance} = useContext(DataContext);
    const {patchAttendance} = useAttendanceApi()
    const [loading, setLoading] = useState(false);


    const presentDates = [];
    const absentDates = [];
    const stu_name = attendanceOverview.roster.find(r => r.student_id === stuId)["name"]
    if (attendanceOverview?.records && attendanceOverview?.sessions) {
        const studentRecords = attendanceOverview.records.filter(r => r.student_id === stuId);
        studentRecords.forEach(record => {
            const session = attendanceOverview.sessions.find(s => s.session_id === record.session_id);
            if (session) {
                const formattedDate = updateMarkedDate(session.date);
                if (record.status === 'PRESENT') {
                    presentDates.push(formattedDate);
                } else if (record.status === 'ABSENT') {
                    absentDates.push(formattedDate);
                }
            }
        });
    }
    const attendanceData = {
        present: presentDates,
        absent: absentDates
    };

    const [selectedDate, setSelectedDate] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const handleDayPress = (day) => {
        setSelectedDate(day.dateString);
        setModalVisible(true); // Open the built-in modal
    };

    const closeModal = () => {
        setModalVisible(false);
        // Optional: clear the selected date after the slide-down animation finishes
        setTimeout(() => setSelectedDate(null), 300); 
    };

    const selectedDayDetails = useMemo(() => {
        if (!selectedDate || !attendanceOverview?.records || !attendanceOverview?.sessions) return [];

        const sessionsOnDate = attendanceOverview.sessions.filter(
            session => updateMarkedDate(session.date) === selectedDate
        );

        return sessionsOnDate.map((session, index) => {
            const record = attendanceOverview.records.find(
                r => r.session_id === session.session_id && r.student_id === stuId
            );
            return {
                id: session.session_id,
                title: `Session ${index + 1}`,
                status: record ? record.status : "UNMARKED"
            };
        });
    }, [selectedDate, attendanceOverview, stuId]);

    const handleUpdate = async (session_id, current_status) => {
        try{
            setLoading(true)
            const new_status = (current_status === "PRESENT")? "ABSENT" : "PRESENT";

            const responce = await patchAttendance({
                session_id: session_id,
                student_id: stuId,
                current_status: current_status,
                new_status: new_status,
            })
            if (responce.message === "Attendance successfully updated.") refetchAttendance()
        }catch (error){
            Alert.alert("Failed", "Could not Update Attendance. Try again!")
            console.log(error)
        } finally {
            setLoading(false)
        }
    }


    // 3. Render the UI
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Attendance Calendar of <Text style={styles.name}>{stu_name}</Text></Text>
            <CalendarPage markedDates={attendanceData} onPress={handleDayPress} />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal} 
            >
                {/* Pressable overlay to close the modal when tapping outside */}
                <Pressable style={styles.modalOverlay} onPress={closeModal}>
                    
                    <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
                        
                        <View style={styles.modalHeader}>
                            <Text style={styles.sheetTitle}>
                                Details for {normalDate(selectedDate)}
                            </Text>
                            <TouchableOpacity onPress={closeModal}>
                                <Text style={styles.closeButton}>Close</Text>
                            </TouchableOpacity>
                        </View>
                        
                        {selectedDayDetails.map(item => (
                            <View key={item.id} style={styles.recordRow}>
                                <Text style={styles.sessionTitle}>{item.title}</Text>
                                { !(loading) ? <TouchableOpacity onPress={() => handleUpdate(item.id, item.status)}>
                                    <Text style={[
                                        styles.statusBadge,
                                        item.status === 'PRESENT' ? styles.present : 
                                        item.status === 'ABSENT' ? styles.absent : styles.unmarked
                                    ]}>
                                        {item.status}
                                    </Text>
                                    </TouchableOpacity>: <Text>Loading</Text>}
                            </View>
                        ))}

                        {selectedDayDetails.length === 0 && (
                            <Text style={styles.emptyText}>No data for this date.</Text>
                        )}
                        <View style={styles.footerContainer}>
                            <Text style={styles.footer}>Click the PRESENT or ABSENT to update them</Text>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 10,
        color: '#333',
    },
    name: {
        color: "#2448eb",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end', // Pushes content to the bottom
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dim the background
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20, // Round the top corners
        borderTopRightRadius: 20,
        padding: 24,
        minHeight: '35%', // Ensure it takes up enough space
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sheetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        fontSize: 16,
        color: '#2153eb', // Matches your generic session color
        fontWeight: '600',
    },
    recordRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    sessionTitle: {
        fontSize: 16,
        color: '#444',
    },
    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff',
        overflow: 'hidden',
    },
    present: { backgroundColor: '#4CAF50' },
    absent: { backgroundColor: '#F44336' },
    unmarked: { backgroundColor: '#9E9E9E' },
    emptyText: {
        color: '#888',
        fontStyle: 'italic',
        marginTop: 10,
        textAlign: 'center'
    },
    footer: {
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
        height: 100
    }
});
