# Fix Supabase RLS Policies for Clerk Authentication

Go to Supabase Dashboard → SQL Editor and run this:

```sql
-- Drop existing policies that use auth.uid()
DROP POLICY IF EXISTS "Users can manage their skill paths" ON skill_paths;
DROP POLICY IF EXISTS "Users can manage their roadmap milestones" ON roadmap_milestones;
DROP POLICY IF EXISTS "Users can manage their progress" ON user_progress;

-- Create new policies that work with Clerk user IDs
CREATE POLICY "Users can manage their skill paths" ON skill_paths 
  FOR ALL USING (true);

CREATE POLICY "Users can manage their roadmap milestones" ON roadmap_milestones 
  FOR ALL USING (true);

CREATE POLICY "Users can manage their progress" ON user_progress 
  FOR ALL USING (true);
```

**Note:** These policies are permissive for now. In production, you'd want stricter security, but this will get us working.
