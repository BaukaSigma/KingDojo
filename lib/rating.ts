import { Student, StudentAward } from "./types";

export const RATING_SYSTEM = {
    // We aim for a max score of 100. 
    // Let's allocate 60 points max for perfect attendance, and 40 points max for medals.
    maxTotalScore: 100,
    maxAttendancePoints: 60,
    maxMedalPoints: 40,
    medals: {
        gold: 15,
        silver: 10,
        bronze: 5,
        other: 2
    }
};

/**
 * Calculates a student's total rating points based on attendance and awards.
 * The maximum possible score is 100.
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
    } // if total_classes is 0, they get 0 attendance points.

    // 2. Calculate Medal Points (Max 40)
    if (awards && awards.length > 0) {
        awards.forEach(award => {
            if (award.medal && RATING_SYSTEM.medals[award.medal]) {
                medalPoints += RATING_SYSTEM.medals[award.medal];
            }
        });
    }

    // Cap medal points so that someone with a billion medals doesn't exceed 40 points from medals alone
    medalPoints = Math.min(medalPoints, RATING_SYSTEM.maxMedalPoints);

    // 3. Final Score is the sum, capped at 100 just in case.
    let finalScore = attendancePoints + medalPoints;
    finalScore = Math.min(finalScore, RATING_SYSTEM.maxTotalScore);

    return finalScore;
}
