import { View,StyleSheet,Text } from "react-native";
import { Calendar } from "react-native-calendars";


export default function CalendarPage({markedDates, onPress}) {

const getMarkedDates = () => {
  const marked = {};
  const markCategory = (datesArray, bgColor) => {
    datesArray?.forEach(date => {
      marked[date] = {
        customStyles: {
          container: {backgroundColor: bgColor, borderRadius: 10, width: 40, height: 40},
          text: {color: "white", fontWeight: "bold"},
        },
      };
    });
  };

  const presentDates = markedDates?.present || [];
  const absentDates = markedDates?.absent || [];
  const sessionDates = markedDates?.sessions || [];

  const mixedDates = presentDates.filter(date => absentDates.includes(date));

  const strictlyPresent = presentDates.filter(date => !mixedDates.includes(date));
  const strictlyAbsent = absentDates.filter(date => !mixedDates.includes(date));

  markCategory(sessionDates, "#2153eb");
  markCategory(strictlyPresent, "#4CAF50");
  markCategory(strictlyAbsent, "#F44336");
  markCategory(mixedDates, "#FF9800");
  return marked;
  };


  return (
    <View style={styles.container}>
      <Calendar
        enableSwipeMonths={true}
        markedDates={getMarkedDates()}
        markingType={"custom"}
        theme={{
          todayTextColor: "blue",
          arrowColor: "black",
          monthTextColor: "blue",
          textDayFontSize: 18, 
          textMonthFontSize: 20,
          textDayHeaderFontSize: 16,
        }}
        style={styles.calender}
        onDayPress={onPress}
      />
      { (markedDates.present && markedDates.absent) &&
      (<View style={styles.legendBox}>
        <View style={styles.legendRow}>
          <View style={[styles.dot, { backgroundColor: "green" }]} />
          <Text style={styles.legendText}>Present : {markedDates.present.length}</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.dot, { backgroundColor: "red" }]} />
          <Text style={styles.legendText}>Absent : {markedDates.absent.length}</Text>
        </View>
        <Text style={styles.percentage}>PERCENTAGE : {Math.round((markedDates.present.length/(markedDates.present.length+markedDates.absent.length))*100)} %</Text>
      </View>
    )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: "#F8F9FA" 
  },
  calender: {
    borderRadius: 10,
    elevation: 4,
    padding: 30,
  },
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





