import { createClient } from '@supabase/supabase-js';

// Din URL är baserad på ditt Project ID
const supabaseUrl = 'https://fwcagkhuebmutvjpnkfr.supabase.co';

// Din unika Anon Key
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3Y2Fna2h1ZWJtdXR2anBua2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNzQ4NTEsImV4cCI6MjA5Mjg1MDg1MX0.3LGrbs6F6hfRpTQ9RqeoPAwRd6fp1H4XShq7HRkrcMw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
