"use client";

import { useSearchParams } from "next/navigation";
import CourseViewer from "@/components/CourseViewer";
import Link from "next/link";

export default function CoursePage() {
  const searchParams = useSearchParams();
  const link = searchParams.get("link");
  const courseId = searchParams.get("courseId");
  const name = searchParams.get("name");

  if (!link) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-200">
          <p className="text-red-600 flex items-center">
            <span className="mr-2">⚠️</span> No course link provided
          </p>
          <Link
            href="/dashboard"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800 underline"
          >
            Return to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header with DLH branding */}
      <header className="bg-white shadow-md border-b border-gray-200 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/dashboard">
            <div className="flex items-center group">
              <div className="text-4xl mr-2 transition-transform duration-300 group-hover:scale-110">
                📚
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                DLH
              </span>
            </div>
          </Link>
          <div className="flex items-center">
            <div className="text-sm bg-blue-100 px-4 py-2 rounded-full text-blue-800 font-medium flex items-center">
              <span className="mr-2">🎓</span>
              Learning Mode
            </div>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl">
          {/* Course title bar */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5">
            <h1 className="text-xl font-bold flex items-center">
              <span className="mr-2">📖</span>
              Course Content
            </h1>
          </div>

          {/* Course Details */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <h2 className="text-2xl font-bold mb-3">Course Title Goes Here</h2>
            <p className="text-gray-600 mb-4">
              Brief description of what the student will learn in this course.
            </p>

            <div className="flex flex-wrap items-center gap-6 mb-4">
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="font-medium mr-1">4.4</span>
                <span className="text-gray-500 text-sm">(447 ratings)</span>
              </div>

              <div className="flex items-center">
                <span className="mr-1">👨‍🎓</span>
                <span>3,254 students</span>
              </div>

              <div className="flex items-center">
                <span className="mr-1">⏱️</span>
                <span>8 hours total</span>
              </div>

              <div className="flex items-center">
                <span className="mr-1">🔄</span>
                <span className="text-gray-500 text-sm">
                  Last updated: March 2025
                </span>
              </div>
            </div>

            <div className="flex border-b overflow-x-auto">
              <button className="px-5 py-3 font-medium border-b-2 border-blue-600 text-blue-600">
                Content
              </button>
              <button className="px-5 py-3 font-medium text-gray-600 hover:text-gray-800">
                Overview
              </button>
              <button className="px-5 py-3 font-medium text-gray-600 hover:text-gray-800">
                Q&A
              </button>
              <button className="px-5 py-3 font-medium text-gray-600 hover:text-gray-800">
                Notes
              </button>
              <button className="px-5 py-3 font-medium text-gray-600 hover:text-gray-800">
                Resources
              </button>
            </div>
          </div>
          {/* Course Details end */}

          {/* Progress Tracker */}
          <div className="bg-gray-50 px-6 py-3 flex items-center">
            <div className="mr-4">
              <span className="text-sm font-medium text-gray-700">
                Course progress:
              </span>
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: "35%" }}
              ></div>
            </div>
            <div className="ml-4">
              <span className="text-sm font-medium text-gray-700">
                35% complete
              </span>
            </div>
          </div>
          {/* Progress Tracker Ends */}

          {/* Course content */}
          <div className="p-6">
            <CourseViewer link={link} name={name} courseId={courseId} />
          </div>

          {/* Navigation footer */}
          <div className="bg-gray-50 p-4 border-t border-gray-200">
            <div className="flex justify-between">
              <Link
                href="/dashboard"
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                <span className="mr-2">←</span>
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
