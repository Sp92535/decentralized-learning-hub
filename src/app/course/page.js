'use client';

import { useSearchParams } from 'next/navigation';
import CourseViewer from '@/components/CourseViewer';

export default function CoursePage() {
  const searchParams = useSearchParams();
  const link = searchParams.get('link'); // Properly unwrap the link

  if (!link) return <p className="p-4 text-red-600">No course link provided</p>;

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">📚 Course Viewer</h1>
      <CourseViewer link={link} />
    </main>
  );
}
