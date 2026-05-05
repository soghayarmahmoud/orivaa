import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/database/connect';
import Course from '@/lib/models/Course';
import CourseEnrollment from '@/lib/models/CourseEnrollment';

const enrollmentSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  message: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const params = await context.params;
    const { id: courseId } = params;
    const body = await request.json();
    const validatedData = enrollmentSchema.parse(body);

    const course = await Course.findById(courseId);
    if (!course || course.status !== 'published') {
      return NextResponse.json({ success: false, message: 'Course not found or unavailable' }, { status: 404 });
    }

    if (course.maxStudents && course.enrolledCount >= course.maxStudents) {
      return NextResponse.json({ success: false, message: 'Course enrollment is full' }, { status: 400 });
    }

    const existing = await CourseEnrollment.findOne({ courseId, email: validatedData.email });
    if (existing) {
      return NextResponse.json({ success: false, message: 'You are already enrolled for this course' }, { status: 400 });
    }

    const enrollment = new CourseEnrollment({
      courseId,
      ...validatedData,
    });
    await enrollment.save();

    await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } });

    return NextResponse.json({ success: true, message: 'Course enrollment submitted successfully', data: { id: enrollment._id } }, { status: 201 });
  } catch (error) {
    console.error('Course enrollment error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: 'Validation failed', errors: error.errors.map((err) => ({ field: err.path.join('.'), message: err.message })) }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
