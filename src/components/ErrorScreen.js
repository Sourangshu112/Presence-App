import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ErrorScreen({ 
    message = "Something went wrong! Could not load data.", 
    onRetry 
}) {
    return (
        <View style={styles.container}>
            <Ionicons name="alert-circle-outline" size={64} color="#F44336" />
            <Text style={styles.errorText}>{message}</Text>
            
            {onRetry && (
                <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                    <Ionicons name="refresh-outline" size={20} color="#FFF" style={styles.retryIcon} />
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        padding: 24,
    },
    errorText: {
        fontSize: 18,
        color: '#555',
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 24,
        lineHeight: 24,
    },
    retryButton: {
        flexDirection: 'row',
        backgroundColor: '#4A90E2', // Matches your People.js theme color
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    retryIcon: {
        marginRight: 8,
    },
    retryText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    }
});