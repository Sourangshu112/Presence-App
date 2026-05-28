import React, { useState, useContext } from "react";
import { View, Text, FlatList, StyleSheet, Touchable, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";
import { useAttendanceApi } from "@/api/attendance.api";
import { DataContext } from "./_layout";


export default function ViewAttendancePerSession() {
    const { sId, date } = useLocalSearchParams();
    const {attendanceOverview, refetchAttendance} = useContext(DataContext);
    const {patchAttendance} = useAttendanceApi()
    const [loading, setLoading] = useState(false);
    

    // 1. DERIVE THE MAPPING
    // We map over the roster to build a clean list of students and their statuses
    const attendanceList = attendanceOverview?.roster?.map(student => {
        const record = attendanceOverview.records?.find(
            r => r.session_id === sId && r.student_id === student.student_id
        );

        return {
            student_id: student.student_id,
            name: student.name,
            status: record ? record.status : "UNMARKED"
        };
    }) || []; 

    const handleUpdate = async (student_id, current_status) => {
        try{
            setLoading(true)
            const new_status = (current_status === "PRESENT")? "ABSENT" : "PRESENT";

            const responce = await patchAttendance({
                session_id: sId,
                student_id: student_id,
                current_status: current_status,
                new_status: new_status,
            })
        if (responce.message === "Attendance successfully updated.") {
            refetchAttendance();
            Alert.alert("Success", responce.message);
        } else throw new Error;
        }catch (error){
            Alert.alert("Failed", "Could not Update Attendance. Try again!")
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    // 2. RENDER THE UI
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Attendance Details of {"\n"}{date}</Text>

            <FlatList
                data={attendanceList}
                keyExtractor={(item) => item.student_id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.studentName}>{item.name}</Text>
                        
                        { !(loading) ? <TouchableOpacity onPress={() => handleUpdate(item.student_id, item.status)}>
                        <Text style={[
                            styles.statusBadge,
                            item.status === 'PRESENT' ? styles.present : 
                            item.status === 'ABSENT' ? styles.absent : styles.unmarked
                        ]}>
                            {item.status}
                        </Text>
                        </TouchableOpacity>: <Text>Loading</Text>}
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No students found in roster.</Text>
                }
            />
            <View style={styles.footerContainer}>
                <Text style={styles.footer}>Click the PRESENT or ABSENT to update them</Text>
            </View>
        </View>
    );
}

export const styles = StyleSheet.create({
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