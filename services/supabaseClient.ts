import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

export const supabaseUrl = 'https://xkgdpahgeewllqoqzqoc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrZ2RwYWhnZWV3bGxxb3F6cW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MjU2MzYsImV4cCI6MjA3MjAwMTYzNn0.4PNxyzysHZBAj64PBscsuX3YFiieoFPB1oUEENzuxNU';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);