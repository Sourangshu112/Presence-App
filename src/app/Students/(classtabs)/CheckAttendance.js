import React, { useState, useMemo, useContext } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from "react-native";
import { DataContext } from "./_layout";
import CalendarPage from "@/components/calendarPage";
import { updateMarkedDate, normalDate } from "@/utils/dateTime";

export default function CheckAttendance() {
    // Pulling the flat array of attendance data from context
    const { attendanceData } = useContext(DataContext);
    
    const [selectedDate, setSelectedDate] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    // 1. Process data for CalendarPage format { present: [...], absent: [...] }
    const formattedCalendarData = useMemo(() => {
        const presentDates = [];
        const absentDates = [];

        if (attendanceData && Array.isArray(attendanceData)) {
            attendanceData.forEach(record => {
                const formattedDate = updateMarkedDate(record.date); 
                
                if (record.status === 'PRESENT') {
                    presentDates.push(formattedDate);
                } else if (record.status === 'ABSENT') {
                    absentDates.push(formattedDate);
                }
            });
        }
        
        return { present: presentDates, absent: absentDates };
    }, [attendanceData]);

    // 2. Handle Modal interactions
    const handleDayPress = (day) => {
        setSelectedDate(day.dateString);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        // Clear the selected date after the slide-down animation finishes
        setTimeout(() => setSelectedDate(null), 300); 
    };

    // 3. Extract session details for the clicked date
    const selectedDayDetails = useMemo(() => {
        if (!selectedDate || !attendanceData) return [];

        const recordsOnDate = attendanceData.filter(
            record => updateMarkedDate(record.date) === selectedDate
        );

        return recordsOnDate.map((record, index) => ({
            id: record.session_id,
            title: `Session ${index + 1}`,
            status: record.status || "UNMARKED"
        }));
    }, [selectedDate, attendanceData]);

    // 4. Render UI
    return (
        <View style={styles.container}>
                        
            <CalendarPage markedDates={formattedCalendarData} onPress={handleDayPress} />
            
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
                                Details for {selectedDate ? normalDate(selectedDate) : ''}
                            </Text>
                            <TouchableOpacity onPress={closeModal}>
                                <Text style={styles.closeButton}>Close</Text>
                            </TouchableOpacity>
                        </View>
                        
                        {selectedDayDetails.map(item => (
                            <View key={item.id} style={styles.recordRow}>
                                <Text style={styles.sessionTitle}>{item.title}</Text>
                                <Text style={[
                                    styles.statusBadge,
                                    item.status === 'PRESENT' ? styles.present : 
                                    item.status === 'ABSENT' ? styles.absent : styles.unmarked
                                ]}>
                                    {item.status}
                                </Text>
                            </View>
                        ))}

                        {selectedDayDetails.length === 0 && (
                            <Text style={styles.emptyText}>No sessions recorded for this date.</Text>
                        )}
                        
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
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end', 
        backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20, 
        borderTopRightRadius: 20,
        padding: 24,
        minHeight: '30%', 
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
        color: '#2153eb', 
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
    }
});