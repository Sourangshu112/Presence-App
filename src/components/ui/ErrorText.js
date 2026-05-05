import react, {useState} from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ErrorText ({textReceived}){
    const [text,setText] = useState(textReceived)
    return(
        <View>
            <Text style={styles.text}>{text}</Text>
        </View>
    )
}
const styles = StyleSheet.create({
        text:{
            color: "red",
            size: 12,
        }
    })