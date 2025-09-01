import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { pathId: string } }
) {
  try {
    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const pathId = params.pathId
    if (!pathId) {
      return NextResponse.json({ error: 'Path ID is required' }, { status: 400 })
    }

    // Create Supabase client
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    console.log(`Deleting skill path ${pathId} for user ${userId}`)

    // First, verify the path belongs to the user
    const { data: pathData, error: pathError } = await supabase
      .from('skill_paths')
      .select('id, title')
      .eq('id', pathId)
      .eq('user_id', userId)
      .single()

    if (pathError || !pathData) {
      console.error('Path not found or unauthorized:', pathError)
      return NextResponse.json({ error: 'Learning path not found' }, { status: 404 })
    }

    // Delete related milestones first (due to foreign key constraint)
    const { error: milestonesError } = await supabase
      .from('roadmap_milestones')
      .delete()
      .eq('skill_path_id', pathId)

    if (milestonesError) {
      console.error('Error deleting milestones:', milestonesError)
      return NextResponse.json({ 
        error: 'Failed to delete learning path milestones' 
      }, { status: 500 })
    }

    // Delete user progress records
    const { error: progressError } = await supabase
      .from('user_progress')
      .delete()
      .eq('skill_path_id', pathId)

    if (progressError) {
      console.error('Error deleting progress:', progressError)
      // Continue anyway - progress deletion is not critical
    }

    // Finally, delete the skill path
    const { error: pathDeleteError } = await supabase
      .from('skill_paths')
      .delete()
      .eq('id', pathId)
      .eq('user_id', userId)

    if (pathDeleteError) {
      console.error('Error deleting skill path:', pathDeleteError)
      return NextResponse.json({ 
        error: 'Failed to delete learning path' 
      }, { status: 500 })
    }

    console.log(`Successfully deleted skill path: ${pathData.title}`)

    return NextResponse.json({ 
      message: 'Learning path deleted successfully',
      deletedPath: pathData.title
    })

  } catch (error: any) {
    console.error('Error in delete skill path API:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete learning path',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Delete Skill Path API' })
}
