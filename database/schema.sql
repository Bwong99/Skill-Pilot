-- SkillPilot Database Schema

-- Skills table (predefined skills or user can add custom)
CREATE TABLE skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  difficulty_level VARCHAR(50) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  estimated_hours INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User skill paths (main roadmap)
CREATE TABLE skill_paths (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL, -- Clerk user ID
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

-- Individual milestones/steps in the roadmap
CREATE TABLE roadmap_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_path_id UUID REFERENCES skill_paths(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  week_number INTEGER NOT NULL,
  estimated_hours INTEGER,
  resources JSONB DEFAULT '[]', -- Array of resources (links, books, videos)
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress tracking
CREATE TABLE user_progress (
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

-- Indexes for performance
CREATE INDEX idx_skill_paths_user_id ON skill_paths(user_id);
CREATE INDEX idx_roadmap_milestones_skill_path_id ON roadmap_milestones(skill_path_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_skill_path_id ON user_progress(skill_path_id);
