import react ,{useState, useContext} from "react";
import CalendarPage from "@/components/calendarPage";
import { updateMarkedDate } from "@/utils/dateTime";
import { DataContext } from "./_layout";
import { useRouter } from "expo-router";

export default function SetCalender(){
    const {attendanceOverview} = useContext(DataContext);
    const router = useRouter()
    const dates = {
        sessions : []
    }
    attendanceOverview.sessions.forEach(session => {
        dates.sessions.push(updateMarkedDate(session.date))
    });

    const handlePress = (date) => {
        if (dates.sessions.includes(date.dateString)){
            router.push({
                pathname: "../(viewAttendance)/viewSession",
                params: {
                    date: date.dateString,
                    data: JSON.stringify(attendanceOverview)
                }
            })
        }
    }


    return(
        <CalendarPage markedDates={dates} onPress={handlePress} />
    )
}