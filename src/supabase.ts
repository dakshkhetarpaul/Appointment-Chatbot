import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
    const { data, error } = await supabase.from('therapists').select('*');
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
    } else {
      console.log('✅ Supabase connected successfully.');
      console.log('Therapists table contents:', data);
    }
  }

export async function findTherapist(specialty: string) {
  const { data, error } = await supabase
    .from('therapists')
    .select('*')
    .ilike('specialty', `%${specialty}%`)
    .limit(1);

  if (error) throw error;
  return data?.[0];
}