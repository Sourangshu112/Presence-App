import react, {useState} from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { updateMarkedDate, sessionDateAndTime } from "@/utils/dateTime";


export default function ViewSessions() {
    const router = useRouter()
    const {date, data} = useLocalSearchParams()
    const parsedData = data ? JSON.parse(data) : null;

    const filteredSessions = parsedData?.sessions
        ?.filter(session => date === updateMarkedDate(session.date))
        ?.map(session => ({
            date: sessionDateAndTime(session.date),
            session_id: session.session_id
        })) || [];


    const handlePress = (item) => {
        router.push({
            pathname : "./viewAttendancePerSession",
            params: {
                data: data,
                id: item.session_id
            }
        })
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Sessions for {date}</Text>
            
            <FlatList
                data={filteredSessions}
                keyExtractor={(item) => item.session_id.toString()} 
                renderItem={({ item, index }) => (
                    <TouchableOpacity style={styles.sessionCard} onPress={() => handlePress(item)}>
                        <Text style={styles.sessionTitle}>
                            Session {index + 1}
                        </Text>
                        <Text style={styles.sessionTime}>
                            at {item.date}
                        </Text>
                    </TouchableOpacity>
                )}
                // What to show if the array is empty
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No sessions found for this date.</Text>
                }
            />
        </View>
    );
}

// Basic styling to make it look like a clean list
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
    sessionCard: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2, // For Android shadow
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
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#888',
        fontStyle: 'italic'
    }
});