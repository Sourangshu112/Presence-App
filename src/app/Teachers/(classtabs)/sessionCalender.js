import React, { useState, useContext, useMemo } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable, FlatList } from "react-native";
import { useRouter } from "expo-router";
import CalendarPage from "@/components/calendarPage";
import { updateMarkedDate, normalDate, normalTime } from "@/utils/dateTime";
import { DataContext } from "./_layout";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function SetCalender() {
    const { attendanceOverview } = useContext(DataContext);
    const router = useRouter();

    // Modal States
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    // Prepare dates for the calendar
    const dates = {
        sessions: []
    };
    
    attendanceOverview?.sessions?.forEach(session => {
        dates.sessions.push(updateMarkedDate(session.date));
    });

    // Handle tapping a date on the calendar
    const handleDayPress = (date) => {
        if (dates.sessions.includes(date.dateString)) {
            setSelectedDate(date.dateString);
            setModalVisible(true);
        }
    };

    const closeModal = () => {
        setModalVisible(false);
        // Clear the date after the slide-down animation
        setTimeout(() => setSelectedDate(null), 300); 
    };

    // Filter and format the sessions for the selected date
    const filteredSessions = useMemo(() => {
        if (!selectedDate || !attendanceOverview?.sessions) return [];

        return attendanceOverview.sessions
            .filter(session => selectedDate === updateMarkedDate(session.date))
            .map(session => ({
                date: `${normalDate(session.date)} at ${normalTime(session.date)}`,
                session_id: session.session_id,
                rawDate: session.date
            }));
    }, [selectedDate, attendanceOverview]);

    // Navigate to the final attendance view when a session is clicked
    const handleSessionPress = (item) => {
        closeModal(); // Close the bottom sheet
        router.push({
            pathname: "./viewAttendancePerSession",
            params: {
                sId: item.session_id,
                date: item.date
            }
        });
    };

    return (
        <View style={styles.container}>
            <CalendarPage markedDates={dates} onPress={handleDayPress} />

            {/* Bottom Sheet Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <Pressable style={styles.modalOverlay} onPress={closeModal}>
                    <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
                        
                        <View style={styles.modalHeader}>
                            <Text style={styles.sheetTitle}>
                                Sessions for {selectedDate ? normalDate(selectedDate) : ''}
                            </Text>
                            <TouchableOpacity onPress={closeModal}>
                                <Text style={styles.closeButton}>Close</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={filteredSessions}
                            keyExtractor={(item) => item.session_id.toString()}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity 
                                    style={styles.sessionCard} 
                                    onPress={() => handleSessionPress(item)}
                                >
                                    <Text style={styles.sessionTitle}>
                                        Session {index + 1}
                                    </Text>
                                    <Text style={styles.sessionTime}>
                                        {item.date}
                                    </Text>
                                        <MaterialIcons name="arrow-right" size={26} color="black" />
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>No sessions found.</Text>
                            }
                        />
                        
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
    // Modal & Overlay Styles
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
        minHeight: '40%',
        maxHeight: '80%', // Prevents list from overflowing screen on very busy days
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
    // Session Card Styles (Ported from viewSession.js)
    sessionCard: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    sessionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
    },
    sessionTime: {
        fontSize: 14,
        color: '#666',
        alignItems: 'baseline'
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#888',
        fontStyle: 'italic'
    }
});