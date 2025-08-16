import { useEffect, useState } from "react";
import { toast } from "sonner";
import { graphqlService } from "../../../services/graphql.service";
import type { CandidateFormData } from "../../../types/candidate";
import type { CandidateOutput } from "../../../types/outputs";
import { BasicInfoForm } from "../form/BasicInfoForm";

interface CandidateEditProps {
    candidateId: string;
    onCancel: (candidateId: string) => void;
    onUpdated: (candidateId: string) => void;
}

export function CandidateEdit({ candidateId, onCancel, onUpdated }: CandidateEditProps) {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [candidateForm, setCandidateForm] = useState<CandidateFormData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        currentLocation: "",
        citizenship: "",
        resumeUrl: "",
    });

    useEffect(() => {
        const loadCandidate = async () => {
            setLoading(true);
            try {
                const candidate: CandidateOutput = await graphqlService.getCandidateById(candidateId);
                setCandidateForm({
                    firstName: candidate.firstName,
                    lastName: candidate.lastName,
                    email: candidate.email,
                    phone: candidate.phone || "",
                    currentLocation: candidate.currentLocation || "",
                    citizenship: candidate.citizenship || "",
                    resumeUrl: candidate.resumeUrl || "",
                });
            } catch (error) {
                toast.error("Failed to load candidate details.");
                console.error("Error loading candidate:", error);
            } finally {
                setLoading(false);
            }
        };

        loadCandidate();
    }, [candidateId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!candidateForm.firstName.trim() || !candidateForm.lastName.trim()) {
            toast.error("First and last name are required.");
            return;
        }
        if (!candidateForm.email.trim()) {
            toast.error("Email is required.");
            return;
        }

        setSubmitting(true);
        try {
            await graphqlService.updateCandidate({
                id: candidateId,
                firstName: candidateForm.firstName,
                lastName: candidateForm.lastName,
                email: candidateForm.email,
                phone: candidateForm.phone || undefined,
                currentLocation: candidateForm.currentLocation || undefined,
                citizenship: candidateForm.citizenship || undefined,
                resumeUrl: candidateForm.resumeUrl || undefined,
            });
            toast.success("Candidate updated successfully.");
            onUpdated(candidateId);
        } catch (error) {
            toast.error("Failed to update candidate. Please try again.");
            console.error("Update candidate error:", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span>Loading candidate details...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <button
                    onClick={() => onCancel(candidateId)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4"
                >
                    ← Back
                </button>
                <h2 className="text-2xl font-bold text-gray-900">
                    Edit Candidate: {candidateForm.firstName} {candidateForm.lastName}
                </h2>
            </div>

            <form onSubmit={handleSubmit}>
                <BasicInfoForm candidateForm={candidateForm} setCandidateForm={setCandidateForm} />

                <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                        type="button"
                        onClick={() => onCancel(candidateId)}
                        disabled={submitting}
                        className="py-2 px-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? "Saving..." : "Update Candidate"}
                    </button>
                </div>
            </form>
        </div>
    );
}
