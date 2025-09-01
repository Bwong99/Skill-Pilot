import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Google AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export interface LearningMilestone {
  title: string
  description: string
  week_number: number
  estimated_hours: number
  resources: Array<{
    type: 'video' | 'article' | 'book' | 'practice' | 'project' | 'documentation' | 'course' | 'tutorial'
    title: string
    description?: string
    url?: string
    duration?: string
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
    platform?: string
    section?: string
    chapter?: string
  }>
  exercises: Array<{
    title: string
    description: string
    difficulty: 'easy' | 'medium' | 'hard'
    estimated_time: string
    type: 'coding' | 'reading' | 'practice' | 'project'
  }>
}

export interface SkillPathGeneration {
  title: string
  description: string
  milestones: LearningMilestone[]
}

export async function generateLearningPath({
  skillName,
  duration,
  difficulty,
  userContext = ''
}: {
  skillName: string
  duration: number
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  userContext?: string
}): Promise<SkillPathGeneration> {
  try {
    console.log('🤖 Starting AI generation with Gemini 2.5 Flash-Lite...')
    console.log(`Parameters: ${skillName}, ${duration} weeks, ${difficulty}`)
    
    // Check if API key is configured
    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error('GOOGLE_AI_API_KEY environment variable is not configured')
    }
    
    const prompt = `Create a comprehensive ${duration}-week learning roadmap for mastering ${skillName} at ${difficulty} level.

${userContext ? `Additional context: ${userContext}` : ''}

IMPORTANT: Provide REAL, SPECIFIC, ACTIONABLE resources with actual URLs when possible. Don't use placeholder links.

For each milestone, include:
1. Clear, actionable title
2. Detailed description of what to learn and practice
3. Realistic time estimate (3-12 hours per week)
4. SPECIFIC learning resources with REAL URLs when available:
   - Official documentation links (specific sections/chapters)
   - YouTube video tutorials (with actual video titles/creators)
   - Online courses (Coursera, Udemy, freeCodeCamp, etc.)
   - GitHub repositories with practical examples
   - Interactive coding platforms (CodePen, JSFiddle, Repl.it)
   - Specific book chapters or articles
5. Practical exercises with clear difficulty levels
6. Real-world project ideas

RESOURCE GUIDELINES:
- For programming: Include official docs, MDN, Stack Overflow, GitHub repos
- For courses: Mention specific Coursera, edX, Udemy, or YouTube channels
- For practice: Include HackerRank, LeetCode, Codewars, or similar platforms
- For projects: Suggest real applications people can build
- Include platform names (YouTube, GitHub, MDN, etc.)

Format as JSON with this enhanced structure:
{
  "title": "Comprehensive Learning Path Title",
  "description": "Detailed description of the learning journey and real-world outcomes",
  "milestones": [
    {
      "title": "Week 1: Foundation Building",
      "description": "Detailed description of what to learn this week and why it matters",
      "week_number": 1,
      "estimated_hours": 8,
      "resources": [
        {
          "type": "documentation",
          "title": "Official Python Documentation - Data Types",
          "description": "Learn about built-in data types",
          "url": "https://docs.python.org/3/library/stdtypes.html",
          "platform": "Python.org",
          "section": "Built-in Types",
          "duration": "45 minutes",
          "difficulty": "beginner"
        },
        {
          "type": "video",
          "title": "Python Variables and Data Types - Programming with Mosh",
          "description": "Visual explanation of Python basics",
          "url": "https://www.youtube.com/watch?v=_Z1hwHbsOKI",
          "platform": "YouTube",
          "duration": "20 minutes",
          "difficulty": "beginner"
        },
        {
          "type": "practice",
          "title": "Python Exercises on HackerRank",
          "description": "Practice basic Python syntax",
          "url": "https://www.hackerrank.com/domains/python",
          "platform": "HackerRank",
          "difficulty": "beginner"
        }
      ],
      "exercises": [
        {
          "title": "Build a Simple Calculator",
          "description": "Create a calculator that performs basic operations",
          "difficulty": "easy",
          "estimated_time": "2-3 hours",
          "type": "project"
        },
        {
          "title": "Data Type Practice Problems",
          "description": "Complete 10 problems on variables and data types",
          "difficulty": "easy",
          "estimated_time": "1-2 hours",
          "type": "coding"
        }
      ]
    }
  ]
}`

    // Use Gemini 2.5 Flash-Lite (most cost-efficient free model)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })
    
    console.log('📡 Making API call to Gemini...')
    const result = await model.generateContent(prompt)

    const response = result.response
    const content = response.text()
    
    console.log('✅ Received response from Gemini')
    console.log('Response length:', content?.length || 0)
    
    if (!content) {
      throw new Error('No content generated from Gemini AI')
    }

    console.log('Gemini AI Response:', content)

    // Parse the JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No valid JSON found in Gemini AI response')
    }

    const parsed = JSON.parse(jsonMatch[0])
    
    // Validate the structure
    if (!parsed.title || !parsed.description || !Array.isArray(parsed.milestones)) {
      throw new Error('Invalid response structure from Gemini AI')
    }

    console.log(`Successfully generated AI roadmap: ${parsed.title}`)
    return parsed as SkillPathGeneration

  } catch (error) {
    console.error('❌ Error generating learning path with Gemini:', error)
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    // Fallback to a basic structure if AI fails
    console.log('🔄 Falling back to manual roadmap generation...')
    return generateFallbackPath(skillName, duration, difficulty)
  }
}

function generateFallbackPath(skillName: string, duration: number, difficulty: string): SkillPathGeneration {
  const weeksArray = Array.from({ length: duration }, (_, i) => i + 1)
  
  return {
    title: `Master ${skillName} in ${duration} Weeks`,
    description: `A comprehensive ${difficulty.toLowerCase()} learning path to build strong ${skillName} skills through hands-on practice and real-world projects.`,
    milestones: weeksArray.map((week) => ({
      title: `Week ${week}: ${skillName} Fundamentals ${week > 1 ? `- Part ${week}` : ''}`,
      description: `Learn core ${skillName} concepts and practice with hands-on exercises. Build a solid foundation for advanced topics.`,
      week_number: week,
      estimated_hours: Math.ceil(40 / duration), // Distribute 40 total hours
      resources: [
        {
          type: 'article' as const,
          title: `${skillName} Basics - Week ${week}`,
          description: `Essential reading material for week ${week}`,
          url: `https://example.com/${skillName.toLowerCase()}-week-${week}`,
          platform: 'Documentation'
        },
        {
          type: 'practice' as const,
          title: `Hands-on Practice`,
          description: `Coding exercises and practical tasks`,
          difficulty: 'beginner' as const,
          duration: '2-3 hours'
        },
        {
          type: 'project' as const,
          title: `Mini Project`,
          description: `Apply your learning with a small project`,
          difficulty: 'beginner' as const,
          duration: '3-4 hours'
        }
      ],
      exercises: [
        {
          title: `Week ${week} Practice`,
          description: `Complete exercises to reinforce ${skillName} concepts`,
          difficulty: 'easy' as const,
          estimated_time: '1-2 hours',
          type: 'practice' as const
        }
      ]
    }))
  }
}

export async function generatePersonalizedSuggestions(skillName: string): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })
    
    const result = await model.generateContent(
      `Generate 5 brief, compelling reasons why learning ${skillName} is valuable in 2025. Each reason should be one sentence.`
    )

    const content = result.response.text()
    if (!content) return []

    return content.split('\n').filter(line => line.trim().length > 0).slice(0, 5)
  } catch (error) {
    console.error('Error generating suggestions with Gemini:', error)
    return [
      `${skillName} is in high demand across industries`,
      `Build valuable technical skills for career growth`,
      `Create amazing projects and solutions`,
      `Join a thriving community of developers`,
      `Unlock new opportunities and possibilities`
    ]
  }
}
