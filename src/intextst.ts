import inquirer from 'inquirer';
import { getSpecialtyFromAI } from './ai';
import { findTherapist } from './supabase';
import { bookMeeting } from './calendar';
import { createClient } from '@supabase/supabase-js';

// Supabase test connection
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

async function testSupabaseConnection() {
  const { data, error } = await supabase.from('therapists').select('*');

  if (error) {
    console.error('❌ Supabase connection failed:', error.message);
  } else {
    console.log('✅ Supabase connected successfully.');
    console.log('Therapists table contents:', data);
  }
}

async function main() {
  // Step 1: Test Supabase
  await testSupabaseConnection();

  // Step 2: Continue with chatbot logic
  const { name, problem, time, insurance } = await inquirer.prompt([
    { type: 'input', name: 'name', message: "Patient's full name:" },
    { type: 'input', name: 'problem', message: "Describe your issue:" },
    { type: 'input', name: 'time', message: "Preferred time (ISO format):" },
    { type: 'input', name: 'insurance', message: "Insurance Provider:" }
  ]);

  console.log("\n🧠 Determining the appropriate therapist...");
  const specialty = await getSpecialtyFromAI(problem);
  console.log(`Matched Specialty: ${specialty}`);

  const therapist = await findTherapist(specialty);
  if (!therapist) {
    console.error("❌ No therapist found for this specialty.");
    return;
  }

  console.log(`✅ Therapist found: ${therapist.name} (${therapist.email})`);

  const meetingLink = await bookMeeting(name, therapist.email, time);
  console.log(`📅 Meeting booked: ${meetingLink}`);
}

main();
