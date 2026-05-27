import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function ViewAttendancePerSession() {
    const { sId, data } = useLocalSearchParams();
    const parsedData = data ? JSON.parse(data) : null;

    // 1. DERIVE THE MAPPING
    // We map over the roster to build a clean list of students and their statuses
    const attendanceList = parsedData?.roster?.map(student => {
        const record = parsedData.records?.find(
            r => r.session_id === sId && r.student_id === student.student_id
        );

        return {
            student_id: student.student_id,
            name: student.name,
            status: record ? record.status : "UNMARKED"
        };
    }) || []; 

    // 2. RENDER THE UI
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Attendance Details</Text>

            <FlatList
                data={attendanceList}
                keyExtractor={(item) => item.student_id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.studentName}>{item.name}</Text>
                        <Text style={[
                            styles.statusBadge,
                            item.status === 'PRESENT' ? styles.present : 
                            item.status === 'ABSENT' ? styles.absent : styles.unmarked
                        ]}>
                            {item.status}
                        </Text>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No students found in roster.</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    studentName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#222',
    },
    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff',
        overflow: 'hidden', // Ensures border radius applies on text in some RN versions
    },
    present: {
        backgroundColor: '#4CAF50', // Green
    },
    absent: {
        backgroundColor: '#F44336', // Red
    },
    unmarked: {
        backgroundColor: '#9E9E9E', // Grey
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#888',
        fontStyle: 'italic'
    }
});