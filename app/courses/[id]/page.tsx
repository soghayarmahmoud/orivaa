export const dynamic = 'force-dynamic';

import CourseEnrollmentForm from '@/components/CourseEnrollmentForm';
import HeroSection from '@/components/HeroSection';
import SectionWrapper from '@/components/SectionWrapper';
import Button from '@/components/Button';
import dbConnect from '@/lib/database/connect';
import Course, { ICourse } from '@/lib/models/Course';
import { notFound } from 'next/navigation';

interface CoursePageProps {
  params: {
    id: string;
  };
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  await dbConnect();
  const course = await Course.findById(params.id).lean<ICourse>();

  if (!course || course.status !== 'published') {
    notFound();
  }

  return (
    <div>
      <HeroSection
        title={course.title}
        subtitle={course.description}
      />

      <SectionWrapper>
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] items-start">
          <div className="space-y-8">
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">Course Details</p>
                  <h1 className="mt-3 text-3xl font-bold text-gray-900">{course.title}</h1>
                </div>
                <div className="space-y-2 text-right">
                  <p className="text-sm text-gray-500">Level</p>
                  <div className="inline-flex rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
                    {course.level}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Instructor</p>
                    <p className="text-lg font-semibold text-gray-900">{course.instructor}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Duration</p>
                    <p className="text-lg text-gray-900">{course.duration}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Price</p>
                    <p className="text-lg font-semibold text-gray-900">{course.price === 0 ? 'Free' : `${course.currency} ${course.price}`}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Enrolled</p>
                    <p className="text-lg text-gray-900">{course.enrolledCount} students</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">What You’ll Learn</h2>
                  <p className="mt-3 text-gray-600 leading-7">{course.description}</p>
                </div>

                {Array.isArray(course.syllabus) && course.syllabus.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Course Outline</h3>
                    <ul className="mt-4 space-y-3 text-gray-600">
                      {course.syllabus.map((item, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {course.prerequisites && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Prerequisites</h3>
                    <p className="mt-3 text-gray-600">{course.prerequisites}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Ready to start?</p>
                  <h2 className="mt-2 text-2xl font-semibold text-gray-900">Secure your seat today.</h2>
                </div>
                <Button href="#enroll" variant="outline" size="md">
                  Enroll Now
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div id="enroll">
              <CourseEnrollmentForm courseId={course._id.toString()} courseTitle={course.title} />
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
