import { format, isToday, isYesterday } from "date-fns";

export const announcementTime = (date) => {
    const dateObj = new Date(date);

    if (isToday(dateObj)) return `${format(dateObj, "HH:mm")}, Today`;
    if (isYesterday(dateObj)) return `${format(dateObj, "HH:mm")}, Yesterday`;
    
    return format(dateObj, "hh:mm a, dd MMM");
};

export const classDate = (date) => {
    return format(new Date(date), "dd-MM-yyyy")
}