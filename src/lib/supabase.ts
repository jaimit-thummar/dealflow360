import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xetipabeekjitdmkbnaz.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhldGlwYWJlZWtqaXRkbWtibmF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1NzEwMzksImV4cCI6MjEwNDE0NzAzOX0.rPuCHWm2xcy_T8hQxgzdzzuMq1C05-yeCJwt-53R1kI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
