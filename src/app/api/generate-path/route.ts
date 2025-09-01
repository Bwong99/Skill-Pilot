import { NextRequest, NextResponse } from 'next/server'
import { generateLearningPath } from '@/lib/ai-service'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { skillName, duration, difficulty, userContext } = body

    // Validate input
    if (!skillName || !duration || !difficulty) {
      return NextResponse.json(
        { error: 'Missing required fields: skillName, duration, difficulty' },
        { status: 400 }
      )
    }

    if (typeof duration !== 'number' || duration < 1 || duration > 52) {
      return NextResponse.json(
        { error: 'Duration must be a number between 1 and 52 weeks' },
        { status: 400 }
      )
    }

    if (!['Beginner', 'Intermediate', 'Advanced'].includes(difficulty)) {
      return NextResponse.json(
        { error: 'Difficulty must be Beginner, Intermediate, or Advanced' },
        { status: 400 }
      )
    }

    console.log(`Generating learning path for ${skillName} (${difficulty}, ${duration} weeks)`)

    // Generate the learning path with AI
    const learningPath = await generateLearningPath({
      skillName,
      duration,
      difficulty,
      userContext: userContext || ''
    })

    console.log(`Generated learning path: ${learningPath.title}`)

    return NextResponse.json(learningPath)

  } catch (error: any) {
    console.error('Error in AI generation API:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate learning path',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: 'AI Learning Path Generator API' })
}
