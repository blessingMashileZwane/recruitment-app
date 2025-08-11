import { useEffect, useState } from 'react';
import { mockGraphQL } from '../../mock/mockData';
import type { Candidate, Feedback } from '../../types';
import { graphqlService } from '../../services/graphql.service';

type FeedbackFormProps = {
    candidateId: string;
    onViewFeedback: (candidateId: string) => void;
}


function FeedbackForm({ candidateId, onViewFeedback }: FeedbackFormProps) {
    const [loading, setLoading] = useState(true);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate>(
        {} as Candidate
    );
    const [feedbackForm, setFeedbackForm] = useState<{
        interviewerName: string;
        interviewStep: string;
        rating: number;
        comments: string;
        nextStepNotes: string;
    }>({
        interviewerName: '',
        interviewStep: '',
        rating: 0,
        comments: '',
        nextStepNotes: '',
    });

    useEffect(() => {
        const loadFeedback = async () => {
            setLoading(true);
            try {
                const candidateData = await mockGraphQL.getCandidateById(candidateId);
                setSelectedCandidate(candidateData);
            } catch (error) {
                console.error("Failed to load feedback:", error);
            } finally {
                setLoading(false);
            }
        };

        loadFeedback();
    }, [candidateId]);

    function handleAddFeedback() {
        if (!feedbackForm || !feedbackForm.comments) return alert('Enter feedback');
        setLoading(true);
        const fb: Feedback = {
            id: `f_${Date.now()}`,
            candidateId,
            interviewerName: feedbackForm.interviewerName,
            interviewStep: feedbackForm.interviewStep,
            rating: feedbackForm.rating,
            comments: feedbackForm.comments,
            nextStepNotes: feedbackForm.nextStepNotes,
            date: new Date().toISOString(),
        }
        onViewFeedback(candidateId)
        setFeedbackForm({
            interviewerName: '',
            interviewStep: '',
            rating: 0,
            comments: '',
            nextStepNotes: '',
        });

        graphqlService.addFeedback(fb)
            .then(() => {
                setLoading(false);
                alert('Feedback added successfully');
            })
            .catch((error) => {
                setLoading(false);
                console.error("Failed to add feedback:", error);
                alert('Failed to add feedback');
            });
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <button
                    onClick={() => onViewFeedback(candidateId)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4"
                >
                    ← Back to candidate
                </button>
                <h2 className="text-2xl font-bold text-gray-900">
                    Add Feedback for {selectedCandidate.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                    Position: {selectedCandidate.position}
                </p>
            </div>

            <div className="bg-white shadow rounded-lg p-8">
                <form onSubmit={handleAddFeedback} className="space-y-8">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Interviewer Name
                            </label>
                            <input
                                type="text"
                                required
                                value={feedbackForm.interviewerName}
                                onChange={(e) =>
                                    setFeedbackForm((prev) => ({
                                        ...prev,
                                        interviewerName: e.target.value,
                                    }))
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                                placeholder="Enter interviewer name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Interview Step
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
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                            >
                                <option value="">Select interview step</option>
                                <option value="Phone Screening">Phone Screening</option>
                                <option value="Technical Interview">
                                    Technical Interview
                                </option>
                                <option value="System Design">System Design</option>
                                <option value="Behavioral Interview">
                                    Behavioral Interview
                                </option>
                                <option value="Final Interview">Final Interview</option>
                                <option value="HR Interview">HR Interview</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Overall Rating
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Interview Comments
                        </label>
                        <textarea
                            required
                            rows={6}
                            value={feedbackForm.comments}
                            onChange={(e) =>
                                setFeedbackForm((prev) => ({
                                    ...prev,
                                    comments: e.target.value,
                                }))
                            }
                            placeholder="Share detailed feedback about the candidate's performance, strengths, areas for improvement, specific examples from the interview..."
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border resize-none"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Be specific and provide examples to help other interviewers
                            and hiring managers
                        </p>
                    </div>

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
                            Help the next interviewer by highlighting areas they should
                            explore further
                        </p>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 border-t">
                        <button
                            type="button"
                            onClick={() => onViewFeedback(candidateId)}
                            className="py-2 px-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Saving..." : "Save Feedback"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default FeedbackForm;
