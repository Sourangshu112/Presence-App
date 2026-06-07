import react from "react";
import { DotIndicator } from "react-native-indicators";
import { View } from "react-native";

export default function LoadingScreen(){
    return (
        <View style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
            <DotIndicator color={"#1976D2"} />
        </View>
    )
}

export function LoadingScreenSmall() {
    return (
        <View style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
            <DotIndicator color={"#1976D2"} size={8} />
        </View>
    )
}
