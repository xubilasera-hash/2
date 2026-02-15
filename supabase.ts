
import { createClient } from '@supabase/supabase-js';

// Supabase configuration using the provided project ID and anon key.
const supabaseUrl = 'https://xtzkofefochhijeyxfgu.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0emtvZmVmb2NoaGlqZXl4Zmd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNjI2NDIsImV4cCI6MjA4NjczODY0Mn0.ab5NpfNeI0ze6KUpKiJfnWVVqBZkPv_1PD0pDzQq5Tw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
