import { GoogleGenerativeAI } from '@google/generative-ai'

// There is deliberately no shared client here. Every caller supplies the API
// key belonging to the user making the request, and we build a client for that
// request only. Never fall back to a server-owned key: that would bill the
// app owner's Google AI Studio account for public traffic.
function clientFor(apiKey: string): GoogleGenerativeAI {
  if (!apiKey?.trim()) {
    throw new ApiKeyError('A Gemini API key is required to generate content.')
  }
  return new GoogleGenerativeAI(apiKey.trim())
}

// Raised when the failure is the caller's key, not the model. These must never
// be swallowed into the fallback roadmap: a user whose key is wrong has to be
// told so, otherwise they get placeholder content and believe it came from AI.
export class ApiKeyError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApiKeyError'
  }
}

// The SDK surfaces auth failures as text, e.g. "[400 Bad Request] API key not
// valid. Please pass a valid API key." or a 403 PERMISSION_DENIED. Match on
// that rather than echoing the provider string, which can carry request detail.
function isKeyRejection(error: unknown): boolean {
  if (error instanceof ApiKeyError) return true
  if (!(error instanceof Error)) return false
  const message = error.message.toLowerCase()
  return (
    message.includes('api key not valid') ||
    message.includes('api_key_invalid') ||
    message.includes('invalid api key') ||
    message.includes('permission_denied') ||
    message.includes('403') ||
    message.includes('401')
  )
}

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
  hoursPerWeek = 5,
  userContext = '',
  apiKey
}: {
  skillName: string
  duration: number
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  hoursPerWeek?: number
  userContext?: string
  apiKey: string
}): Promise<SkillPathGeneration> {
  try {
    console.log('Starting roadmap generation with Gemini 2.5 Flash-Lite')
    console.log(`Parameters: ${skillName}, ${duration} weeks, ${difficulty}`)
    
    const genAI = clientFor(apiKey)

    const prompt = `Create a comprehensive ${duration}-week learning roadmap for mastering ${skillName} at ${difficulty} level.

${userContext ? `Additional context: ${userContext}` : ''}

CRITICAL CONSTRAINT: The learner has ${hoursPerWeek} hours available per week for learning. Each weekly milestone MUST contain exactly ${hoursPerWeek} hours worth of content - no more, no less. This includes all resources, exercises, and activities combined.

CONTENT ALLOCATION FOR ${hoursPerWeek} HOURS PER WEEK:
- Learning resources (videos, articles, tutorials): ${Math.ceil(hoursPerWeek * 0.6)} hours
- Hands-on exercises and practice: ${Math.ceil(hoursPerWeek * 0.3)} hours  
- Projects and practical application: ${Math.ceil(hoursPerWeek * 0.1)} hours

IMPORTANT: Provide REAL, SPECIFIC, ACTIONABLE resources with actual URLs when possible. Don't use placeholder links.

For each milestone, include:
1. Clear, actionable title
2. Detailed description of what to learn and practice
3. EXACTLY ${hoursPerWeek} hours of total content (sum all durations)
4. SPECIFIC learning resources with REAL URLs and accurate time estimates:
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
- ALWAYS specify accurate duration estimates that add up to exactly ${hoursPerWeek} hours

TIME ALLOCATION EXAMPLE for ${hoursPerWeek} hours:
- Video tutorial: 2 hours
- Reading documentation: 1.5 hours  
- Coding exercises: 1 hour
- Mini project: 0.5 hours
TOTAL: ${hoursPerWeek} hours (must match exactly)

Format as JSON with this enhanced structure:
{
  "title": "Comprehensive Learning Path Title",
  "description": "What this path covers and what you will be able to build by the end",
  "milestones": [
    {
      "title": "Week 1: Foundation Building",
      "description": "Detailed description of what to learn this week and why it matters",
      "week_number": 1,
      "estimated_hours": ${hoursPerWeek},
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

    // A rejected key is the user's problem to fix, so it has to reach them.
    // Falling back here would hand them a placeholder roadmap that looks real.
    if (isKeyRejection(error)) {
      throw new ApiKeyError('Gemini rejected the supplied API key.')
    }

    // Anything else (model hiccup, malformed JSON) still degrades gracefully.
    console.log('🔄 Falling back to manual roadmap generation...')
    return generateFallbackPath(skillName, duration, difficulty, hoursPerWeek)
  }
}

function generateFallbackPath(skillName: string, duration: number, difficulty: string, hoursPerWeek: number = 5): SkillPathGeneration {
  const weeksArray = Array.from({ length: duration }, (_, i) => i + 1)
  
  return {
    title: `Master ${skillName} in ${duration} Weeks`,
    description: `A comprehensive ${difficulty.toLowerCase()} learning path to build strong ${skillName} skills through hands-on practice and real-world projects.`,
    milestones: weeksArray.map((week) => ({
      title: `Week ${week}: ${skillName} Fundamentals ${week > 1 ? `- Part ${week}` : ''}`,
      description: `Learn core ${skillName} concepts and practice with hands-on exercises. Build a solid foundation for advanced topics.`,
      week_number: week,
      estimated_hours: hoursPerWeek, // Use the specified hours per week
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

export async function generatePersonalizedSuggestions(skillName: string, apiKey: string): Promise<string[]> {
  try {
    const model = clientFor(apiKey).getGenerativeModel({ model: 'gemini-2.5-flash-lite' })
    
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
      `Build projects you can actually show people`,
      `Join a thriving community of developers`,
      `Take on work that needs this skill`
    ]
  }
}
