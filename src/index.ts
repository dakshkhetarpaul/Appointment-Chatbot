import inquirer from 'inquirer';
import { getSpecialtyFromAI } from './ai';
import { findTherapist } from './supabase';
import { bookMeeting } from './calendar';

async function main() {
    const { name, problem, time, insurance } = await inquirer.prompt([
        { type: 'input', name: 'name', message: "Patient's full name:" },
        { type: 'input', name: 'problem', message: "Describe your issue:" },
        { type: 'input', name: 'time', message: "Preferred time (ISO format):" },
        { type: 'input', name: 'insurance', message: "Insurance Provider:" }
      ]);

  console.log("\nDetermining the appropriate therapist...");
  const specialty = await getSpecialtyFromAI(problem);
  console.log(`Matched Specialty: ${specialty}`);

  const therapist = await findTherapist(specialty);
  if (!therapist) {
    console.error("No therapist found for this specialty.");
    return;
  }

  console.log(`Therapist found: ${therapist.name} (${therapist.email})`);

  const meetingLink = await bookMeeting(name, therapist.email, time);
  console.log(`Meeting booked: ${meetingLink}`);
}

main();
