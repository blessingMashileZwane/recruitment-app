import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { mockGraphQL } from "../../mock/mockData";
import type { Candidate, Feedback } from "../../types";
import FeedbackItem from "../ui/FeedbackItem";

type FeedbackHistoryProps = {
    candidateId: string;
    onBack: () => void;
    onAddFeedback: (candidateId: string) => void;
    onEditFeedback: (feedbackId: string) => void
};

function FeedbackHistory({ candidateId, onBack, onAddFeedback, onEditFeedback }: FeedbackHistoryProps) {
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
                setFeedback(feedbackData);
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
                    ← Back to Candidate
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
                        {feedback.map((feedback) => (
                            <FeedbackItem key={feedback.id}
                                feedback={feedback}
                                onEditFeedback={() => onEditFeedback(feedback.id)} />
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