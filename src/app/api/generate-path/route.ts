import { NextRequest, NextResponse } from 'next/server'
import { ApiKeyError, generateLearningPath } from '@/lib/ai-service'
import { INVALID_KEY_MESSAGE, MISSING_KEY_MESSAGE } from '@/lib/user-api-key'
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
    const { skillName, duration, difficulty, hoursPerWeek, userContext, apiKey } = body

    // The caller must bring their own Gemini key. There is intentionally no
    // fallback to a server-owned key, so public traffic can never bill the
    // app owner's Google AI Studio account.
    if (typeof apiKey !== 'string' || !apiKey.trim()) {
      return NextResponse.json({ error: MISSING_KEY_MESSAGE }, { status: 400 })
    }

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

    // Generate the learning path with AI, using the caller's own key.
    const learningPath = await generateLearningPath({
      skillName,
      duration,
      difficulty,
      hoursPerWeek: hoursPerWeek || 5,
      userContext: userContext || '',
      apiKey
    })

    console.log(`Generated learning path: ${learningPath.title}`)

    return NextResponse.json(learningPath)

  } catch (error) {
    console.error('Error in AI generation API:', error)

    if (error instanceof ApiKeyError) {
      return NextResponse.json({ error: INVALID_KEY_MESSAGE }, { status: 400 })
    }

    // Deliberately no `details: error.message`, since provider errors can echo
    // back request detail including the caller's key. Diagnostics stay in logs.
    return NextResponse.json(
      { error: 'Failed to generate learning path' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: 'AI Learning Path Generator API' })
}
