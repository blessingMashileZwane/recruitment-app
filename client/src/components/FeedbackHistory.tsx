import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { mockGraphQL } from "../mock/mockData";
import type { Candidate, Feedback } from "../types";

type FeedbackHistoryProps = {
    candidateId: string;
    onBack: () => void;
    onAddFeedback: (candidateId: string) => void;
};

function FeedbackHistory({ candidateId, onBack, onAddFeedback }: FeedbackHistoryProps) {
    const [loading, setLoading] = useState(true);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate>(
        {} as Candidate
    );
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    useEffect(() => {
        const loadFeedback = async () => {
            setLoading(true);
            try {
                const feedbackData = await mockGraphQL.getFeedback(candidateId);
                const candidateData = await mockGraphQL.getCandidateById(candidateId);
                setSelectedCandidate(candidateData);
                setFeedback((prev) => ({
                    ...prev,
                    [candidateId]: feedbackData,
                }));
            } catch (error) {
                console.error("Failed to load feedback:", error);
            } finally {
                setLoading(false);
            }
        };

        loadFeedback();
    }, [candidateId]);

    return (
        <>
            {loading ? (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span>Loading...</span>
                    </div>
                </div>
            ) : <div className="bg-white shadow rounded-lg p-6">
                <button
                    onClick={onBack}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4"
                >
                    ← Back
                </button>

                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        Interview Feedback for {selectedCandidate?.name}
                    </h3>
                    <button
                        onClick={() => onAddFeedback(candidateId)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Feedback
                    </button>
                </div>

                {feedback.length > 0 ? (
                    <div className="space-y-4">
                        {feedback.map((fb) => (
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
                                    <span className="text-sm font-medium text-gray-900">
                                        Rating: {fb.rating}/5
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 mb-2">{fb.comments}</p>
                                {fb.nextStepNotes && (
                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mt-3">
                                        <h5 className="text-sm font-medium text-yellow-800">Next Step Notes:</h5>
                                        <p className="text-sm text-yellow-700">{fb.nextStepNotes}</p>
                                    </div>
                                )}
                                <p className="text-xs text-gray-500 mt-2">{fb.date}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">
                        No feedback available yet
                    </p>
                )}
            </div>}
        </>
    );

};

export default FeedbackHistory;