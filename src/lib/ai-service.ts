import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface LearningMilestone {
  title: string
  description: string
  week_number: number
  estimated_hours: number
  resources: Array<{
    type: 'video' | 'article' | 'book' | 'practice' | 'project'
    title: string
    description?: string
    url?: string
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
    const prompt = `Create a comprehensive ${duration}-week learning roadmap for mastering ${skillName} at ${difficulty} level.

${userContext ? `Additional context: ${userContext}` : ''}

Please provide:
1. A compelling title for this learning path
2. A detailed description explaining what the learner will achieve
3. Weekly milestones that progressively build skills

For each milestone, include:
- Clear, actionable title
- Detailed description of what to learn and practice
- Realistic time estimate (3-12 hours per week)
- Specific learning resources with types (video, article, book, practice, project)

Make the content practical, engaging, and tailored to ${difficulty} learners. Include hands-on projects and real-world applications.

Format as JSON with this structure:
{
  "title": "Learning Path Title",
  "description": "Detailed description of the learning journey and outcomes",
  "milestones": [
    {
      "title": "Week 1: Foundation",
      "description": "Detailed description of what to learn this week",
      "week_number": 1,
      "estimated_hours": 8,
      "resources": [
        {
          "type": "video",
          "title": "Resource Title",
          "description": "What this resource covers"
        }
      ]
    }
  ]
}`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert learning designer who creates personalized, practical learning roadmaps. Generate detailed, actionable content that helps people learn effectively.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content generated from OpenAI')
    }

    // Parse the JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No valid JSON found in OpenAI response')
    }

    const parsed = JSON.parse(jsonMatch[0])
    
    // Validate the structure
    if (!parsed.title || !parsed.description || !Array.isArray(parsed.milestones)) {
      throw new Error('Invalid response structure from OpenAI')
    }

    return parsed as SkillPathGeneration

  } catch (error) {
    console.error('Error generating learning path:', error)
    
    // Fallback to a basic structure if AI fails
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
          description: `Essential reading material for week ${week}`
        },
        {
          type: 'practice' as const,
          title: `Hands-on Practice`,
          description: `Coding exercises and practical tasks`
        },
        {
          type: 'project' as const,
          title: `Mini Project`,
          description: `Apply your learning with a small project`
        }
      ]
    }))
  }
}

export async function generatePersonalizedSuggestions(skillName: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Generate 5 brief, compelling reasons why learning this skill is valuable in 2025.'
        },
        {
          role: 'user',
          content: `Why should someone learn ${skillName}?`
        }
      ],
      temperature: 0.8,
      max_tokens: 300,
    })

    const content = response.choices[0]?.message?.content
    if (!content) return []

    return content.split('\n').filter(line => line.trim().length > 0).slice(0, 5)
  } catch (error) {
    console.error('Error generating suggestions:', error)
    return [
      `${skillName} is in high demand across industries`,
      `Build valuable technical skills for career growth`,
      `Create amazing projects and solutions`,
      `Join a thriving community of developers`,
      `Unlock new opportunities and possibilities`
    ]
  }
}
