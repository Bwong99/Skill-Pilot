# SkillPilot Database Setup Guide

## 🔗 Setup Steps:

1. **Go to your Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your project: "ohsfrkdmdmcuirpqhvph"

2. **Navigate to SQL Editor:**
   - Left sidebar → "SQL Editor"
   - Click "New Query"

3. **Copy and paste this SQL:**

```sql
-- Create Skills Table
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  difficulty_level VARCHAR(50) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  estimated_hours INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Skill Paths Table
CREATE TABLE IF NOT EXISTS skill_paths (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  skill_id UUID REFERENCES skills(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_duration_weeks INTEGER NOT NULL,
  difficulty_level VARCHAR(50) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  status VARCHAR(50) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'paused')),
  ai_generated BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Roadmap Milestones Table
CREATE TABLE IF NOT EXISTS roadmap_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_path_id UUID REFERENCES skill_paths(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  week_number INTEGER NOT NULL,
  estimated_hours INTEGER,
  resources JSONB DEFAULT '[]',
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create User Progress Table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  skill_path_id UUID REFERENCES skill_paths(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES roadmap_milestones(id) ON DELETE CASCADE,
  hours_logged DECIMAL(5,2) DEFAULT 0,
  notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_skill_paths_user_id ON skill_paths(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_milestones_skill_path_id ON roadmap_milestones(skill_path_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_skill_path_id ON user_progress(skill_path_id);

-- Enable Row Level Security (RLS)
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Users can only access their own data)
CREATE POLICY "Users can view all skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Users can insert skills" ON skills FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can manage their skill paths" ON skill_paths 
  FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can manage their roadmap milestones" ON roadmap_milestones 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM skill_paths 
      WHERE skill_paths.id = roadmap_milestones.skill_path_id 
      AND skill_paths.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can manage their progress" ON user_progress 
  FOR ALL USING (auth.uid()::text = user_id);
```

4. **Click "RUN" to execute the SQL**

5. **Verify tables were created:**
   - Left sidebar → "Table Editor"
   - You should see: skills, skill_paths, roadmap_milestones, user_progress

## ✅ Once complete, come back and let me know!
