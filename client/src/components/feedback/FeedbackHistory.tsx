import { AlertCircle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { graphqlService } from "../../services/graphql.service";
import type { CandidateOutput, InterviewStageOutput } from "../../types/outputs";
import FeedbackItem from "../ui/FeedbackItem";

type FeedbackHistoryProps = {
    candidateId: string;
    jobId: string;
    onBack: () => void;
    onAddFeedback: (jobId: string) => void;
    onEditFeedback: (feedbackId: string) => void
};

function FeedbackHistory({ candidateId, jobId, onBack, onAddFeedback, onEditFeedback }: FeedbackHistoryProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCandidate, setSelectedCandidate] = useState<CandidateOutput | null>(null);
    const [feedback, setFeedback] = useState<InterviewStageOutput[]>([]);

    useEffect(() => {
        loadFeedback();
    }, [jobId, candidateId]);

    const loadFeedback = async () => {
        setLoading(true);
        setError(null);
        try {
            const [feedbackData, candidateData] = await Promise.all([
                graphqlService.getInterviewStagesByJobId(jobId),
                graphqlService.getCandidateById(candidateId)
            ]);
            setFeedback(feedbackData);
            console.log({ feedbackData })
            setSelectedCandidate(candidateData);
        } catch (error) {
            setError("Failed to load feedback or candidate data.");
            console.error("Failed to load feedback:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span>Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Error Popup */}
            {error && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="flex items-center mb-4">
                            <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
                            <h3 className="text-lg font-semibold text-gray-900">Error</h3>
                        </div>
                        <p className="text-gray-700 mb-6">{error}</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setError(null);
                                    onBack();
                                }}
                                className="cursor-pointer py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Go Back
                            </button>
                            <button
                                onClick={() => {
                                    setError(null);
                                    loadFeedback();
                                }}
                                className="cursor-pointer py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="bg-white shadow rounded-lg p-6">
                <button
                    onClick={onBack}
                    className="cursor-pointer text-blue-600 hover:text-blue-700 text-sm font-medium mb-4"
                >
                    ← Back to Candidate
                </button>

                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        Interview Feedback for {selectedCandidate?.firstName} {selectedCandidate?.lastName}
                    </h3>
                    <button
                        onClick={() => onAddFeedback(jobId)}
                        className="cursor-pointer inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Feedback
                    </button>
                </div>

                {feedback.length > 0 ? (
                    <div className="space-y-4">
                        {feedback.map((interviewStage) => (
                            <FeedbackItem
                                key={interviewStage.id}
                                interviewStage={interviewStage}
                                onEditFeedback={() => onEditFeedback(interviewStage.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">
                        No feedback available yet
                    </p>
                )}
            </div>
        </div>
    );
}

export default FeedbackHistory;