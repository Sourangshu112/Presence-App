import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';

export const attendanceToExcel = async (attendanceOverview) => {
    try {
        const { roster, sessions, records } = attendanceOverview;

        // 1. Sort sessions chronologically by date
        const sortedSessions = [...sessions].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        );

        // 2. Prepare Header Row: [ "Student Name", "2026-05-26", "2026-05-27", ... ]
        const header = [
            'Student Name',
            ...sortedSessions.map(s => s.date.split('T')[0]) // Formats ISO date to YYYY-MM-DD
        ];

        // 3. Build lookup map: attendanceMap[student_id][session_id] = 'P' | 'A'
        const attendanceMap = {};
        records?.forEach(record => {
            if (!attendanceMap[record.student_id]) {
                attendanceMap[record.student_id] = {};
            }
            attendanceMap[record.student_id][record.session_id] = record.status === 'PRESENT' ? 'P' : 'A';
        });

        // 4. Build Data Rows from Roster
        const rows = roster.map(student => {
            const rowData = [student.name];
            sortedSessions.forEach(session => {
                const status = attendanceMap[student.student_id]?.[session.session_id] || 'A';
                rowData.push(status);
            });
            return rowData;
        });

        // 5. Combine Header and Rows
        const worksheetData = [header, ...rows];

        // 6. Create SheetJS Worksheet & Workbook
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Register");

        // 7. Write to Base64
        const base64Output = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });

        // 8. Save and Share File
        const fileName = `Attendance_Register_${Date.now()}.xlsx`;
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;

        await FileSystem.writeAsStringAsync(fileUri, base64Output, {
            encoding: FileSystem.EncodingType.Base64,
        });

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri, {
                mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                dialogTitle: 'Export Attendance Register',
                UTI: 'com.microsoft.excel.xlsx',
            });
        } else {
            alert('Sharing is not supported on this platform');
        }
    } catch (err) {
        return err;
    }
};