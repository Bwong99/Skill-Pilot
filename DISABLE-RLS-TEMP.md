# Temporary Fix: Disable RLS for Testing

Go to Supabase Dashboard → SQL Editor and run this to disable RLS temporarily:

```sql
-- Disable Row Level Security for testing
ALTER TABLE skills DISABLE ROW LEVEL SECURITY;
ALTER TABLE skill_paths DISABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_milestones DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress DISABLE ROW LEVEL SECURITY;
```

**⚠️ Warning:** This makes all data accessible to everyone. Only use for testing!
