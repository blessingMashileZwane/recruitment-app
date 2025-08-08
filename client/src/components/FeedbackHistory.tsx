import { useEffect, useState } from "react";
import type { Candidate, Feedback } from "../types";
import { Plus } from "lucide-react";
import { useAuth } from "../auth/AuthProvider";
import { mockGraphQL } from "../mock/mockData";

function FeedbackHistory() {
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate>(
        {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            position: "Frontend Developer",
            status: "technical",
            experience: 3,
            skills: ["React", "TypeScript", "CSS"],
            addedDate: "2024-01-15",
        }
    );
    const { user, isLoggedIn, logout } = useAuth();
    const [feedback, setFeedback] = useState<Record<string, Feedback[]>>({});
    const [feedbackForm, setFeedbackForm] = useState({
        candidateId: "",
        interviewerName: user?.name || "",
        interviewStep: "",
        rating: 3,
        comments: "",
        nextStepNotes: "",
    });

    useEffect(() => {
        mockGraphQL.getCandidates().then((candidates) => {
            if (candidates.length > 0) {
                setSelectedCandidate(candidates[0]);
            }
        });
    }, []);

    const [currentView, setCurrentView] = useState<
        "candidates" | "add-candidate" | "candidate-detail" | "feedback"
    >("candidates");
    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                    Interview Feedback
                </h3>
                <button
                    onClick={() => {
                        setFeedbackForm((prev) => ({
                            ...prev,
                            candidateId: selectedCandidate.id,
                        }));
                        setCurrentView("feedback");
                    }}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feedback
                </button>
            </div>

            {feedback[selectedCandidate.id]?.length > 0 ? (
                <div className="space-y-4">
                    {feedback[selectedCandidate.id].map((fb) => (
                        <div key={fb.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900">
                                        {fb.interviewStep}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        by {fb.interviewerName}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-sm font-medium text-gray-900">
                                        Rating: {fb.rating}/5
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">
                                {fb.comments}
                            </p>
                            {fb.nextStepNotes && (
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mt-3">
                                    <h5 className="text-sm font-medium text-yellow-800">
                                        Next Step Notes:
                                    </h5>
                                    <p className="text-sm text-yellow-700">
                                        {fb.nextStepNotes}
                                    </p>
                                </div>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                                {fb.date}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center py-8">
                    No feedback available yet
                </p>
            )}
        </div>
    )
}
export default FeedbackHistory;