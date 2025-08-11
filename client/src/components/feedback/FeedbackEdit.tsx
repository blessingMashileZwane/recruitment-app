import { useEffect, useState } from "react";
import { graphqlService } from "../../services/graphql.service";
import type { UpdateInterviewStageInput, CreateInterviewStageInput } from "../../types/inputs";

type FeedbackEditProps = {
    jobApplicationId: string;
    feedbackId?: string;
    onCancel: () => void;
    onSave: (updatedFeedback: UpdateInterviewStageInput | CreateInterviewStageInput) => void;
};

export default function ({ jobApplicationId, feedbackId, onCancel, onSave }: FeedbackEditProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        interviewerName: "",
        name: "",
        description: "",
        feedback: "",
        rating: 3,
        comments: "",
        nextStepNotes: "",
    });

    useEffect(() => {
        if (!feedbackId) return;

        const loadFeedback = async () => {
            setLoading(true);
            try {
                const feedback = await graphqlService.getFeedbackById(feedbackId);
                setFormData({
                    interviewerName: feedback.interviewerName,
                    name: feedback.name,
                    description: feedback.description || "",
                    feedback: feedback.feedback,
                    rating: feedback.rating,
                    comments: feedback.comments,
                    nextStepNotes: feedback.nextStepNotes,
                });
            } catch (err) {
                console.error("Failed to load feedback", err);
            } finally {
                setLoading(false);
            }
        };

        loadFeedback();
    }, [feedbackId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "rating" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.interviewerName || !formData.name) {
            alert("Please fill in interviewer name and interview step");
            return;
        }

        try {
            if (feedbackId) {
                const updateData: UpdateInterviewStageInput = {
                    id: feedbackId,
                    ...formData
                };
                await graphqlService.updateFeedback(updateData);
                onSave(updateData);
            } else {
                const createData: CreateInterviewStageInput = {
                    ...formData,
                    jobApplicationId
                };
                await graphqlService.addFeedback(createData);
                onSave(createData);
            }
        } catch (err) {
            console.error("Failed to save feedback", err);
            alert("Failed to save feedback");
        }
    };

    if (loading) return <p>Loading feedback...</p>;

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">{feedbackId ? "Edit Feedback" : "Add Feedback"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block">
                    <span className="text-gray-700">Interviewer Name</span>
                    <input
                        type="text"
                        name="interviewerName"
                        value={formData.interviewerName}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border rounded p-2"
                    />
                </label>

                <label className="block">
                    <span className="text-gray-700">Interview Step</span>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. screening, technical, final"
                        className="mt-1 block w-full border rounded p-2"
                    />
                </label>

                <label className="block">
                    <span className="text-gray-700">Description</span>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={2}
                        className="mt-1 block w-full border rounded p-2"
                    />
                </label>

                <label className="block">
                    <span className="text-gray-700">Rating (1-5)</span>
                    <select
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded p-2"
                    >
                        {[1, 2, 3, 4, 5].map((r) => (
                            <option key={r} value={r}>
                                {r}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="block">
                    <span className="text-gray-700">Feedback</span>
                    <textarea
                        name="feedback"
                        value={formData.feedback}
                        onChange={handleChange}
                        rows={4}
                        className="mt-1 block w-full border rounded p-2"
                    />
                </label>

                <label className="block">
                    <span className="text-gray-700">Comments</span>
                    <textarea
                        name="comments"
                        value={formData.comments}
                        onChange={handleChange}
                        rows={4}
                        className="mt-1 block w-full border rounded p-2"
                    />
                </label>

                <label className="block">
                    <span className="text-gray-700">Next Step Notes</span>
                    <textarea
                        name="nextStepNotes"
                        value={formData.nextStepNotes}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1 block w-full border rounded p-2"
                    />
                </label>

                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}
