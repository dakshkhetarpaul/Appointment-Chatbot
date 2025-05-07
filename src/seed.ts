import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

async function seedTherapists() {
  const { data, error } = await supabase.from('therapists').insert([
    {
      name: 'Dr. Jane Anxiety',
      email: 'jane.anxiety@care.com',
      specialty: 'anxiety'
    },
    {
      name: 'Dr. Bob Depression',
      email: 'bob.depression@care.com',
      specialty: 'depression'
    },
    {
      name: 'Dr. Alice PTSD',
      email: 'alice.ptsd@care.com',
      specialty: 'ptsd'
    }
  ]);

  if (error) {
    console.error('❌ Failed to insert therapists:', error.message);
  } else {
    console.log('✅ Therapists seeded successfully:', data);
  }
}

seedTherapists();
