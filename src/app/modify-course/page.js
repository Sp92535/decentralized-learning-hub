"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/Sidebar/sidebar";
import Link from "next/link";

export default function ModifyCourse() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");
  const ipfsLink = searchParams.get("ipfsLink");
  const courseName = searchParams.get("name");

  const [activeTab, setActiveTab] = useState("materials");
  const [courseData, setCourseData] = useState(null);
  const [quizData, setQuizData] = useState({
    passingScore: 70,
    questions: [
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswers: [],
      },
    ],
  });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newIpfsLink, setNewIpfsLink] = useState("");

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!ipfsLink) return;

      try {
        setStatus("Loading course data...");
        // Use the proxy endpoint to fetch the course JSON from IPFS
        const encodedUrl = encodeURIComponent(ipfsLink);
        const response = await fetch(`/api/course?url=${encodedUrl}`);

        if (!response.ok) throw new Error("Failed to fetch course data");

        const data = await response.json();
        setCourseData(data);

        // If there's existing quiz data, load it
        if (data.quiz) {
          setQuizData(data.quiz);
        }

        setStatus("");
      } catch (error) {
        console.error("Error fetching course data:", error);
        setStatus("Failed to load course data. Please try again.");
      }
    };

    fetchCourseData();
  }, [ipfsLink]);

  const handlePassingScoreChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setQuizData({
      ...quizData,
      passingScore: Math.min(100, Math.max(0, value)),
    });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quizData.questions];

    if (field === "option") {
      const [questionIndex, optionIndex] = index.split("-");
      updatedQuestions[questionIndex].options[optionIndex] = value;
    } else if (field === "correctAnswers") {
      const [questionIndex, optionIndex] = index.split("-");
      const correctAnswers = [
        ...updatedQuestions[questionIndex].correctAnswers,
      ];

      if (correctAnswers.includes(parseInt(optionIndex))) {
        // Remove if already selected
        const answerIndex = correctAnswers.indexOf(parseInt(optionIndex));
        correctAnswers.splice(answerIndex, 1);
      } else {
        // Add if not selected
        correctAnswers.push(parseInt(optionIndex));
      }

      updatedQuestions[questionIndex].correctAnswers = correctAnswers.sort();
    } else {
      updatedQuestions[index][field] = value;
    }

    setQuizData({
      ...quizData,
      questions: updatedQuestions,
    });
  };

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        { question: "", options: ["", "", "", ""], correctAnswers: [] },
      ],
    });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions.splice(index, 1);
    setQuizData({
      ...quizData,
      questions: updatedQuestions,
    });
  };

  const saveChanges = async () => {
    if (!courseData) {
      setStatus("❌ No course data available to update.");
      return;
    }

    // Validate quiz data
    const invalidQuestions = quizData.questions.filter(
      (q) =>
        !q.question ||
        q.options.some((opt) => !opt) ||
        q.correctAnswers.length === 0
    );

    if (invalidQuestions.length > 0) {
      setStatus(
        "❌ Please complete all quiz questions and select at least one correct answer for each."
      );
      return;
    }

    setIsSubmitting(true);
    setStatus("Saving changes...");

    try {
      // Create updated course data with quiz
      const updatedCourseData = {
        ...courseData,
        quiz: quizData,
      };

      // Create a JSON file from the updated course data
      const jsonBlob = new Blob([JSON.stringify(updatedCourseData, null, 2)], {
        type: "application/json",
      });
      const jsonFile = new File([jsonBlob], "course-data.json", {
        type: "application/json",
      });

      // Prepare form data for upload
      const formData = new FormData();
      formData.append("file", jsonFile);
      formData.append(
        "courseName",
        courseData.courseName || courseName || "Updated Course"
      );
      formData.append(
        "description",
        courseData.description || "Course with updated quiz data"
      );
      formData.append("category", courseData.category || "development");
      formData.append("language", courseData.language || "english");
      formData.append("price", courseData.price || "0");

      // Upload to IPFS
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setNewIpfsLink(result.ipfsLink);
        setStatus("✅ Course updated successfully! New IPFS link generated.");
      } else {
        throw new Error(result.message || "Failed to upload course data");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      setStatus(`❌ Failed to update course: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col items-start justify-start flex-1 p-8 overflow-auto">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-4xl border border-gray-200 transition-all duration-300 hover:shadow-2xl mb-8">
          <div className="flex items-center mb-6">
            <Link
              href="/owned-courses"
              className="text-blue-600 hover:text-blue-800 mr-3"
            >
              ← Back
            </Link>
            <span className="text-blue-600 text-3xl mr-2">✏️</span>
            <h1 className="text-3xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Modify Course: {courseName}
            </h1>
          </div>

          <div className="mb-4 text-sm">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <p className="text-yellow-700">
                <strong>Important:</strong> Updating course content will
                generate a new IPFS link. You'll need to update any references
                to this course with the new link once you save changes.
              </p>
            </div>
          </div>

          {status && (
            <div
              className={`p-3 rounded-lg text-center mb-6 ${
                status.includes("✅")
                  ? "bg-green-100 text-green-700"
                  : status.includes("❌")
                  ? "bg-red-100 text-red-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {status}
            </div>
          )}

          {newIpfsLink && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-green-800 mb-2">
                New IPFS Link Generated:
              </h3>
              <div className="flex items-center">
                <input
                  type="text"
                  value={newIpfsLink}
                  readOnly
                  className="flex-1 p-2 border border-green-300 rounded bg-white text-sm"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(newIpfsLink);
                    setStatus("✅ IPFS link copied to clipboard!");
                    setTimeout(() => setStatus(""), 3000);
                  }}
                  className="ml-2 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "materials"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("materials")}
            >
              Add Materials
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "quizzes"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("quizzes")}
            >
              Add Quizzes
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "review"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("review")}
            >
              Review & Save
            </button>
          </div>

          {/* Materials Tab */}
          {activeTab === "materials" && (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">Add Files</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-left mb-6">
                <p className="text-yellow-700">
                  <strong>Under Construction</strong> - File upload
                  functionality will be available in a future update.
                </p>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p className="mt-4 text-gray-500">
                  Upload files to your course (coming soon)
                </p>
              </div>
            </div>
          )}

          {/* Quizzes Tab */}
          {activeTab === "quizzes" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Course Quiz</h2>

              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">
                    Passing Score (%)
                  </label>
                  <span className="text-sm text-gray-500">
                    Questions: {quizData.questions.length}
                  </span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={quizData.passingScore}
                  onChange={handlePassingScoreChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">Questions</h3>
                  <button
                    onClick={addQuestion}
                    className="text-sm px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    + Add Question
                  </button>
                </div>

                {quizData.questions.map((question, qIndex) => (
                  <div
                    key={qIndex}
                    className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Question {qIndex + 1}</h4>
                      {quizData.questions.length > 1 && (
                        <button
                          onClick={() => removeQuestion(qIndex)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="mb-3">
                      <input
                        type="text"
                        value={question.question}
                        onChange={(e) =>
                          handleQuestionChange(
                            qIndex,
                            "question",
                            e.target.value
                          )
                        }
                        placeholder="Enter question"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Options (select all correct answers)
                      </p>
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={`q${qIndex}-opt${oIndex}`}
                            checked={question.correctAnswers?.includes(oIndex)}
                            onChange={() =>
                              handleQuestionChange(
                                `${qIndex}-${oIndex}`,
                                "correctAnswers",
                                oIndex
                              )
                            }
                            className="mr-2"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              handleQuestionChange(
                                `${qIndex}-${oIndex}`,
                                "option",
                                e.target.value
                              )
                            }
                            placeholder={`Option ${oIndex + 1}`}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      ))}
                      <p className="text-xs text-gray-500 mt-1">
                        Select checkboxes for all correct answers
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review Tab */}
          {activeTab === "review" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Review & Save Changes
              </h2>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium mb-2">Course Files</h3>
                {courseData?.files && courseData.files.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {courseData.files.map((file, index) => (
                      <li key={index} className="mb-1">
                        {file.originalName}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No files in this course.</p>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium mb-2">Quiz Information</h3>
                <div className="mb-2">
                  <span className="font-semibold">Passing Score:</span>{" "}
                  {quizData.passingScore}%
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Questions:</span>{" "}
                  {quizData.questions.length}
                </div>
                {quizData.questions.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {quizData.questions.map((q, i) => (
                      <li key={i} className="mb-1">
                        {q.question || (
                          <span className="text-gray-400">
                            Question {i + 1} (no title)
                          </span>
                        )}
                        {q.correctAnswers?.length > 0 && (
                          <span className="text-xs text-gray-500 ml-2">
                            ({q.correctAnswers.length} correct answer
                            {q.correctAnswers.length !== 1 ? "s" : ""})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No questions added yet.</p>
                )}
              </div>

              <div className="mt-8">
                <p className="text-sm text-gray-600 mb-4">
                  Once you save changes, a new IPFS link will be generated for
                  this course with updated quiz data.
                </p>

                <button
                  onClick={saveChanges}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
