import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const RATING_SYSTEM = {
    maxAttendancePoints: 60,
    medals: {
        gold: 15,
        silver: 10,
        bronze: 5,
        other: 2
    }
};

function calculateStudentRating(student: any, awards: any[]): number {
    let attendancePoints = 0;
    let medalPoints = 0;

    const { attended_classes = 0, total_classes = 0 } = student;
    if (total_classes > 0) {
        const attendancePercentage = Math.min((attended_classes / total_classes), 1.0);
        attendancePoints = Math.round(attendancePercentage * RATING_SYSTEM.maxAttendancePoints);
    }

    if (awards && awards.length > 0) {
        awards.forEach(award => {
            if (award.medal && (RATING_SYSTEM.medals as any)[award.medal]) {
                medalPoints += (RATING_SYSTEM.medals as any)[award.medal];
            }
        });
    }

    return attendancePoints + medalPoints;
}

async function main() {
    console.log("Fetching students...");
    const { data: students, error: studentsError } = await supabase.from('students').select('*');
    if (studentsError) {
        console.error("Error fetching students:", studentsError);
        return;
    }

    console.log("Fetching awards...");
    const { data: awards, error: awardsError } = await supabase.from('student_awards').select('*');
    if (awardsError) {
        console.error("Error fetching awards:", awardsError);
        return;
    }

    console.log("Recalculating ratings...");
    for (const student of students) {
        const studentAwards = awards.filter(a => a.student_id === student.id);
        const newScore = calculateStudentRating(student, studentAwards);

        if (newScore !== student.rating_points) {
            console.log(`Updating ${student.display_name}: ${student.rating_points} -> ${newScore}`);
            const { error: updateError } = await supabase
                .from('students')
                .update({ rating_points: newScore })
                .eq('id', student.id);

            if (updateError) {
                console.error(`Failed to update ${student.display_name}:`, updateError);
            }
        }
    }

    console.log("Done.");
}

main();
