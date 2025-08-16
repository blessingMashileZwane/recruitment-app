import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { graphqlService } from '../../services/graphql.service';
import type { UpdateInterviewStageInput } from '../../types/inputs';
import type { CandidateOutput } from '../../types/outputs';

type FeedbackEditProps = {
    candidateId: string;
    interviewStageId: string;
    onCancel: (candidateId: string) => void;
    onSubmit: (candidateId: string) => void;
};

function FeedbackEdit({ candidateId, interviewStageId, onCancel, onSubmit }: FeedbackEditProps) {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState<CandidateOutput | null>(null);
    const [feedbackForm, setFeedbackForm] = useState<{
        interviewStep: string;
        rating: number;
        feedback: string;
        nextStepNotes: string;
        progressToNextStage: boolean;
    }>({
        interviewStep: '',
        rating: 0,
        feedback: '',
        nextStepNotes: '',
        progressToNextStage: false,
    });

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [candidateData, interviewStage] = await Promise.all([
                    graphqlService.getCandidateById(candidateId),
                    graphqlService.getInterviewStageById(interviewStageId)
                ]);
                setSelectedCandidate(candidateData);
                setFeedbackForm({
                    interviewStep: interviewStage.name,
                    rating: interviewStage.rating,
                    feedback: interviewStage.feedback,
                    nextStepNotes: interviewStage.nextStepNotes || '',
                    progressToNextStage: interviewStage.progressToNextStage,
                });
            } catch (error) {
                toast.error("Failed to load data. Please try again.");
                console.error("Failed to load candidate or interview stage:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [candidateId, interviewStageId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!feedbackForm.feedback.trim()) {
            toast.error('Please enter feedback');
            return;
        }
        if (feedbackForm.rating === 0) {
            toast.error('Please select a rating');
            return;
        }
        if (!feedbackForm.interviewStep) {
            toast.error('Please select an interview step');
            return;
        }

        setSubmitting(true);

        try {
            const feedbackData: UpdateInterviewStageInput = {
                id: interviewStageId,
                rating: feedbackForm.rating,
                feedback: feedbackForm.feedback.trim(),
                nextStepNotes: feedbackForm.nextStepNotes.trim(),
                name: feedbackForm.interviewStep,
                progressToNextStage: feedbackForm.progressToNextStage,
            };

            await graphqlService.updateInterviewStage(feedbackData);

            toast.success('Feedback updated successfully');
            onSubmit(candidateId);
        } catch (error) {
            toast.error("Failed to update feedback. Please try again.");
            console.error("Failed to update feedback:", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span>Loading data...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <button
                    onClick={() => onCancel(candidateId)}
                    className="cursor-pointer text-blue-600 hover:text-blue-700 text-sm font-medium mb-4"
                >
                    ← Back to Feedback history
                </button>
                <h2 className="text-2xl font-bold text-gray-900">
                    Edit Feedback for {selectedCandidate?.firstName} {selectedCandidate?.lastName}
                </h2>
            </div>

            <div className="bg-white shadow rounded-lg p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Progress to Next Stage */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Progress to Next Stage
                            </label>
                            <select
                                required
                                value={feedbackForm.progressToNextStage ? "true" : "false"}
                                onChange={(e) =>
                                    setFeedbackForm((prev) => ({
                                        ...prev,
                                        progressToNextStage: e.target.value === "true",
                                    }))
                                }
                                className="cursor-pointer mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                            >
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                            </select>
                        </div>

                        {/* Interview Step */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Interview Step *
                            </label>
                            <select
                                required
                                value={feedbackForm.interviewStep}
                                onChange={(e) =>
                                    setFeedbackForm((prev) => ({
                                        ...prev,
                                        interviewStep: e.target.value,
                                    }))
                                }
                                className="cursor-pointer mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                            >
                                <option value="">Select interview step</option>
                                <option value="Phone Screening">Phone Screening</option>
                                <option value="Technical Interview">Technical Interview</option>
                                <option value="System Design">System Design</option>
                                <option value="Behavioral Interview">Behavioral Interview</option>
                                <option value="Final Interview">Final Interview</option>
                                <option value="HR Interview">HR Interview</option>
                            </select>
                        </div>
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Overall Rating *
                        </label>
                        <div className="flex items-center space-x-6">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <label
                                    key={rating}
                                    className="flex items-center cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name="rating"
                                        value={rating}
                                        checked={feedbackForm.rating === rating}
                                        onChange={(e) =>
                                            setFeedbackForm((prev) => ({
                                                ...prev,
                                                rating: parseInt(e.target.value),
                                            }))
                                        }
                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 mr-2"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        {rating}
                                    </span>
                                    <span className="ml-1 text-xs text-gray-500">
                                        {rating === 1 && "(Poor)"}
                                        {rating === 2 && "(Below Average)"}
                                        {rating === 3 && "(Average)"}
                                        {rating === 4 && "(Good)"}
                                        {rating === 5 && "(Excellent)"}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Feedback */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Interview Comments *
                        </label>
                        <textarea
                            required
                            rows={6}
                            value={feedbackForm.feedback}
                            onChange={(e) =>
                                setFeedbackForm((prev) => ({
                                    ...prev,
                                    feedback: e.target.value,
                                }))
                            }
                            placeholder="Share detailed feedback about the candidate's performance, strengths, areas for improvement, specific examples from the interview..."
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border resize-none"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Be specific and provide examples to help other interviewers and hiring managers
                        </p>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notes for Next Interviewer (Optional)
                        </label>
                        <textarea
                            rows={4}
                            value={feedbackForm.nextStepNotes}
                            onChange={(e) =>
                                setFeedbackForm((prev) => ({
                                    ...prev,
                                    nextStepNotes: e.target.value,
                                }))
                            }
                            placeholder="Specific areas to focus on, questions to ask, or recommendations for the next interview step..."
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border resize-none"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Help the next interviewer by highlighting areas they should explore further
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-4 pt-6 border-t">
                        <button
                            type="button"
                            onClick={() => onCancel(candidateId)}
                            disabled={submitting}
                            className="cursor-pointer py-2 px-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="cursor-pointer py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Saving..." : "Update Feedback"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FeedbackEdit;
