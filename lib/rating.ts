import { Student, StudentAward } from "./types";

export const RATING_SYSTEM = {
    // 60 points max for perfect attendance, unlimited points for medals
    maxAttendancePoints: 60,
    medals: {
        gold: 15,
        silver: 10,
        bronze: 5,
        other: 2
    }
};

/**
 * Calculates a student's total rating points based on attendance and awards.
 * There is no maximum score limit.
 */
export function calculateStudentRating(student: Partial<Student>, awards: Partial<StudentAward>[]): number {
    let attendancePoints = 0;
    let medalPoints = 0;

    // 1. Calculate Attendance Points (Max 60)
    const { attended_classes = 0, total_classes = 0 } = student;
    if (total_classes > 0) {
        // Find the percentage of attended classes
        const attendancePercentage = Math.min((attended_classes / total_classes), 1.0);
        attendancePoints = Math.round(attendancePercentage * RATING_SYSTEM.maxAttendancePoints);
    }

    // 2. Calculate Medal Points (No Limit)
    if (awards && awards.length > 0) {
        awards.forEach(award => {
            if (award.medal && RATING_SYSTEM.medals[award.medal]) {
                medalPoints += RATING_SYSTEM.medals[award.medal];
            }
        });
    }

    // 3. Final Score is the sum, no ultimate cap.
    return attendancePoints + medalPoints;
}
