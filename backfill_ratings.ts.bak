import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Simulate Next.js context to load env vars from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing supabase credentials in env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const RATING_SYSTEM = {
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
            if (award.medal && RATING_SYSTEM.medals[award.medal as keyof typeof RATING_SYSTEM.medals]) {
                medalPoints += RATING_SYSTEM.medals[award.medal as keyof typeof RATING_SYSTEM.medals];
            }
        });
    }

    medalPoints = Math.min(medalPoints, RATING_SYSTEM.maxMedalPoints);

    let finalScore = attendancePoints + medalPoints;
    finalScore = Math.min(finalScore, RATING_SYSTEM.maxTotalScore);

    return finalScore;
}

async function run() {
    console.log("Fetching students...");
    const { data: students, error: studentsError } = await supabase.from('students').select('*');
    if (studentsError) throw studentsError;

    console.log("Fetching awards...");
    const { data: awards, error: awardsError } = await supabase.from('student_awards').select('*');
    if (awardsError) throw awardsError;

    for (const student of students) {
        const studentAwards = awards.filter(a => a.student_id === student.id);
        const newRating = calculateStudentRating(student, studentAwards);

        console.log(`Updating student ${student.display_name} rating from ${student.rating_points} to ${newRating}`);

        await supabase.from('students').update({ rating_points: newRating }).eq('id', student.id);
    }

    console.log("Done.");
}

run().catch(console.error);
