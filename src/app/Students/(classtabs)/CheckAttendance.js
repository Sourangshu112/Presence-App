import react from "react";
import ShowCalendar from "../../../components/ui/calendar";
import { View,Text,StyleSheet } from "react-native";

function SetCalender(){

    const { subjectId, subjectName } = ["English", 1];
    const fetchDates = () => {
        //This function will be used to fetch the dates from the database... for now it rerturn const dates
        //using the subject name/id
        return  {
                present: ["2026-05-01","2026-05-02","2026-05-03","2026-05-05","2026-05-08","2026-05-09","2026-05-10","2026-05-11"],
                absent: ["2026-05-04","2026-05-12"]
        };
    };

    const dates = fetchDates();
    return(
        <View style={styles.container}>
            <ShowCalendar markedDates={dates}/>

            <View style={styles.legendBox}>
                    <View style={styles.legendRow}>
                      <View style={[styles.dot, { backgroundColor: "green" }]} />
                      <Text style={styles.legendText}>Present : {dates.present.length}</Text>
                    </View>
                    <View style={styles.legendRow}>
                      <View style={[styles.dot, { backgroundColor: "red" }]} />
                      <Text style={styles.legendText}>Absent : {dates.absent.length}</Text>
                    </View>
                    <Text style={styles.percentage}>PERCENTAGE : {Math.round((dates.present.length/(dates.present.length+dates.absent.length))*100)} %</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F8F9FA" },
  legendBox: {
    marginTop: 16,
    padding: 20,
    borderRadius: 8,
    backgroundColor: "#f5f8ff",
  },
  legendRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 4 
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: { 
    fontSize: 18, 
  },
  percentage: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: "bold",
    color: "blue",
  },
});


export default SetCalender;