import { View,StyleSheet,Text } from "react-native";
import { Calendar } from "react-native-calendars";


function ShowCalendar(props) {

const getMarkedDates = () => {
  let marked = {};

  // Present dates -> green circle
  props.markedDates.present.forEach(date => {
    marked[date] = {
      customStyles: {
        container: {
          backgroundColor: "green", borderRadius: 20,
        },
        text: {
          color: "white", fontWeight: "bold",
        },
      },
    };
  });

  // Absent dates -> red circle
  props.markedDates.absent.forEach(date => {
    marked[date] = {
      customStyles: {
        container: {
          backgroundColor: "red", borderRadius: 20,
        },
        text: {
          color: "white", fontWeight: "bold",
        },
      },
    };
  });

  return marked;
};

  return (
    <Calendar
      enableSwipeMonths={true}
      
      // Mark attendance with full background circle
      markedDates={getMarkedDates()}

      // Important: use custom marking
      markingType={"custom"}

      // Theme for spacing & styling
      theme={{
        todayTextColor: "blue",
        arrowColor: "black",
        monthTextColor: "blue",
        textDayFontSize: 18, // bigger date text
        textMonthFontSize: 20,
        textDayHeaderFontSize: 16,
      }}

      // Add style to give more space between rows
      style={{
        borderRadius: 10,
        elevation: 4,
        padding: 30,
      }}
    />
  );
}

export default ShowCalendar;



