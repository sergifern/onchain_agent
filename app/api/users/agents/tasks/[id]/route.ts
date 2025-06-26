import { NextResponse, NextRequest } from 'next/server';
import { verifyUserAuth } from '@/lib/privy/users';
import { getTaskById, updateTask } from '@/lib/mongodb/tasks';
import { ObjectId } from 'mongodb';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyUserAuth(req);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    const task = await getTaskById(new ObjectId(id));

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Security check: ensure the task belongs to the authenticated user
    if (task.userId !== user) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({
      task,
      success: true
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyUserAuth(req);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { condition, status, isDeleted } = body;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    // Validate based on what's being updated
    if (condition !== undefined && (!condition || condition.trim().length < 10)) {
      return NextResponse.json({ 
        error: 'Condition must be at least 10 characters long' 
      }, { status: 400 });
    }

    if (status !== undefined && !['active', 'inactive'].includes(status)) {
      return NextResponse.json({ 
        error: 'Status must be either "active" or "inactive"' 
      }, { status: 400 });
    }

    if (isDeleted !== undefined && typeof isDeleted !== 'boolean') {
      return NextResponse.json({ 
        error: 'isDeleted must be a boolean' 
      }, { status: 400 });
    }

    // First check if task exists and belongs to user
    const existingTask = await getTaskById(new ObjectId(id));
    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (existingTask.userId !== user) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Prepare update object
    const updateData: any = {};
    if (condition !== undefined) {
      updateData.condition = condition.trim();
    }
    if (status !== undefined) {
      updateData.status = status;
    }
    if (isDeleted !== undefined) {
      updateData.isDeleted = isDeleted;
    }

    // Update the task
    const updatedTask = await updateTask(new ObjectId(id), updateData);

    if (!updatedTask) {
      return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
    }

    return NextResponse.json({
      task: updatedTask,
      success: true
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 