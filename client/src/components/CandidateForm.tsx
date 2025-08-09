import { useState } from 'react';
import { mockGraphQL } from '../mock/mockData';
import type { Candidate } from '../types';
import { FormField } from './ui/FormField';
function CandidateForm() {
    const [loading, setLoading] = useState(false);
    const [candidateForm, setCandidateForm] = useState({
        name: "",
        email: "",
        position: "",
        experience: 0,
        skills: "",
        status: "screening" as Candidate["status"],
    });

    const handleAddCandidate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await mockGraphQL.addCandidate({
                ...candidateForm,
                skills: candidateForm.skills
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s.length > 0),
            });

            // Navigate back to candidates list

            setCandidateForm({
                name: "",
                email: "",
                position: "",
                experience: 0,
                skills: "",
                status: "screening",
            });
        } catch (error) {
            console.error("Failed to add candidate:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>{loading ? (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span>Loading...</span>
                </div>
            </div>
        ) : <div className="flex justify-center flex-col items-center p-6 ">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Add New Candidate
            </h2>

            <form onSubmit={handleAddCandidate} className="bg-white shadow rounded-lg p-6 space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormField
                        label="Name"
                        required
                        value={candidateForm.name}
                        onChange={(e) =>
                            setCandidateForm((prev) => ({ ...prev, name: e.target.value }))
                        }
                    />

                    <FormField
                        label="Email"
                        type="email"
                        required
                        value={candidateForm.email}
                        onChange={(e) =>
                            setCandidateForm((prev) => ({ ...prev, email: e.target.value }))
                        }
                    />

                    <FormField
                        label="Position"
                        required
                        value={candidateForm.position}
                        onChange={(e) =>
                            setCandidateForm((prev) => ({ ...prev, position: e.target.value }))
                        }
                    />

                    <FormField
                        label="Experience (years)"
                        type="number"
                        min={0}
                        value={candidateForm.experience}
                        onChange={(e) =>
                            setCandidateForm((prev) => ({
                                ...prev,
                                experience: parseInt(e.target.value) || 0
                            }))
                        }
                    />
                </div>

                <FormField
                    label="Skills (comma-separated)"
                    placeholder="React, TypeScript, Node.js"
                    value={candidateForm.skills}
                    onChange={(e) =>
                        setCandidateForm((prev) => ({ ...prev, skills: e.target.value }))
                    }
                />

                <FormField
                    label="Initial Status"
                    value={candidateForm.status}
                    onChange={(e) =>
                        setCandidateForm((prev) => ({
                            ...prev,
                            status: e.target.value as Candidate["status"]
                        }))
                    }
                    options={[
                        { value: "screening", label: "Screening" },
                        { value: "technical", label: "Technical" },
                        { value: "final", label: "Final" },
                        { value: "hired", label: "Hired" },
                        { value: "rejected", label: "Rejected" }
                    ]}
                />

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Add Candidate
                    </button>
                </div>
            </form>
        </div>}</>

    )
}

export default CandidateForm;
