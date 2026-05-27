import React from "react";
import { useLocalSearchParams } from "expo-router";
import { updateMarkedDate } from "@/utils/dateTime";
import CalendarPage from "@/components/calendarPage";
import { View, Text, StyleSheet } from "react-native";

export default function ViewAttendancePerStudent() {
    const {stuId , data} = useLocalSearchParams();
    const parsedData = data ? JSON.parse(data) : null;
    // 1. Initialize the target structure
    const presentDates = [];
    const absentDates = [];

    const stu_name = parsedData.roster.find(r => r.student_id === stuId)["name"]
    

    // 2. Map the data safely
    if (parsedData?.records && parsedData?.sessions) {
        const studentRecords = parsedData.records.filter(r => r.student_id === stuId);
        studentRecords.forEach(record => {
            const session = parsedData.sessions.find(s => s.session_id === record.session_id);
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

    // This is the final object you requested
    const attendanceData = {
        present: presentDates,
        absent: absentDates
    };

    // 3. Render the UI
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Attendance Calendar of <Text style={styles.name}>{stu_name}</Text></Text>
            
            <CalendarPage markedDates={attendanceData} />
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
        margin: 16,
        color: '#333',
    },
    name: {
        color: "#2448eb",
    }
});
